import WebGLMesh from "./webglMesh";
import { mat4 } from "gl-matrix";

export default class WebGLMeshInstances
{
    public transform: mat4 = mat4.create();
    public readonly gl: WebGLRenderingContext;
    public readonly baseMesh: WebGLMesh;
    public readonly offsetBuffer: WebGLBuffer;
    public readonly length: number;

    constructor (gl: WebGLRenderingContext, baseMesh: WebGLMesh, offsetBuffer: WebGLBuffer, length: number)
    {
        this.gl = gl;
        this.baseMesh = baseMesh;
        this.offsetBuffer = offsetBuffer;
        this.length = length;
    }

    public setOffsets(offsets: Float32Array)
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, offsets);
    }
}