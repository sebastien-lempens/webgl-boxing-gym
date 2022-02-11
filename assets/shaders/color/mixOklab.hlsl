/*
author: Bjorn Ottosson (@bjornornorn), Inigo Quiles
description: oklab to linear RGB https://bottosson.github.io/posts/oklab/
use: <float3\float4> mixOklab(<float3|float4> colorA, <float3|float4> colorB, float pct)
license: |
    The MIT License
    Copyright © 2020 Inigo Quilez
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Optimized linear-rgb color mix in oklab space, useful
    when our software operates in rgb space but we still
    we want to have intuitive color mixing - note the
    unexpected purples introduced when blending in rgb
    space (right columns) vs the intuitive transitions
    produced by the oklab color space (left columns).

    Now, when mixing linear rgb colors in oklab space, the
    linear transform from cone to Lab space and back can be
    omitted, saving three 3x3 transformation per blend!

    oklab was invented by Björn Ottosson: https://bottosson.github.io/posts/oklab

    More oklab on Shadertoy: https://www.shadertoy.com/view/WtccD7
*/

#ifndef FNC_MIXOKLAB
#define FNC_MIXOKLAB
float3 mixOklab( float3 colA, float3 colB, float h ) {
    // https://bottosson.github.io/posts/oklab
    const float3x3 kCONEtoLMS = float3x3(                
         0.4121656120,  0.2118591070,  0.0883097947,
         0.5362752080,  0.6807189584,  0.2818474174,
         0.0514575653,  0.1074065790,  0.6302613616);
    const float3x3 kLMStoCONE = float3x3(
         4.0767245293, -1.2681437731, -0.0041119885,
        -3.3072168827,  2.6093323231, -0.7034763098,
         0.2307590544, -0.3411344290,  1.7068625689);
    
    float factor = 1.0/3.0;
    // rgb to cone (arg of pow can't be negative)
    float3 lmsA = pow( mul(kCONEtoLMS, colA), float3(factor, factor, factor) );
    float3 lmsB = pow( mul(kCONEtoLMS, colB), float3(factor, factor, factor) );
    // lerp
    float3 lms = lerp( lmsA, lmsB, h );
    
    // gain in the middle (no oaklab anymore, but looks better?)
    // lms *= 1.0+0.2*h*(1.0-h);

    // cone to rgb
    return mul(kLMStoCONE, lms*lms*lms);
}

float4 mixOklab( float4 colA, float4 colB, float h ) {
    return vec4( mixOklab(colA.rgb, colB.rgb, h), lerp(colA.a, colB.a, h) );
}
#endif