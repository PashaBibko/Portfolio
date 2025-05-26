// Location of the vertex in 2d-space //
attribute vec2 a_position;

void main()
{
    // Standard pass-through vertex shader //
    gl_Position = vec4(a_position, 0, 1);
}
