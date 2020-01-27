import { mat4 } from "gl-matrix";

export default class WebGLMesh
{
    public transform: mat4 = mat4.create();
    public readonly buffer: WebGLBuffer;
    public readonly mode: GLenum;
    public readonly length: number;
    public readonly colour: number[];

    constructor (buffer: WebGLBuffer, mode: GLenum, length: number, colour: number[])
    {
        this.buffer = buffer;
        this.mode = mode;
        this.length = length;
        this.colour = colour;
    }
}