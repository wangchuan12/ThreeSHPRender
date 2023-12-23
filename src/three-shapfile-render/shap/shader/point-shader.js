const color_vertex = `
#if defined( USE_COLOR_ALPHA )

vColor = vec4( 1.0 );

#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )

	vColor = vec3( 1.0 );

#endif

#ifdef USE_COLOR

	vColor *= color / 255.0;

#endif

#ifdef USE_INSTANCING_COLOR

	vColor.xyz *= instanceColor.xyz;

#endif
`
const size_vertex_define = `
   #include <common>
  attribute float asize; 
`

const size_vertex = `
  gl_PointSize = size * asize ;
`

export {
    color_vertex,
    size_vertex_define,
    size_vertex
}