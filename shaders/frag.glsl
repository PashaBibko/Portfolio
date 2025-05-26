precision mediump float;

// The color of what is being rendered //
uniform vec4 u_color;

void main()
{
    // Passes the color from the uniform to the pixel color //
    gl_FragColor = u_color;
}
