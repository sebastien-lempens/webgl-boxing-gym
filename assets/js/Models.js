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
						await new Promise((resolve) => {
							new THREE.TextureLoader(this.app.loadingManager).load(
								`/assets/texture/Diffuse/${name}.webp`,
								(texture) => {
									if (texture) {
										texture.flipY = false
										if (name === 'WindowLight') {
											child.material.side = THREE.DoubleSide
											child.material.emissive = new THREE.Color(0xffffff)
										}
										child.material.metalness = 0
										child.material.roughness = 1
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
										child.material.normalScale = new THREE.Vector2(0.5, 0.5)
										child.material.normalMap = texture
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
				const t = { value: 100 }
				material.onBeforeCompile = (shader) => {
					console.log(shader)
					shader.uniforms.metalness = t
					material.shader = shader
					shader.vertexShader = `
          varying vec3 vPosition; 
          ${shader.vertexShader}`
					shader.vertexShader = shader.vertexShader.replace(
						/#include <begin_vertex>/,
						(match) =>
							`
            ${match}
            vPosition = position;
            `
					)
					shader.fragmentShader = `
          varying vec3 vPosition; 
          ${shader.fragmentShader}`
					shader.fragmentShader = shader.fragmentShader.replace(
						/#include <dithering_fragment>/,
						(match) =>
							`
            ${match}
            vec3 lightDirection = normalize(vPosition - vec3(0.25,0.25,0.0));
            float light = max(dot(-lightDirection * cameraPosition, vNormal),0.0);
            vec3 updateFragColor = outgoingLight.rgb  + light * 0.3;
            gl_FragColor = vec4(vec3(updateFragColor), 1.0);
            `
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
