var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreateShader, CreateProgram } from "./GL_Program.js";
import { CalculateSqrDist } from "./Vec2.js";
import { FrontCanvasRenderDot } from "./Dot.js";
// Helper function to draw a circle at a given position //
function DrawCircle(gl, program, position) {
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    // Defines the vertex locations //
    const half = 0.003;
    const corners = [
        position.x + 0, position.y - half,
        position.x + half, position.y + 0,
        position.x + 0, position.y + half,
        position.x - half, position.y + 0,
        position.x + 0, position.y - half
    ];
    // Draws the "Circle" //
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 5);
}
// Helper function to draw a line between two points //
function DrawLine(gl, program, p1, p2, grayscale) {
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    // Defines the points of the line //
    const vertecies = [
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
    gl.uniform4f(colorLocation, grayscale, grayscale, grayscale, 1.0);
    gl.drawArrays(gl.LINES, 0, 2);
}
// The render loop of the program //
export function RenderLoop() {
    return __awaiter(this, void 0, void 0, function* () {
        // Gets the canvas and rendering context //
        const canvas = document.getElementById('FrontCanvas');
        const gl = canvas.getContext("webgl");
        if (!gl) {
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
        const vertShader = yield CreateShader(gl, gl.VERTEX_SHADER, "shaders/vert.glsl");
        const fragShader = yield CreateShader(gl, gl.FRAGMENT_SHADER, "shaders/frag.glsl");
        const program = yield CreateProgram(gl, vertShader, fragShader);
        // Creates an array of dots //
        const dots = Array.from({ length: 200 }, () => new FrontCanvasRenderDot());
        // The last time the loop was run //
        let last = null;
        // The actual render loop //
        function RenderFrame() {
            const currentTime = performance.now();
            // Calculates the delta time //
            if (last === null) {
                last = currentTime;
            }
            const delta = (currentTime - last) / 1000;
            last = currentTime;
            // Clears the canvas //
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // Updates each of the dots //
            for (const dot of dots) {
                dot.Update(delta);
            }
            // Renders each of the dots //
            for (let i = 0; i < dots.length; i++) {
                // Calculates which other dots it should draw a line too //
                for (let j = i; j < dots.length; j++) {
                    const distSqr = CalculateSqrDist(dots[i].location, dots[j].location);
                    if (distSqr < 0.01) {
                        const dist = Math.sqrt(distSqr) * 10;
                        DrawLine(gl, program, dots[i].location, dots[j].location, 1.0 - dist);
                    }
                }
                // Draws the circle on top //
                DrawCircle(gl, program, dots[i].location);
            }
        }
        // Any faster causes the browser to lag //
        setInterval(() => { RenderFrame(); }, 50);
    });
}
