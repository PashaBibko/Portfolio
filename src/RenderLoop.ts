import { CreateShader, CreateProgram } from "./GL_Program.js";
import { Vec2, CalculateSqrDist } from "./Vec2.js";
import { FrontCanvasRenderDot } from "./Dot.js";

// Helper function to draw a circle at a given position //
function DrawCircle(gl: WebGLRenderingContext, program: WebGLProgram, position: Vec2)
{
    const positionLocation = gl.getAttribLocation(program, "a_position");

    // Defines the vertex locations //
    const half = 0.003;
    const corners =
    [
        position.x + 0   , position.y - half,
        position.x + half, position.y +    0,
        position.x + 0   , position.y + half,
        position.x - half, position.y +    0,
        position.x + 0   , position.y - half
    ];

    // Draws the "Circle" //
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
    
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
}

// Helper function to draw a line between two points //
function DrawLine(gl: WebGLRenderingContext, program: WebGLProgram, p1: Vec2, p2: Vec2)
{
    const positionLocation = gl.getAttribLocation(program, "a_position");

    // Defines the points of the line //
    const vertecies =
    [
        p1.x, p1.y,
        p2.x, p2.y
    ];

    // Draws the line //
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertecies), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, 2);
}

// The render loop of the program //
export async function RenderLoop()
{
    // Gets the canvas and rendering context //
    const canvas = document.getElementById('FrontCanvas') as HTMLCanvasElement;
    const gl = canvas.getContext("webgl");

    if (!gl)
    {
        throw new Error("WebGL not supported");
    }

    // Makes the canvas highest possible resolution //
    const css_width = canvas.clientWidth;
    const css_height = canvas.clientHeight;
    
    const dpr = window.devicePixelRatio || 1;

    canvas.width = css_width * dpr;
    canvas.height = css_height * dpr;

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Loads the shaders into a program //
    const vertShader = await CreateShader(gl, gl.VERTEX_SHADER,   "shaders/vert.glsl");
    const fragShader = await CreateShader(gl, gl.FRAGMENT_SHADER, "shaders/frag.glsl");
    const program = await CreateProgram(gl, vertShader, fragShader);

    // Creates an array of dots //
    const dots: FrontCanvasRenderDot[] = Array.from
    (
        { length: 200 },
        () => new FrontCanvasRenderDot()
    );

    // The last time the loop was run //
    let last: number | null = null;

    // The actual render loop //
    function RenderFrame()
    {
        const currentTime = performance.now();

        // Calculates the delta time //
        if (last === null)
        {
            last = currentTime;
        }

        const delta = (currentTime - last) / 1000;
        last = currentTime;

        // Clears the canvas //
        gl!.clearColor(0, 0, 0, 1);
        gl!.clear(gl!.COLOR_BUFFER_BIT);

        // Updates each of the dots //
        for (const dot of dots)
        {
            dot.Update(delta);
        }
        
        // Renders each of the dots //
        for (let i = 0; i < dots.length; i++)
        {
            DrawCircle(gl!, program, dots[i].location);

            // Calculates which other dots it should draw a line too //
            for (let j = i; j < dots.length; j++)
            {
                const distSqr = CalculateSqrDist(dots[i].location, dots[j].location);
                if (distSqr < 0.01)
                {
                    DrawLine(gl!, program, dots[i].location, dots[j].location);
                }
            }
        }
    }

    // Any faster causes the browser to lag //
    setInterval(() => { RenderFrame(); }, 75);
}
