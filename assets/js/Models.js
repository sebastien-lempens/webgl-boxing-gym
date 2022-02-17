import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import vertexShader from '/assets/shaders/vertex.glsl'
import fragmentShader from '/assets/shaders/fragment.glsl'

export default class Models {
	constructor() {
		this.app = window.__APP__
		this.init()
	}
	async init() {
		await this.#loadGltfModel()
		//  await this.#createShadedBox()
	}
	async #loadGltfModel() {
		const group = new THREE.Group()
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('/assets/draco/')
		const gltfLoader = new GLTFLoader(this.app.loadingManager)
		gltfLoader.setDRACOLoader(dracoLoader)
		const meshes = await new Promise(async (resolve) => {
			gltfLoader.load('/assets/mesh/BoxingGym-draco.gltf', async (scene) => {
				const children = scene.scene.children[0].children
				await Promise.all(
					children.map(async (child) => {
						const { name } = child
						child.material.metalness = 0
						child.material.roughness = 1
						child.material.normalScale = new THREE.Vector2(1, 1)
						await new Promise((resolve) => {
							new THREE.TextureLoader(this.app.loadingManager).load(
								`/assets/texture/Diffuse/${name}.webp`,
								(texture) => {
									if (texture) {
										texture.flipY = false
										child.material.side = THREE.DoubleSide
										if (name === 'WindowLight') {
											child.material.emissive = new THREE.Color(0xffffff)
										}
										child.material.map = texture
									}
									resolve()
								}
							)
						})
						await new Promise((resolve) => {
							new THREE.TextureLoader(this.app.loadingManager).load(
								`/assets/texture/Roughness/${name}.webp`,
								(texture) => {
									if (texture) {
										texture.flipY = false
										child.material.roughnessMap = texture
									}
									if (name === 'Ceiling') {
										child.material.roughness = 2
									}
									if (name === 'SportBag') {
										child.material.roughness = 0.8
									}
									if (name === 'PunshingBall') {
										child.material.roughness = 1
									}
									if (name === 'Lockers') {
										child.material.roughness = 0.85
									}
									if (name === 'BoxingGlove') {
										child.material.roughness = 0.44
									}
									if (name === 'WaterBottle') {
										child.material.roughness = 0.4
									}
									if (name === 'Towel') {
										child.material.roughness = 0.84
									}
									if (name === 'Floor') {
										child.material.roughness = 0.8
									}
									if (name === 'Tube') {
										child.material.roughness = 0.85
									}

									resolve()
								}
							)
						})
						await new Promise((resolve) => {
							new THREE.TextureLoader(this.app.loadingManager).load(
								`/assets/texture/Normal/${name}.webp`,
								(texture) => {
									if (texture) {
										texture.flipY = false
										child.material.normalScale = new THREE.Vector2(1, 1)
										child.material.normalMap = texture
									}
									if (name === 'Carpet') {
										child.material.normalScale = new THREE.Vector2(1.5, 1)
									}
									if (name === 'BathTowel') {
										child.material.normalScale = new THREE.Vector2(8, 2)
									}
									if (name === 'PunshingBall') {
										child.material.normalScale = new THREE.Vector2(-1.4, -1)
									}
									if (name === 'Walls') {
										child.material.normalScale = new THREE.Vector2(0.8, -1.5)
									}
									if (name === 'Radiator') {
										child.material.normalScale = new THREE.Vector2(0, 1)
									}
									if (name === 'Bench') {
										child.material.normalScale = new THREE.Vector2(1, 5.5)
									}
									if (name === 'Towel') {
										child.material.normalScale = new THREE.Vector2(4, 4)
									}
									if (name === 'Floor') {
										child.material.normalScale = new THREE.Vector2(1.5, 3)
									}
									if (name === 'Tube') {
										child.material.normalScale = new THREE.Vector2(2, -0.3)
									}
									if (name === 'Lockers') {
										child.material.normalScale = new THREE.Vector2(-0.55, 0.28)
									}
									resolve()
								}
							)
						})
					})
				)
				resolve(children)
			})
		})
		group.add(...meshes)
		this.app.scene.add(group)
		return
		group.children.forEach((child) => {
			if (child.getObjectByName('Carpet')) {
				const material = child.getObjectByName('Carpet').material
				material.onBeforeCompile = (shader) => {
					shader.fragmentShader = shader.fragmentShader.replace(
						/#include <roughnessmap_fragment>/,
						(match) => {
							return `
						float roughnessFactor = roughness;
						#ifdef USE_ROUGHNESSMAP
							vec4 texelRoughness = texture2D( roughnessMap, vUv );
							roughnessFactor *= texelRoughness.g * texelRoughness.g;
						#endif
						`
						}
					)
				}
			}
		})
	}
	async #createShadedBox() {
		/**
		 * Create a box with a custom ShaderMaterial
		 */
		const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1)
		const texture = await new Promise((resolve) => {
			new THREE.TextureLoader(this.app.loadingManager).load(
				'/assets/texture/uvchecker.png',
				(texture) => {
					resolve(texture)
				}
			)
		})
		const material = new THREE.ShaderMaterial({
			uniforms: {
				uResolution: {
					value: new THREE.Vector2(
						this.app.container.clientWidth,
						this.app.container.clientHeight
					),
				},
				uTexture: {
					value: texture,
				},
				uTime: {
					value: null,
				},
				uMouse: {
					value: this.app.params.mouse,
				},
			},
			vertexShader,
			fragmentShader,
			transparent: true,
		})
		this.shadedBox = new THREE.Mesh(geometry, material)
		this.shadedBox.name = 'shadedBox'
		this.app.params.onTickModel.push(this.shadedBox)
		//this.app.scene.add(this.shadedBox)

		/** OnTick() */
		this.shadedBox.onTick = (elapsed) => {
			material.uniforms.uTime.value = elapsed
		}
	}
}
