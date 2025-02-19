// Pass 2 fragment shader
//
// Outputs the Laplacian, computed from depth buffer

#version 300 es

// texCoordInc = the x and y differences, in texture coordinates,
// between one texel and the next.  For a window that is 400x300, for
// example, texCoordInc would be (1/400,1/300).

uniform mediump vec2 texCoordInc;

// texCoords = the texture coordinates at this fragment

in mediump vec2 texCoords;

// depthSampler = texture sampler for the depths.

uniform mediump sampler2D depthSampler;

// fragLaplacian = an RGB value that is output from this shader.  All
// three components should be identical.  This RGB value will be
// stored in the Laplacian texture.

layout (location = 0) out mediump vec3 fragLaplacian;

// Define 3x3 Laplacian kernel offsets and weights
const vec2 offsets[9] = vec2[](
    vec2(-1, -1), vec2(0, -1), vec2(1, -1),
    vec2(-1,  0), vec2(0,  0), vec2(1,  0),
    vec2(-1,  1), vec2(0,  1), vec2(1,  1)
);

//const float offsets[9] = float[](-1, 0, 1,-1,0,1,-1,0,1);

const float kernel[9] = float[](
    -1.0, -1.0, -1.0,
    -1.0,  8.0, -1.0,
    -1.0, -1.0, -1.0
);

void main()

{
  //mediump vec2 dummy = texCoords;  // REMOVE THIS ... It's just here because MacOS complains otherwise

  // YOUR CODE HERE.  You will have to compute the Laplacian by
  // evaluating a 3x3 filter kernel at the current texture
  // coordinates.  The Laplacian weights of the 3x3 kernel are
  //
  //      -1  -1  -1
  //      -1   8  -1
  //      -1  -1  -1
  //
  // Store a signed value for the Laplacian; do not take its absolute
  // value.

  
  //fragLaplacian = vec3( 0.1, 0.2, 0.3 );
   float laplacian = 0.0;

    // Loop through the 3x3 neighborhood
    for (int i = 0; i < 9; i++) {
        vec2 sampleCoord = texCoords + offsets[i] * texCoordInc;
        float depth = texture(depthSampler, sampleCoord).r; // Sample depth texture
        laplacian += kernel[i] * depth; // Apply convolution
    }

    // Store Laplacian result in RGB format
    fragLaplacian = vec3(laplacian);
}
