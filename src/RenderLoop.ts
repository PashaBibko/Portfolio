import { CreateShader, CreateProgram } from "./GL_Program.js";
import { FrontCanvasRenderDot } from "./Dot.js";
import { Vec2 } from "./Vec2.js";

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

    // Drwas the "Circle" //
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
    
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
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
    function loop(currentTime: number)
    {
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
            dot.location.x = dot.location.x + (dot.velocity.x / 10.0 * delta);
            dot.location.y = dot.location.y + (dot.velocity.y / 10.0 * delta);

            // Flips x-velocity if the x coord is outside [-1, 1] //
            if (dot.location.x < -1 || 1 < dot.location.x)
            {
                dot.velocity.x = -dot.velocity.x;
            }

            // Flips y-velocity if the y coord is outside [-1, 1] //
            if (dot.location.y < -1 || 1 < dot.location.y)
            {
                dot.velocity.y = -dot.velocity.y;
            }
        }
        
        // Renders each of the dots //
        for (const dot of dots)
        {
            DrawCircle(gl!, program, dot.location);
        }

        // Requests the next frame //
        requestAnimationFrame(loop);
    }

    // Starts the loop //
    requestAnimationFrame(loop); // The loop function requests a new annimation frame
}
