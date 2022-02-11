#include ../math/lengthSq.glsl;

/*
author: Patricio Gonzalez Vivo
description: Barrel distortion
use: barrel(sampler2D tex, <vec2> st, [, <vec2|float> sdf])
options:
    BARREL_DISTANCE: function used to shape the distortion, defaults to radial shape with lengthSq
    BARREL_TYPE: return type, defaults to vec3
    BARREL_SAMPLER_FNC: function used to sample the input texture, defaults to texture2D(tex, POS_UV).rgb
    BARREL_OCT_1: one octave of distortion
    BARREL_OCT_2: two octaves of distortion
    BARREL_OCT_3: three octaves of distortion
license: |
    Copyright (c) 2017 Patricio Gonzalez Vivo
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    

*/

#ifndef BARREL_DISTANCE
#define BARREL_DISTANCE dist
#endif

#ifndef BARREL_TYPE
#define BARREL_TYPE vec3
#endif

#ifndef BARREL_SAMPLER_FNC
#define BARREL_SAMPLER_FNC(POS_UV) texture2D(tex, POS_UV).rgb
#endif

#ifndef FNC_BARREL
#define FNC_BARREL
vec2 barrel(vec2 st, float amt, float dist) {
    return st + (st-.5) * (BARREL_DISTANCE) * amt;
}

vec2 barrel(vec2 st, float amt) {
    return barrel(st, amt, lengthSq(st-.5));
}

BARREL_TYPE barrel(in sampler2D tex, in vec2 st, float offset) {
    BARREL_TYPE a1 = BARREL_SAMPLER_FNC( barrel(st, .0, offset));
    BARREL_TYPE a2 = BARREL_SAMPLER_FNC( barrel(st, .2, offset));
    BARREL_TYPE a3 = BARREL_SAMPLER_FNC( barrel(st, .4, offset));
    BARREL_TYPE a4 = BARREL_SAMPLER_FNC( barrel(st, .6, offset));
#ifdef BARREL_OCT_1
    return (a1+a2+a3+a4)/4.;
#endif
    BARREL_TYPE a5 = BARREL_SAMPLER_FNC( barrel(st, .8, offset));
    BARREL_TYPE a6 = BARREL_SAMPLER_FNC( barrel(st, 1.0, offset));
    BARREL_TYPE a7 = BARREL_SAMPLER_FNC( barrel(st, 1.2, offset));
    BARREL_TYPE a8 = BARREL_SAMPLER_FNC( barrel(st, 1.4, offset));
#ifdef BARREL_OCT_2
    return (a1+a2+a3+a4+a5+a6+a7+a8)/8.;
#endif
    BARREL_TYPE a9 = BARREL_SAMPLER_FNC( barrel(st, 1.6, offset));
    BARREL_TYPE a10 = BARREL_SAMPLER_FNC( barrel(st, 1.8, offset));
    BARREL_TYPE a11 = BARREL_SAMPLER_FNC( barrel(st, 2.0, offset));
    BARREL_TYPE a12 = BARREL_SAMPLER_FNC( barrel(st, 2.2, offset));
    return (a1+a2+a3+a4+a5+a6+a7+a8+a9+a10+a11+a12)/12.;
}

BARREL_TYPE barrel(in sampler2D tex, in vec2 st, in vec2 offset) {
    return barrel(tex, st, dot(vec2(.5), offset));
}

BARREL_TYPE barrel(in sampler2D tex, in vec2 st) {
    return barrel(tex, st, lengthSq(st-.5));
}

#endif
