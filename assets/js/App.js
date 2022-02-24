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
  VignetteEffect,
  NoiseEffect,
} from 'postprocessing'

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
    this.#createLoaders()
    await this.#loadModel()
    this.#addEffects()

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
      onTickModel: [],
      mouse: new THREE.Vector2(),
      uniforms: {
        time: 0,
      },
      isSceneLoaded: false,
      effects: {
        godrays: {
          density: 2.5,
          decay: 0.8,
          exposure: 1.2,
        },
        bloom: {
          luminanceThreshold: 0.01,
          luminanceSmoothing: 0.01,
          intensity: 0.15,
        },
        dof: {
          scale: 2.5,
          focusDistance: 0.05,
          focalLength: 0.07,
        },
      },
      particles: 2000,
    }
  }
  #createScene() {
    this.scene = new THREE.Scene()
    this.sceneTarget = new THREE.Scene()
    this.sceneTarget.background = new THREE.Color({ color: 'yellow' })
  }
  #createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.container.clientWidth / this.container.clientHeight,
      0.01,
      100
    )
    this.camera.position.set(-2, 2, 4)
    this.cameraTarget = new THREE.OrthographicCamera()
    this.cameraTarget.position.z = 0.1
  }
  #createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      alpha: true,
      antialias: window.devicePixelRatio === 1,
      stencil: false,
      depth: false,
    })
    this.container.appendChild(this.renderer.domElement)
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    )
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(new THREE.Color('#282b2c'))
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
    const light = new THREE.AmbientLight(0xffffff)
    light.intensity = 1.5
    this.scene.add(light)

    const lightWindow = new THREE.PointLight(
      new THREE.Color('rgb(29,25%,63%)'),
      2.5,
      4,
      -1.5
    )
    lightWindow.name = 'lightWindow'
    lightWindow.position.set(1.2, 2.5, -1.2)
    this.lightWindow = lightWindow
    this.scene.add(lightWindow)

    const lightSide = new THREE.PointLight(new THREE.Color('hsl(206,54%,58%)'))
    lightSide.intensity = 0.5
    lightSide.distance = 7
    lightSide.decay = -2.35
    lightSide.name = 'lightSide'
    lightSide.position.set(-2.85, 1.25, 1.85)
    this.scene.add(lightSide)
  }
  #createLoaders() {
    this.loadingManager = new THREE.LoadingManager()

    this.loadingManager.onProgress = (url, loaded, total) => {
      // In case the progress count is not correct, see this:
      // https://discourse.threejs.org/t/gltf-file-loaded-twice-when-loading-is-initiated-in-loadingmanager-inside-onprogress-callback/27799/2
      //	console.log(`Loaded ${loaded} resources out of ${total} -> ${url}`)
    }

    this.loadingManager.onLoad = () => {
      console.log('All resources loaded')
    }

    //	this.gltfLoader = new GLTFLoader(this.loadingManager)
  }
  async #loadModel() {
    const loadModels = new (await import('./Models.js')).default()
  }
  async #addEffects() {
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
          luminanceThreshold: this.params.effects.bloom.luminanceThreshold,
          luminanceSmoothing: this.params.effects.bloom.luminanceSmoothing,
          intensity: this.params.effects.bloom.intensity,
        })
      )
    )
    /** HueSaturationEffect */
    this.composer.addPass(
      new EffectPass(this.camera, new HueSaturationEffect({ saturation: -0.2 }))
    )
    /** BrightnessContrastEffect */
    this.composer.addPass(
      new EffectPass(
        this.camera,
        new BrightnessContrastEffect({ brightness: -0.05, contrast: -0.15 })
      )
    )

    /** NoiseEffect */
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
          effect.blendMode.opacity.value = 0.45
        }
      }
    })
    /** GodRaysEffect */
    this.scene.onAfterRender = (webgl, scene) => {
      if (this.params.isSceneLoaded) {
        return
      }
      scene.traverse((item) => {
        if (item.name === 'WindowLight') {
          this.params.isSceneLoaded = true
          this.composer.addPass(
            new EffectPass(
              this.camera,
              new GodRaysEffect(this.camera, item, {
                blur: true,
                blurriness: 15,
                samples: 80,
                clampMax: 0.9,
                weight: 0.5,
                decay: this.params.effects.godrays.decay,
                density: this.params.effects.godrays.density,
                exposure: this.params.effects.godrays.exposure,
              })
            )
          )
        }
      })
    }

    /** SMAAEffect */
    const areaImage = new Image()
    areaImage.src = SMAAEffect.areaImageDataURL
    const searchImage = new Image()
    searchImage.src = SMAAEffect.searchImageDataURL
    this.composer.addPass(
      new EffectPass(this.camera, new SMAAEffect(searchImage, areaImage))
    )
    /** VignetteEffect */
    this.composer.addPass(new EffectPass(this.camera, new VignetteEffect()))
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
