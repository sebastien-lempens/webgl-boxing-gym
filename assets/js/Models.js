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
    const meshes = await new Promise((resolve) => {
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
                    texture.needsUpdate = true
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
                    texture.needsUpdate = true
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
                  //  child.material.normalMapType = THREE.ObjectSpaceNormalMap
                    child.material.normalMap = texture
                    texture.needsUpdate = true
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
