import * as THREE from 'three'
import { Pane } from 'tweakpane'

export default class DebugPanel {
	constructor() {
		this.app = window.__APP__
		this.init()
	}
	init() {
		this.pane = new Pane()
		this.paneInstance = this.pane.addFolder({ title: 'Effects', expanded: false })
		this.#effectBloomPanel()
		this.paneInstance.addSeparator()
		this.#effectGodOfRaysPanel()
		this.paneInstance.addSeparator()
		this.#effectDofPanel()
	}

	#effectDofPanel() {
		this.paneInstance
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
		this.paneInstance
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
		this.paneInstance
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
		this.paneInstance
			.addInput(
				{ density: this.app.params.effects.godrays.density },
				'density',
				{
					label: 'GoR Density',
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
		this.paneInstance
			.addInput({ decay: this.app.params.effects.godrays.decay }, 'decay', {
				label: 'GoR Decay',
				min: 0.0,
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
		this.paneInstance
			.addInput(
				{ exposure: this.app.params.effects.godrays.exposure },
				'exposure',
				{
					label: 'GoR Exposure',
					min: 0,
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
		this.paneInstance
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
		this.paneInstance
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
		this.paneInstance
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
