import glsl from 'vite-plugin-glsl'
import { importMaps } from 'vite-plugin-import-maps'
import { defineConfig } from 'vite'

module.exports = defineConfig({
	plugins: [
		glsl(),
		// importMaps([
		// 	{
		// 		imports: {
		// 			three: 'https://unpkg.com/three@0.137.0/build/three.module.js',
		// 			'three-addons/': 'https://unpkg.com/three@0.137.0/examples/jsm/',
		// 			tweakpane: 'https://cdn.skypack.dev/tweakpane',
		// 		},
		// 	},
		// ]),
	],
})
