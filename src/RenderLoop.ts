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
        position.x + 0, position.y - half,
        position.x + half, position.y + 0,
        position.x + 0, position.y + half,
        position.x - half, position.y + 0,
        position.x + 0, position.y - half
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

let gl: WebGLRenderingContext | null;
let last: number | null = null;

// -- The render loop of the program -- //
function RenderLoop()
{
    console.log('Started render loop');

    // Checks rendering context is not null //
    if (gl === null)
    {
        console.error("WebGL is not supported");
        return;
    }

    // Makes the canvas highest possible resolution //
    gl.canvas.width = 3440;
    gl.canvas.height = 1440;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Loads the shaders into a program //
    const vertShader = CreateShader(gl, gl.VERTEX_SHADER, "shaders/vert.glsl");
    const fragShader = CreateShader(gl, gl.FRAGMENT_SHADER, "shaders/frag.glsl");
    const program = CreateProgram(gl, vertShader, fragShader);

    // Creates an array of dots //
    const dots: FrontCanvasRenderDot[] = Array.from
    (
        { length: 200 },
        () => new FrontCanvasRenderDot()
    );

    // The actual render loop //
    function RenderFrame(current: number)
    {
        // Calculates the delta time //
        if (last === null)
        {
            last = current
        }

        const delta = (current - last) / 1000;
        last = current;

        if (delta > 0.008)
        {
            console.log(delta);
        }

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
        setTimeout(() => 
        {
            RenderFrame(performance.now());
        }, 16); // ~60 fps
    }

    // Starts the loop //
    RenderFrame(performance.now());
}

self.onmessage = (e) =>
{
    const offScreenCanvas: OffscreenCanvas = e.data.canvas;
    gl = offScreenCanvas.getContext("webgl");

    RenderLoop();
}
