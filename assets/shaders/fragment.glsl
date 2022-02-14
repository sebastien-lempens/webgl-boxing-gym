uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;
varying vec3 vPosition;
varying vec2 vUv;
void main(){
    vec2 uv=vUv;
    vec2 mouse=uMouse;
    vec3 diffuse=texture2D(uTexture,uv).rgb;
    vec3 color=diffuse;
    gl_FragColor=vec4(color,1.);
}