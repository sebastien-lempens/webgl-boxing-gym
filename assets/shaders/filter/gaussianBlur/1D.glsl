/*
author: Patricio Gonzalez Vivo
description: one dimension Gaussian Blur to be applied in two passes
use: gaussianBlur1D(<sampler2D> texture, <vec2> st, <vec2> pixel_direction , const int kernelSize)
options:
    GAUSSIANBLUR1D_TYPE:
    GAUSSIANBLUR1D_SAMPLER_FNC(POS_UV):
    GAUSSIANBLUR1D_KERNELSIZE: Use only for WebGL 1.0 and OpenGL ES 2.0 . For example RaspberryPis is not happy with dynamic loops. Default is 'kernelSize'
license: |
    Copyright (c) 2017 Patricio Gonzalez Vivo.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

#ifndef GAUSSIANBLUR1D_TYPE
#ifdef GAUSSIANBLUR_TYPE
#define GAUSSIANBLUR1D_TYPE GAUSSIANBLUR_TYPE
#else
#define GAUSSIANBLUR1D_TYPE vec4
#endif
#endif

#ifndef GAUSSIANBLUR1D_SAMPLER_FNC
#ifdef GAUSSIANBLUR_SAMPLER_FNC
#define GAUSSIANBLUR1D_SAMPLER_FNC(POS_UV) GAUSSIANBLUR_SAMPLER_FNC(POS_UV)
#else
#define GAUSSIANBLUR1D_SAMPLER_FNC(POS_UV) texture2D(tex, POS_UV)
#endif
#endif

#ifndef FNC_GAUSSIANBLUR1D
#define FNC_GAUSSIANBLUR1D

#ifdef GAUSSIANBLUR1D_DYNAMIC

GAUSSIANBLUR1D_TYPE gaussianBlur1D(in sampler2D tex,in vec2 st,in vec2 offset,const int kernelSize){
    GAUSSIANBLUR1D_TYPE accumColor = GAUSSIANBLUR1D_TYPE(0.0);
    
    float accumWeight = 0.0;
    const float k = 0.39894228;// 1 / sqrt(2*PI)
    float kernelSize2 = float(kernelSize)*float(kernelSize);
    for(int i = 0; i < 16; i++){
        if( i >= kernelSize)
            break;
        float x = -0.5 * (float(kernelSize) - 1.0)+float(i);
        float weight = (k/float(kernelSize)) * exp(-(x*x)/(2.0*kernelSize2));
        GAUSSIANBLUR1D_TYPE tex = GAUSSIANBLUR1D_SAMPLER_FNC(st + x * offset);
        accumColor += weight * tex;
        accumWeight += weight;
    }
    return accumColor/accumWeight;
}

#else
GAUSSIANBLUR1D_TYPE gaussianBlur1D(in sampler2D tex,in vec2 st,in vec2 offset,const int kernelSize){
    GAUSSIANBLUR1D_TYPE accumColor=GAUSSIANBLUR1D_TYPE(0.);
    #ifndef GAUSSIANBLUR1D_KERNELSIZE
    #define GAUSSIANBLUR1D_KERNELSIZE kernelSize
    #endif
    
    float accumWeight = 0.0;
    const float k = 0.39894228;// 1 / sqrt(2*PI)
    float kernelSize2=float(GAUSSIANBLUR1D_KERNELSIZE)*float(GAUSSIANBLUR1D_KERNELSIZE);
    for(int i = 0; i < GAUSSIANBLUR1D_KERNELSIZE; i++){
        float x = -0.5 * (float(GAUSSIANBLUR1D_KERNELSIZE) -1.0) + float(i);
        float weight = (k/float(GAUSSIANBLUR1D_KERNELSIZE)) * exp(-(x*x)/(2.0*kernelSize2));
        GAUSSIANBLUR1D_TYPE tex = GAUSSIANBLUR1D_SAMPLER_FNC(st + x * offset);
        accumColor += weight * tex;
        accumWeight += weight;
    }
    return accumColor/accumWeight;
}
#endif

#endif
