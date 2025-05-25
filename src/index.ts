import { CreateShader, CreateProgram } from "./GL_Program.js";

// The render loop of the program //
async function RenderLoop()
{
    // Gets the canvas and rendering context //
    const canvas = document.getElementById('FrontCanvas') as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");

    if (!gl)
    {
        throw new Error("WebGL not supported");
    }

    // Loads the shaders into a program //
    const vertShader = await CreateShader(gl, gl.VERTEX_SHADER,   "shaders/vert.glsl");
    const fragShader = await CreateShader(gl, gl.FRAGMENT_SHADER, "shaders/frag.glsl");
    const program = await CreateProgram(gl, vertShader, fragShader);

    // Draws a line to the canvas //
    const verticies = new Float32Array
    ([
        -0.5, -0.5,
         0.5,  0.5
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticies, gl.STATIC_DRAW);

    gl.useProgram(program);

    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, 2);
}

RenderLoop().catch(console.error);
