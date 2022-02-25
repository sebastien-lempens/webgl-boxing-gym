import { ShaderMaterial } from 'three'
import { ShaderPass } from 'postprocessing'

const myShaderMaterial = new ShaderMaterial({
	transparent: true,
	uniforms: {
		tDiffuse: {
			value: '',
		},
        uProgress:{value:0},
		uTime: { value: 0 },
	},
	vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,
	fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uProgress;
    varying vec2 vUv;
    void main() {
        vec2 uv = vUv;
        float uvCenter = uProgress-length(uv-0.5);
        vec3 color = texture2D(tDiffuse,vUv).rgb;
        float mask = smoothstep(0.1,0.8, uvCenter);
        color = mix(vec3(0.0),color,mask);
        gl_FragColor = vec4(color, 1.0);
    }   
    `,
})
const myShaderPass = new ShaderPass(myShaderMaterial, 'tDiffuse')
myShaderPass.renderToScreen = true
export default myShaderPass
