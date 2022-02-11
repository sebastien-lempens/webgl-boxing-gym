/**
 * Boilerplate
 */
import * as THREE from 'three'
import { OrbitControls } from 'three-addons/controls/OrbitControls'
import { GLTFLoader } from 'three-addons/loaders/GLTFLoader'
import { Pane } from 'tweakpane'
import vertexShader from './assets/shaders/vertex.glsl'
import fragmentShader from './assets/shaders/fragment.glsl'

;(async () => {
	/**
	 * Debug
	 */
	const pane = new Pane()
	const guiFolder1 = pane.addFolder({
		title: 'Welcome',
		expanded: false,
	})
	/**
	 * Global Params
	 */
	const params = {
		mouse: new THREE.Vector2(),
	}
	const meshTickArray = []

	/**
	 * Base
	 */
	const canvas = document.querySelector('canvas.webgl')
	const scene = new THREE.Scene()
	scene.background = new THREE.Color('whitesmoke')
	scene.add(new THREE.GridHelper(10, 10))

	/**
	 * Models
	 */
	const meshGeometry = new THREE.PlaneBufferGeometry(2, 1)
	const meshMaterial = new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			uResolution: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
			uTexture: {
				value: new THREE.TextureLoader().load('./assets/images/texture.jpg'),
			},
			uTime: {
				value: null,
			},
			uMouse: {
				value: params.mouse,
			},
		},
		vertexShader,
		fragmentShader,
	})
	const mesh = new THREE.Mesh(meshGeometry, meshMaterial)
	meshTickArray.push(mesh)
	mesh.tick = (time) => {
		mesh.material.uniforms.uTime.value = time
		mesh.material.uniforms.uMouse.value = params.mouse
	}
	scene.add(mesh)
	/**
	 * Lights
	 */
	const ambientLight = new THREE.AmbientLight(0xffffff, 1)
	scene.add(ambientLight)

	/**
	 * Camera
	 */
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		500
	)
	camera.position.z = 2
	scene.add(camera)

	/**
	 * Control
	 */
	const controls = new OrbitControls(camera, canvas)
	controls.enableDamping = true

	/**
	 * Events
	 */
	window.addEventListener('resize', () => {
		// Update sizes
		const width = window.innerWidth
		const height = window.innerHeight

		// Update camera
		camera.aspect = width / height
		camera.updateProjectionMatrix()

		// Update renderer
		renderer.setSize(width, height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	})

	window.addEventListener('mousemove', ({ clientX, clientY }) => {
		params.mouse.x = clientX / window.innerWidth
		params.mouse.y = 1.0 - clientY / window.innerHeight
	})

	/**
	 * Renderer
	 */
	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
	})
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.render(scene, camera)
	renderer.setAnimationLoop(render)
	/**
	 * Animate
	 */
	const timer = new THREE.Clock()
	function render() {
		// Update Time
		let time = timer.getElapsedTime()
		// Update controls
		controls.update()
		// Meshes Tick Update
		meshTickArray.forEach((mesh) => mesh.tick(time))
		// Render
		renderer.render(scene, camera)
	}
})()
