/*
author: Patricio Gonzalez Vivo
description: clamp a value between 0 and 1
use: saturation(<float|vec2|vec3|vec4> value)
license: |
  Copyright (c) 2017 Patricio Gonzalez Vivo.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    
*/

#ifndef FNC_SATURATE
#define FNC_SATURATE
// #define saturate(x) clamp(x, 0.0, 1.0)
float saturate( float x){ return clamp(x, 0.0, 1.0); }
vec2  saturate( vec2 x ){ return clamp(x, 0.0, 1.0); }
vec3  saturate( vec3 x ){ return clamp(x, 0.0, 1.0); }
vec4  saturate( vec4 x ){ return clamp(x, 0.0, 1.0); }
#endif