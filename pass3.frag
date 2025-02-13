// Pass 3 fragment shader
//
// Output fragment colour based using
//    (a) Cel shaded diffuse surface
//    (b) wide silhouette in black

#version 300 es

uniform mediump vec3 lightDir;     // direction toward the light in the VCS
uniform mediump vec2 texCoordInc;  // texture coord difference between adjacent texels

in mediump vec2 texCoords;              // texture coordinates at this fragment

// The following four textures are now available and can be sampled
// using 'texCoords'

uniform sampler2D colourSampler;
uniform sampler2D normalSampler;
uniform sampler2D depthSampler;
uniform sampler2D laplacianSampler;

out mediump vec4 outputColour; // the output fragment colour as RGBA with A=1

// Declaring variables outside of main to tidy code
const mediump float numQuanta = 4.0;
const mediump float kernelRadius = 3.0;
const mediump float threshold = 0.1;

void main() {

    // Look up depth and Laplacian
    mediump float depth = texture(depthSampler, texCoords).r;
    mediump float laplacian = texture(laplacianSampler, texCoords).r;

    // Discarding background pixels far from silhouettes
    // Adding a threshold to accurately edge-detect the laplacian

    if (depth > 0.99 && abs(laplacian) < threshold) {
        discard;
    }

    // Look up object color and normal
    mediump vec3 objectColor = texture(colourSampler, texCoords).rgb;
    mediump vec3 normal = normalize(texture(normalSampler, texCoords).xyz);

    // Compute quantized cel shading
    mediump float NdotL = max(dot(normal, normalize(lightDir)), 0.2);       // Compute NdotL and ensure it never falls below 0.2 
    NdotL = round(NdotL * numQuanta) / numQuanta;                           // Quantize lighting by rounding to nearest integer value
    mediump vec3 celShadedColor = objectColor * NdotL;                      // Compute colour

    // Search neighbouring pixels to compute the neighbouring laplacian, if this value is greater than the set threshold,
    // store the distance to the nearest edge
    // Looping through offsets from (0,0) (center) by (-kernelRadius, 0) (left) -> (+kernelRadius, 0) (right)
    // and (0, -kernelRadius) (bottom) -> (0, +kernelRadius) (top)
    
    mediump float minDist = kernelRadius;
    mediump vec2 offsets[5] = vec2[](
        vec2(0.0, 0.0),           // Center
        vec2(-kernelRadius, 0.0), // Left
        vec2(kernelRadius, 0.0),  // Right
        vec2(0.0, -kernelRadius), // Bottom
        vec2(0.0, kernelRadius)   // Top
    );

    for (int i = 0; i < 5; i++) {
        mediump vec2 offset = offsets[i] * texCoordInc;
        mediump float neighborLaplacian = texture(laplacianSampler, texCoords + offset).r;

        if (abs(neighborLaplacian) > threshold) {
            minDist = min(minDist, length(offsets[i]));
        }
    }

    // Compute the ratio of dist to edge vs the max dist (kernelRadius)
    mediump float blending = minDist / kernelRadius;

    // Using the step function to compute the final colour.
    // if the blending ratio < 0.5, step returns 0.0 forcing the edges to be black
    // else, it returns 1 so the colour will be cel shaded appropriately.
    mediump vec3 finalColor = celShadedColor * step(0.5, blending);
    outputColour = vec4(finalColor, 1.0);
}
