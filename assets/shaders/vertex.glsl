uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;
void main(){
    vec3 updatePosition = position;
    vec4 mvPosition =  modelViewMatrix * vec4(updatePosition, 1.);
    vec4 pmvPosition = projectionMatrix * mvPosition;
    gl_Position= pmvPosition;
    vUv = uv;
    vPosition = position;
}
