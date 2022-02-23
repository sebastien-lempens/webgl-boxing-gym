uniform float uTime;
uniform sampler2D uDiffuse;
varying vec3 vPosition;
varying vec3 vMvPosition;
varying float zPos;
varying vec3 vTest;
varying vec2 vUv;
#include "generative/snoise";
#include "filter/gaussianBlur";

void main(){
    vec2 uv=vUv;
    vec3 diffuse=texture2D(uDiffuse,vUv).rgb;
    vec3 color=diffuse+vec3(zPos);
    vec3 noise=vec3(snoise3(vPosition*100.-uTime));

    
    gl_FragColor=vec4(color,0.1);
}