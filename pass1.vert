// Pass 1 vertex shader
//
// Stores colour, normal, depth
//test

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
  // calc vertex position in CCS (always required)

  vec4 ccs_pos = MVP * vec4( vertPosition, 1.0f );
  gl_Position = ccs_pos;

  // Provide a colour 
  colour = vec3(1.0,0.0,0.0);         // YOUR CODE HERE

  // calculate normal in VCS
  normal = vec3( MV * vec4( vertNormal, 0.0 ) ); // Testing normal

  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = dot(normal, lightDir);
  colour = vec3(diffuse*colour); 


  // Calculate the depth in [0,1]
  depth = 0.5 * ((ccs_pos.z / ccs_pos.w) + 1.0); // depth calculation by taking the 'normalized' z coordinate and adjusting for [0,1]
}
