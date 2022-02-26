import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
	BloomEffect,
	GodRaysEffect,
	EffectComposer,
	EffectPass,
	RenderPass,
	BlendFunction,
	DepthOfFieldEffect,
	HueSaturationEffect,
	BrightnessContrastEffect,
	SMAAEffect,
	SMAAImageLoader,
	VignetteEffect,
	NoiseEffect,
} from 'postprocessing'
import myShaderPass from './customPass'

export default class App {
	#resizeCallback = () => this.#onResize()
	#mouseMoveCallback = (e) => this.#onMouseMove(e)

	constructor(container) {
		this.container = document.querySelector(container)
	}

	async init() {
		window.__APP__ = this
		this.#createParams()
		this.#createScene()
		this.#createCamera()
		this.#createRenderer()
		this.#createComposer()
		this.#createLight()
		this.#createClock()
		this.#addListeners()
		this.#createControls()
		this.#createDebugPanel()
		await this.#loadModel()
		this.#addEffects()
		this.#createLoaders()

		this.renderer.setAnimationLoop(() => {
			this.#update()
			this.#render()
		})
	}
	destroy() {
		this.renderer.dispose()
		this.#removeListeners()
	}

	#update() {
		const elapsed = this.clock.getElapsedTime()
		this.controls.update()
		if (this.params.onTickModel.length > 0) {
			this.params.onTickModel.forEach((model) => {
				if (typeof model.onTick === 'function') {
					return model.onTick(elapsed)
				}
			})
		}
		this.params.uniforms.time = elapsed
	}

	#render() {
		this.composer.render()
	}
	#createParams() {
		this.params = {
			get device() {
				let device = null
				if (window.matchMedia('(min-width: 400px)').matches) {
					device = 'mobile'
				}
				if (window.matchMedia('(min-width: 768px)').matches) {
					device = 'tablet'
				}
				if (window.matchMedia('(min-width: 1200px)').matches) {
					device = 'desktop'
				}
				return device
			},
			loading: {
				el: document.querySelector('.loading'),
			},
			onTickModel: [],
			mouse: new THREE.Vector2(),
			uniforms: {
				time: 0,
			},
			isSceneLoaded: false,
			effects: {
				godrays: {
					density: 6.8,
					decay: 0.8,
					exposure: 0.2,
				},
				bloom: {
					luminanceThreshold: 0.01,
					luminanceSmoothing: 0.01,
					intensity: 0.15,
				},
				dof: {
					scale: 2.5,
					focusDistance: 0.045,
					focalLength: 0.07,
				},
			},
			opening: {
				delay: 4,
			},
			particles: 2000,
		}
	}
	#createScene() {
		this.scene = new THREE.Scene()
		this.sceneTarget = new THREE.Scene()
	}
	#createCamera() {
		this.camera = new THREE.PerspectiveCamera(
			45,
			this.container.clientWidth / this.container.clientHeight,
			0.01,
			100
		)
		this.camera.position.set(-5, 1, 4)
		this.cameraTarget = new THREE.OrthographicCamera()
		this.cameraTarget.position.z = 0.1
	}
	#createRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			powerPreference:
				this.params.device === 'mobile' ? 'low-power' : 'high-performance',
			stencil: false,
			depth: false,
		})
		this.container.appendChild(this.renderer.domElement)
		this.renderer.setSize(
			this.container.clientWidth,
			this.container.clientHeight
		)
		let pixelRatio = 2
		if (this.params.device === 'tablet') {
			pixelRatio = 1
		} else if (this.params.device === 'mobile') {
			pixelRatio = 1 / 4
		}
		//console.log(this.params.device, pixelRatio);
		this.renderer.setPixelRatio(pixelRatio)
		this.renderer.setClearColor(new THREE.Color('black'))
		this.renderer.physicallyCorrectLights = true
		this.renderer.toneMapping = 5
	}
	#createComposer() {
		this.composer = new EffectComposer(this.renderer, {
			frameBufferType: THREE.HalfFloatType,
		})
		this.composer.addPass(new RenderPass(this.scene, this.camera))
	}
	#createLight() {
		const light = new THREE.AmbientLight(new THREE.Color('hsl(206,96%,65%)'))
		light.intensity = 0.55
		this.scene.add(light)

		const lightWindow = new THREE.PointLight(
			new THREE.Color('hsl(29,25%,63%)'),
			3.25,
			4,
			-1.5
		)
		lightWindow.name = 'lightWindow'
		lightWindow.position.set(1.2, 2.5, -1.2)
		this.lightWindow = lightWindow
		this.scene.add(lightWindow)

		const lightSide = new THREE.PointLight(new THREE.Color('hsl(206,54%,58%)'))
		lightSide.intensity = 0.4
		lightSide.distance = 8.5
		lightSide.decay = -2.1
		lightSide.name = 'lightSide'
		lightSide.position.set(-2.85, 1.25, 1.85)
		this.scene.add(lightSide)
	}
	#createLoaders() {
		this.loadingManager = new THREE.LoadingManager()
		const fill = this.params.loading.el.querySelector('.loading-filling')
		this.loadingManager.onProgress = (url, loaded, total) => {
			// In case the progress count is not correct, see this:
			// https://discourse.threejs.org/t/gltf-file-loaded-twice-when-loading-is-initiated-in-loadingmanager-inside-onprogress-callback/27799/2
			//	console.log(`Loaded ${loaded} resources out of ${total} -> ${url}`)
			const percent = 100 - Math.floor((loaded / total) * 100)
			fill.style.clipPath = `inset(${percent}% 0 0 0)`
		}

		this.loadingManager.onLoad = async () => {
			console.log('All resources loaded')
			this.params.loading.el.classList.add('end')
			await this.#opening()
		}

		//	this.gltfLoader = new GLTFLoader(this.loadingManager)
	}
	async #loadModel() {
		const loadModels = new (await import('./Models.js')).default()
	}
	async #addEffects() {
		this.scene.onAfterRender = (webgl, scene) => {
			if (this.params.isSceneLoaded) {
				return
			}
			scene.traverse(async (item) => {
				if (item.name === 'WindowLight') {
					this.params.isSceneLoaded = true

					/** DepthOfFieldEffect */
					this.composer.addPass(
						new EffectPass(
							this.camera,
							new DepthOfFieldEffect(this.camera, {
								bokehScale: this.params.effects.dof.scale,
								focusDistance: this.params.effects.dof.focusDistance,
								focalLength: this.params.effects.dof.focalLength,
							})
						)
					)
					/** BloomEffect */
					this.composer.addPass(
						new EffectPass(
							this.camera,
							new BloomEffect({
								luminanceThreshold:
									this.params.effects.bloom.luminanceThreshold,
								luminanceSmoothing:
									this.params.effects.bloom.luminanceSmoothing,
								intensity: this.params.effects.bloom.intensity,
							})
						)
					)
					/** HueSaturationEffect */
					this.composer.addPass(
						new EffectPass(
							this.camera,
							new HueSaturationEffect({ saturation: -0.05 })
						)
					)
					/** BrightnessContrastEffect */
					this.composer.addPass(
						new EffectPass(
							this.camera,
							new BrightnessContrastEffect({
								brightness: -0.05,
								contrast: -0.2,
							})
						)
					)
					/** GodRaysEffect */
					this.composer.addPass(
						new EffectPass(
							this.camera,
							new GodRaysEffect(this.camera, item, {
								blur: true,
								blurriness: 15,
								samples: 130,
								clampMax: 0.9,
								weight: 0.5,
								decay: this.params.effects.godrays.decay,
								density: this.params.effects.godrays.density,
								exposure: this.params.effects.godrays.exposure,
							})
						)
					)
					/** NoiseEffect */
					if (this.params.device !== 'mobile') {
						this.composer.addPass(
							new EffectPass(
								this.camera,
								new NoiseEffect({
									blendFunction: BlendFunction.SCREEN,
									premultiply: true,
								})
							)
						)

						this.composer.passes.forEach((pass) => {
							if (pass && pass.name === 'EffectPass') {
								const [effect] = pass.effects
								if (effect && effect.name === 'NoiseEffect') {
									effect.blendMode.opacity.value =
										this.params.device === 'mobile' ? 0.2 : 0.85
								}
							}
						})
						/** VignetteEffect */
						this.composer.addPass(
							new EffectPass(this.camera, new VignetteEffect())
						)
					}

					/** Custom */
					this.composer.addPass(myShaderPass)

					/** SMAAEffect */
					// const assets = new Map()
					// const smaaImageLoader = new SMAAImageLoader(this.loadingManager)
					// await new Promise((resolve) => {
					// 	smaaImageLoader.load(([search, area]) => {
					// 		assets.set('smaa-search', search)
					// 		assets.set('smaa-area', area)
					// 		resolve()
					// 	})
					// })
					// this.composer.addPass(
					// 	new EffectPass(
					// 		this.camera,
					// 		new SMAAEffect(assets.get('smaa-search'), assets.get('smaa-area'))
					// 	)
					// )
				}
			})
		}
		//console.log(myShaderPass)
	}
	#createControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.target = new THREE.Vector3(0, 1, 0)
		this.controls.enableDamping = true
	}
	async #createDebugPanel() {
		/**
		 * Load Tweakpane
		 */
		const loadDebugPanel = new (await import('./DebugPanel.js')).default()
		this.pane = loadDebugPanel.pane
	}
	async #opening() {
		const [child] = myShaderPass.scene.children
		this.params.onTickModel.push(this.camera)
		//		await new Promise((resolve) => setTimeout(resolve, 2000))
		let progress = 0
		this.camera.onTick = (t) => {
			t -= 2
			if (t > this.params.opening.delay) {
				//	return
			}
			this.camera.position.x += (0.0 - this.camera.position.x) * 0.0156
			/** Shaderpass */
			child.material.uniforms.uTime.value = t
			child.material.uniforms.uProgress.value = progress + t * 0.5
		}
	}
	#createClock() {
		this.clock = new THREE.Clock()
	}
	#addListeners() {
		window.addEventListener('resize', this.#resizeCallback, { passive: true })
		window.addEventListener('mousemove', this.#mouseMoveCallback, {
			passive: true,
		})
	}
	#removeListeners() {
		window.removeEventListener('resize', this.#resizeCallback, {
			passive: true,
		})
		window.removeEventListener('mousemove', this.#resizeCallback, {
			passive: true,
		})
	}
	#onMouseMove({ clientX, clientY }) {
		this.params.mouse.x = (clientX / this.container.clientWidth) * 2 - 1
		this.params.mouse.y = (-clientY / this.container.clientHeight) * 2 + 1
	}
	#onResize() {
		this.camera.aspect =
			this.container.clientWidth / this.container.clientHeight
		this.camera.updateProjectionMatrix()
		this.composer.setSize(
			this.container.clientWidth,
			this.container.clientHeight
		)
	}
}
