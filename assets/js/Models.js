import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import vertexShader from '/assets/shaders/vertex.glsl'
import fragmentShader from '/assets/shaders/fragment.glsl'

export default class Models {
	constructor() {
		this.app = window.__APP__
		this.init()
	}
	async init() {
		await this.#createShadedBox()
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
		this.app.scene.add(this.shadedBox)

		/** OnTick() */
		this.shadedBox.onTick = (elapsed) => {
			material.uniforms.uTime.value = elapsed
		}
	}
}
