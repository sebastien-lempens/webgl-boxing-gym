/*
author: Patricio Gonzalez Vivo
description: expands mix to linearly mix more than two values
use: mix(<float|float2|float3|float4> a, <float|float2|float3|float4> b, <float|float2|float3|float4> c [, <float|float2|float3|float4> d], <float> pct)
license: |
    Copyright (c) 2017 Patricio Gonzalez Vivo.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    
*/

#ifndef FNC_MIX
#define FNC_MIX

float   mmix(in float a, in float b, in float c) { return mix(a, b, c); }
float2  mmix(in float2 a, in float2 b, in float c) { return mix(a, b, c); }
float2  mmix(in float2 a, in float2 b, in float2 c) { return mix(a, b, c); }
float3  mmix(in float3 a, in float3 b, in float c) { return mix(a, b, c); }
float3  mmix(in float3 a, in float3 b, in float3 c) { return mix(a, b, c); }
float4  mmix(in float4 a, in float4 b, in float c) { return mix(a, b, c); }
float4  mmix(in float4 a, in float4 b, in float4 c) { return mix(a, b, c); }

float mmix(float a , float b, float c, float pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float2 mmix(float2 a , float2 b, float2 c, float pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float2 mmix(float2 a , float2 b, float2 c, float2 pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float3 mmix(float3 a , float3 b, float3 c, float pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float3 mmix(float3 a , float3 b, float3 c, float3 pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float4 mmix(float4 a , float4 b, float4 c, float pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float4 mmix(float4 a , float4 b, float4 c, float4 pct) {
    return mmix(
        mmix(a, b, 2. * pct),
        mmix(b, c, 2. * (max(pct, .5) - .5)),
        step(.5, pct)
    );
}

float mmix(in float a , in float b, in float c, in float d, in float pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}

float2 mmix(in float2 a , in float2 b, in float2 c, in float2 d, in float pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}

float2 mmix(in float2 a , in float2 b, in float2 c, in float2 d, in float2 pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}

float3 mmix(in float3 a , in float3 b, in float3 c, in float3 d, in float pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}

float3 mmix(in float3 a , in float3 b, in float3 c, in float3 d, in float3 pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}

float4 mmix(in float4 a , in float4 b, in float4 c, in float4 d, in float pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}

float4 mmix(in float4 a , in float4 b, in float4 c, in float4 d, in float4 pct) {
    return mmix(
        mmix(a, b, 3. * pct),
        mmix(b,
            mmix( c,
                d,
                3. * (max(pct, .66) - .66)),
            3. * (clamp(pct, .33, .66) - .33)
        ),
        step(.33, pct)
    );
}
#endif
