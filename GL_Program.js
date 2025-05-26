var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function LoadShaderSource(url) {
    return __awaiter(this, void 0, void 0, function* () {
        // Loads the shader source into a string //
        const response = yield fetch(url);
        // Checks there were no errors before returning //
        if (!response.ok) {
            throw new Error(`Failed to load shader: ${url}`);
        }
        return yield response.text();
    });
}
export function CreateShader(gl, type, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        // Compiles the shader from source //
        const shader = gl.createShader(type);
        gl.shaderSource(shader, yield LoadShaderSource(filename));
        gl.compileShader(shader);
        // Checks there were no errors before returning //
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
        }
        return shader;
    });
}
export function CreateProgram(gl, vs, fs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Links the shaders to the program //
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        // Checks there were no errors before returning //
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program) || "Program link error");
        }
        return program;
    });
}
