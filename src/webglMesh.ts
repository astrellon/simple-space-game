import Matrix4x4 from "./matrix4x4";

export default class WebGLMesh
{
    public transform: Matrix4x4;
    public readonly buffer: WebGLBuffer;
    public readonly mode: GLenum;
    public readonly length: number;
    public readonly colour: number[];
    public readonly pointSize: number;

    constructor (buffer: WebGLBuffer, mode: GLenum, length: number, colour: number[], pointSize: number)
    {
        this.buffer = buffer;
        this.mode = mode;
        this.length = length;
        this.colour = colour;
        this.pointSize = pointSize;
        this.transform = new Matrix4x4();
    }
}