export const DefaultVertexShader = `attribute vec4 vertexPos;

uniform mat4 view;
uniform mat4 camera;
uniform mat4 model;

void main() {
  gl_Position = camera * view * model * vertexPos;
}`;

export const DefaultVertexInstanceShader = `attribute vec4 vertexPos;
attribute vec4 offset;

uniform mat4 view;
uniform mat4 camera;
uniform mat4 model;

void main() {
  gl_Position = camera * view * model * (vertexPos + offset);
}`;

export const DefaultFragShader = `
precision mediump float;
uniform vec4 fragColour;

void main() {
  gl_FragColor = fragColour;
}`;

export function initShaderProgram(gl: WebGLRenderingContext, vsSource: string = DefaultVertexShader, fsSource: string = DefaultFragShader)
{
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string)
{
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export function createMesh(gl: WebGLRenderingContext, arr: Float32Array)
{
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
    return buf;
}