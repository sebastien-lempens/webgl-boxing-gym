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
								`/assets/texture/Diffuse/${name}.jpg`,
								(texture) => {
									if (texture) {
										texture.flipY = false
										child.material.side = THREE.DoubleSide

										if (name === 'WindowLight') {
											child.material.emissive = new THREE.Color(
												'rgb(255,235,210)'
											)
										} else if (name === 'Walls') {
											child.material.side = THREE.FrontSide
										}
										child.material.map = texture
									}
									resolve()
								}
							)
						})
						await new Promise((resolve) => {
							new THREE.TextureLoader(this.app.loadingManager).load(
								`/assets/texture/Roughness/${name}.jpg`,
								(texture) => {
									if (texture) {
										texture.flipY = false
										child.material.roughnessMap = texture
										if (name === 'Ceiling') {
											child.material.roughness = 2
										}
										if (name === 'Fan') {
											child.material.roughness = 0.3
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
						if (this.app.params.device !== 'mobile') {
							await new Promise((resolve) => {
								new THREE.TextureLoader(this.app.loadingManager).load(
									`/assets/texture/Normal/${name}.jpg`,
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
												child.material.normalScale = new THREE.Vector2(
													0.8,
													-1.5
												)
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
						}
						if (name === 'Fan') {
							const [fanBlade] = child.children.filter(
								({ name }) => name === 'FanBlade'
							)

							const [FanCage] = child.children.filter(
								({ name }) => name === 'FanCage'
							)
							FanCage.material.color = new THREE.Color('hsl(24,77%,68%)')
							FanCage.material.roughness = 0.15
							FanCage.material.metalness = 0.8
							this.app.params.onTickModel.push(fanBlade)
							fanBlade.onTick = (t) => {
								fanBlade.rotation.z = -t * 40
							}
						}
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
			let x = 2.5 - THREE.MathUtils.randFloat(0, 3)
			const y = THREE.MathUtils.randFloat(0.8, Math.max(2.2, 1)) - i * 0.0005
			let z = -1.5 + i * 0.001 + i * 0.0005
			vertices.push(x, y, z)
			if (this.app.params.device === 'mobile') {
				sizes.push(THREE.MathUtils.randInt(1, 2))
			} else {
				sizes.push(THREE.MathUtils.randInt(3, 10))
			}
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
			side: THREE.DoubleSide,
			uniforms: {
				uTime: { value: 0 },
			},
			vertexShader: `
	  	uniform float uTime;
      attribute float size;
      varying float vSize;
      void main() {
        vec3 updatedPosition = position;
        updatedPosition.x += cos(updatedPosition.y * 50.0 + uTime*0.028)*2.2;
        updatedPosition.z += cos(updatedPosition.z * 50.0 + uTime*0.08)*2.2;
        updatedPosition.y += sin(updatedPosition.x + uTime*0.025)*1.05;
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
        float centerPoint = 1. - length(gl_PointCoord - 0.5) ;
        float point = pow(centerPoint, 8.0);
        vec3 mixColor = mix(vec3(0.0), vec3(0.85), point);
        gl_FragColor = vec4(mixColor, .65);
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
