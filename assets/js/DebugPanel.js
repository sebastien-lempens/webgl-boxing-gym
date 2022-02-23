import * as THREE from 'three'
import { Pane } from 'tweakpane'

export default class DebugPanel {
	constructor() {
		this.app = window.__APP__
		this.init()
	}
	init() {
		this.pane = new Pane()
		this.#scenePanel()
		this.pane.addFolder({ title: 'Effects' })
		this.#effectBloomPanel()
		this.pane.addSeparator()
		this.#effectGodOfRaysPanel()
		this.pane.addSeparator()
		this.#effectDofPanel()
	}
	#scenePanel() {
		this.pane.addFolder({ title: 'Scene' })
		this.pane
			.addInput({ background: { r: 18, g: 18, b: 18 } }, 'background', {
				label: 'Background Color',
			})
			.on('change', (e) => {
				this.app.renderer.setClearColor(
					new THREE.Color(e.value.r / 255, e.value.g / 255, e.value.b / 255)
				)
			})
	}
	#effectDofPanel() {
		this.pane
			.addInput(
				{ bokehScale: this.app.params.effects.dof.scale },
				'bokehScale',
				{
					label: 'bokehScale',
					min: 0,
					max: 10,
					step: 0.001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'DepthOfFieldEffect') {
							effect.bokehScale = value
						}
					}
				})
			})
		this.pane
			.addInput(
				{ focusDistance: this.app.params.effects.dof.focusDistance },
				'focusDistance',
				{
					label: 'focusDistance',
					min: 0,
					max: 0.1,
					step: 0.0001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'DepthOfFieldEffect') {
							effect.circleOfConfusionMaterial.uniforms.focusDistance.value =
								value
						}
					}
				})
			})
		this.pane
			.addInput(
				{ focalLength: this.app.params.effects.dof.focalLength },
				'focalLength',
				{
					label: 'focalLength',
					min: 0,
					max: 0.1,
					step: 0.0001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'DepthOfFieldEffect') {
							effect.circleOfConfusionMaterial.uniforms.focalLength.value =
								value
						}
					}
				})
			})
	}
	#effectGodOfRaysPanel() {
		this.pane
			.addInput(
				{ density: this.app.params.effects.godrays.density },
				'density',
				{
					label: 'Density',
					min: 0,
					max: 10,
					step: 0.001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'GodRaysEffect') {
							effect.godRaysMaterial.uniforms.density.value = value
						}
					}
				})
			})
		this.pane
			.addInput({ decay: this.app.params.effects.godrays.decay }, 'decay', {
				label: 'Decay',
				min: 0.8,
				max: 1,
				step: 0.001,
			})
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'GodRaysEffect') {
							effect.godRaysMaterial.uniforms.decay.value = value
						}
					}
				})
			})
		this.pane
			.addInput(
				{ exposure: this.app.params.effects.godrays.exposure },
				'exposure',
				{
					label: 'Exposure',
					min: 1,
					max: 3,
					step: 0.001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'GodRaysEffect') {
							effect.godRaysMaterial.uniforms.exposure.value = value
						}
					}
				})
			})
	}
	#effectBloomPanel() {
		this.pane
			.addInput(
				{ intensity: this.app.params.effects.bloom.intensity },
				'intensity',
				{
					label: 'Bloom intensity',
					min: 0,
					max: 2,
					step: 0.001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'BloomEffect') {
							effect.intensity = value
						}
					}
				})
			})
		this.pane
			.addInput(
				{
					luminanceSmoothing: this.app.params.effects.bloom.luminanceSmoothing,
				},
				'luminanceSmoothing',
				{
					label: 'Bloom luminance Smoothing',
					min: 0,
					max: 1,
					step: 0.0001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'BloomEffect') {
							console.log(effect.luminanceMaterial)
							effect.luminanceMaterial.uniforms.smoothing.value = value
						}
					}
				})
			})
		this.pane
			.addInput(
				{
					luminanceThreshold: this.app.params.effects.bloom.luminanceThreshold,
				},
				'luminanceThreshold',
				{
					label: 'Bloom luminance Threshold',
					min: 0,
					max: 1,
					step: 0.0001,
				}
			)
			.on('change', ({ value }) => {
				this.app.composer.passes.forEach((pass) => {
					if (typeof pass.effects === 'object') {
						const [effect] = pass.effects
						if (effect.name === 'BloomEffect') {
							effect.luminanceMaterial.uniforms.threshold.value = value
						}
					}
				})
			})
	}
}
