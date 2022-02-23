import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ShaderMaterial } from 'three'

export default class Models {
	constructor() {
		this.app = window.__APP__
		this.app.models = []
		this.init()
	}
	async init() {
		await this.#loadGltfModel()
		this.#loadParticles()
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
											child.material.emissive = new THREE.Color(
												'rgb(255,235,210)'
											)
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
											child.material.normalScale = new THREE.Vector2(
												-0.55,
												0.28
											)
										}
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
	}
	#loadParticles() {
		const vertices = []
		const sizes = []
		for (let i = 0; i < this.app.params.particles; i++) {
			let x = THREE.MathUtils.randFloatSpread(2)
			const y = 0.5 + Math.max(Math.abs(THREE.MathUtils.randFloatSpread(4)), 0)
			let z = THREE.MathUtils.randFloatSpread(2)
			z *= 2
			vertices.push(x, y, z)
			sizes.push(THREE.MathUtils.randFloat(1, 12))
			//sizes.push(15)
		}
		const particleGeometry = new THREE.BufferGeometry()
		particleGeometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(vertices, 3)
		)
		particleGeometry.setAttribute(
			'size',
			new THREE.Float32BufferAttribute(sizes, 1).setUsage(
				THREE.DynamicDrawUsage
			)
		)

		const particleMaterial = new ShaderMaterial({
			blending: THREE.AdditiveBlending,
			depthTest: true,
			transparent: true,
			uniforms: {
				uTime: { value: 0 },
			},
			vertexShader: `
	  	uniform float uTime;
      attribute float size;
      varying float vSize;
      void main() {
        vec3 updatedPosition = position;
        updatedPosition.x  = 1.0 + cos( updatedPosition.x * 25.0 + uTime*0.005)*1.5;
        updatedPosition.y += sin(updatedPosition.y * 25.0 + uTime*0.01)*2.01;
        updatedPosition.z += sin(updatedPosition.z * 50.0 + uTime*0.05)*0.01;
        gl_Position = projectionMatrix * viewMatrix * (modelMatrix * vec4(updatedPosition, 1.0));
        gl_PointSize = size;
        vec4 glPosition = viewMatrix * modelMatrix * vec4(updatedPosition, 1.0);
        gl_PointSize *= 1.0 / -glPosition.z;
        vSize =  size;
        }	
		`,
			fragmentShader: `
      varying float vSize;
      void main() {
        float centerPoint = 1.0 - length(gl_PointCoord - 0.5)/0.5 ;
        float point = pow(centerPoint, 1.0);
        vec3 mixColor = mix(vec3(0.0), vec3(0.85), point);
        gl_FragColor = vec4(mixColor, point);
      }
		`,
		})
		const particle = new THREE.Points(particleGeometry, particleMaterial)
		this.app.params.onTickModel.push(particle)
		particle.onTick = (t) => {
			particleMaterial.uniforms.uTime.value = t
		}
		this.app.scene.add(particle)
	}
}
