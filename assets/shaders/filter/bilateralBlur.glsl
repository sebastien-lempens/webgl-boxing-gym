#include ../color/space/rgb2luma.glsl;

/*
author: Patricio Gonzalez Vivo
description: TODO
use: bilateralBlur(<sampler2D> texture, <vec2> st, <vec2> duv)
options: TODO
license: TODO
*/

#ifndef BILATERALBLUR_AMOUNT
#define BILATERALBLUR_AMOUNT bilateralBlur13
#endif

#ifndef BILATERALBLUR_TYPE
#define BILATERALBLUR_TYPE vec4
#endif

#ifndef BILATERALBLUR_SAMPLER_FNC
#define BILATERALBLUR_SAMPLER_FNC(POS_UV) texture2D(tex, POS_UV)
#endif

#ifndef BILATERALBLUR_LUMA
#define BILATERALBLUR_LUMA(RGB) rgb2luma(RGB.rgb)
#endif

#include bilateralBlur/2D.glsl;

#ifndef FNC_BILATERALFILTER
#define FNC_BILATERALFILTER
BILATERALBLUR_TYPE bilateralBlur(in sampler2D tex, in vec2 st, in vec2 offset, const int kernelSize) {
  return bilateralBlur2D(tex, st, offset, kernelSize);
}

BILATERALBLUR_TYPE bilateralBlur13(in sampler2D tex, in vec2 st, in vec2 offset) {
  return bilateralBlur(tex, st, offset, 7);
}

BILATERALBLUR_TYPE bilateralBlur9(in sampler2D tex, in vec2 st, in vec2 offset) {
  return bilateralBlur(tex, st, offset, 5);
}

BILATERALBLUR_TYPE bilateralBlur5(in sampler2D tex, in vec2 st, in vec2 offset) {
  return bilateralBlur(tex, st, offset, 3);
}

BILATERALBLUR_TYPE bilateralBlur(in sampler2D tex, in vec2 st, in vec2 offset) {
  return BILATERALBLUR_AMOUNT(tex, st, offset);
}
#endif
