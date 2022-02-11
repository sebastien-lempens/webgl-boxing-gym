#include ../generative/snoise.glsl;
#include ../generative/pnoise.glsl;
#include ../color/luma.glsl;
#include ../color/blend/softLight.glsl;

/*
author: Matt DesLauriers
description: Natural looking film grain using 3D noise functions (original source: https://github.com/mattdesl/glsl-film-grain). Inspired by [Martins Upitis](http://devlog-martinsh.blogspot.com/2013/05/image-imperfections-and-film-grain-post.html).
use: 
    - grain(<vec2> texCoord, <vec2> resolution [, <float> t, <float> multiplier])
    - grain(<sampler2D> texture, <vec2> texCoord, <float|vec2> resolution [, <float> t, <float> multiplier])
license: |
    The MIT License (MIT) Copyright (c) 2015 Matt DesLauriers
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

#ifndef GRAIN_TYPE
#define GRAIN_TYPE vec3
#endif

#ifndef GRAIN_SAMPLER_FNC
#define GRAIN_SAMPLER_FNC(POS_UV) texture2D(tex, POS_UV).rgb
#endif

#ifndef FNC_GRAIN
#define FNC_GRAIN
float grain(vec2 texCoord, vec2 resolution, float t, float multiplier) {
    vec2 mult = texCoord * resolution;
    float offset = snoise(vec3(mult / multiplier, t));
    float n1 = pnoise(vec3(mult, offset), vec3(1. / texCoord * resolution, 1.));
    return n1 / 2. + .5;
}

float grain(vec2 texCoord, vec2 resolution, float t) {
    return grain(texCoord, resolution, t, 2.5);
}

float grain(vec2 texCoord, vec2 resolution) {
    return grain(texCoord, resolution, 0.);
}

GRAIN_TYPE grain(sampler2D tex, vec2 st, vec2 resolution, float t, float multiplier ) {
    GRAIN_TYPE org = GRAIN_SAMPLER_FNC(st);

    float g = grain(st, resolution, t, multiplier);

    //get the luminance of the background
    float luminance = luma(org);
    
    //reduce the noise based on some 
    //threshold of the background luminance
    float response = smoothstep(0.05, 0.5, luminance);
    return mix( blendSoftLight(org, GRAIN_TYPE(g)), 
                org, 
                response * response);
}

GRAIN_TYPE grain(sampler2D tex, vec2 st, vec2 resolution, float t ) {
    return grain(tex, st, resolution, t, 2.5 );
}

GRAIN_TYPE grain(sampler2D tex, vec2 st, vec2 resolution) {
    return grain(tex, st, resolution, 0.);
}

GRAIN_TYPE grain(sampler2D tex, vec2 st, float resolution, float t, float multiplier  ) {
    return grain(tex, st, vec2(resolution), t, multiplier );
}

GRAIN_TYPE grain(sampler2D tex, vec2 st, float resolution, float t ) {
    return grain(tex, st, resolution, t, 2.5 );
}

GRAIN_TYPE grain(sampler2D tex, vec2 st, float resolution) {
    return grain(tex, st, resolution, 0.);
}

#endif