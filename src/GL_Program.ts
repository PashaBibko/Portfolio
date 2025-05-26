function LoadShaderSource(url: string): string
{
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status !== 200)
    {
        throw new Error(`Failed to load shader: ${url} (status: ${xhr.status})`);
    }

    return xhr.responseText;
}

export function CreateShader(gl: WebGLRenderingContext, type: number, filename: string): WebGLShader
{
    // Compiles the shader from source //
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, LoadShaderSource(filename));
    gl.compileShader(shader);

    // Checks there were no errors before returning //
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
    }
    return shader;
}

export function CreateProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram
{
    // Links the shaders to the program //
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    // Checks there were no errors before returning //
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        throw new Error(gl.getProgramInfoLog(program) || "Program link error");
    }
    return program;
}
