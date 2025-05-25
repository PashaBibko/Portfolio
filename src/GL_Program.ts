async function LoadShaderSource(url: string): Promise<string>
{
    // Loads the shader source into a string //
    const response = await fetch(url);

    // Checks there were no errors before returning //
    if (!response.ok)
    {
        throw new Error(`Failed to load shader: ${url}`);
    }
    return await response.text();
}

export async function CreateShader(gl: WebGLRenderingContext, type: number, filename: string): Promise<WebGLShader>
{
    // Compiles the shader from source //
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, await LoadShaderSource(filename));
    gl.compileShader(shader);

    // Checks there were no errors before returning //
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        throw new Error(gl.getShaderInfoLog(shader) || "Shader compile error");
    }
    return shader;
}

export async function CreateProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): Promise<WebGLProgram>
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
