import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
		this.#createLight()
		this.#createClock()
		this.#addListeners()
		this.#createControls()
		this.#createDebugPanel()
		this.#createLoaders()
		await this.#loadModel()
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
	}

	#render() {
		this.renderer.render(this.scene, this.camera)
	}
	#createParams() {
		this.params = {
			onTickModel: [],
			mouse: new THREE.Vector2(),
		}
	}
	#createScene() {
		this.scene = new THREE.Scene()
	}

	#createCamera() {
		this.camera = new THREE.PerspectiveCamera(
			75,
			this.container.clientWidth / this.container.clientHeight,
			0.1,
			100
		)
		this.camera.position.set(-1, 1, 2)
	}

	#createRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: window.devicePixelRatio === 1,
		})

		this.container.appendChild(this.renderer.domElement)

		this.renderer.setSize(
			this.container.clientWidth,
			this.container.clientHeight
		)
		this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
		this.renderer.setClearColor(0x121212)
		this.renderer.physicallyCorrectLights = true
	}

	#createLight() {
		this.pointLight = new THREE.PointLight(0xff0055, 500, 100, 2)
		this.pointLight.position.set(0, 10, 13)
		this.scene.add(this.pointLight)
	}

	#createLoaders() {
		this.loadingManager = new THREE.LoadingManager()

		this.loadingManager.onProgress = (url, loaded, total) => {
			// In case the progress count is not correct, see this:
			// https://discourse.threejs.org/t/gltf-file-loaded-twice-when-loading-is-initiated-in-loadingmanager-inside-onprogress-callback/27799/2
			console.log(`Loaded ${loaded} resources out of ${total} -> ${url}`)
		}

		this.loadingManager.onLoad = () => {
			console.log('All resources loaded')
		}

		//	this.gltfLoader = new GLTFLoader(this.loadingManager)
	}

	/**
	 * Load Models and append them to the scene
	 */
	async #loadModel() {
		const loadModels = new (await import('./Models.js')).default()
	}

	#createControls() {
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.enableDamping = true
	}

	async #createDebugPanel() {
		/**
		 * Load Tweakpane
		 */
		const loadDebugPanel = new (await import('./DebugPanel.js')).default()
		this.pane = loadDebugPanel.pane
		/**
		 * Scene configuration
		 */
		this.pane.addFolder({ title: 'Scene' })
		this.pane
			.addInput({ background: { r: 18, g: 18, b: 18 } }, 'background', {
				label: 'Background Color',
			})
			.on('change', (e) => {
				this.renderer.setClearColor(
					new THREE.Color(e.value.r / 255, e.value.g / 255, e.value.b / 255)
				)
			})
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
		this.renderer.setSize(
			this.container.clientWidth,
			this.container.clientHeight
		)
	}
}
