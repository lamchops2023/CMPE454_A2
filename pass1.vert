// Pass 1 vertex shader
//
// Stores colour, normal, depth


#version 300 es

uniform mat4 M;
uniform mat4 MV;
uniform mat4 MVP;

layout (location = 0) in mediump vec3 vertPosition;
layout (location = 1) in mediump vec3 vertNormal;
layout (location = 2) in mediump vec3 vertTexCoord;

out mediump vec3 colour;
out mediump vec3 normal;
out mediump float depth;

void main()

{
  // calculate vertex position in CCS (always required)
  vec4 ccs_pos = MVP * vec4( vertPosition, 1.0f ); // Transform vertex positions in OCS to CCS
  gl_Position = ccs_pos;

  // Select an arbitrary colour
  colour = vec3(0.0,0.5,0.5);         

  // calculate normal in VCS
  // Take the input normals and compute the associated 4-vec with 4th coord = 0
  // Transform normals from the OCS to the VCS using the MV tranformation matrix
  normal = vec3( MV * vec4( vertNormal, 0.0 ) ); 

  // Calculate the depth in [0,1]
  depth = 0.5 * ((ccs_pos.z / ccs_pos.w) + 1.0); // depth calculation by taking the 'normalized' z coordinate and adjusting for [0,1]
}
