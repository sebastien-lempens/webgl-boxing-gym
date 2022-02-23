uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uDiffuse;
uniform sampler2D uDepth;

varying vec3 vPosition;
varying vec2 vUv;


#include "filter/edge";
void main(){
    vec2 uv=vUv;
    vec3 diffuse=texture2D(uDiffuse,uv).rgb;
    float depth=pow(texture2D(uDepth,uv).r,150.0);
    float edge=edge(uDiffuse,uv,vec2(.001,.001));
    vec3 color=vec3(diffuse);
    //color+=edge;
    gl_FragColor=vec4(color,1.); 
    //  gl_FragColor=vec4(vec3(circle),1.);
}