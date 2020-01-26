import WebGLMesh from "./webglMesh";
import { initShaderProgram, createMesh } from "./webglUtils";
import { mat4 } from "gl-matrix";
import { WebGLSimpleShader } from "./webglShader";

export interface WebGLViewport
{
    readonly minX: number;
    readonly maxX: number;
    readonly minY: number;
    readonly maxY: number;
}

export default class WebGLCanvas
{
    public gl: WebGLRenderingContext;
    public viewport: WebGLViewport;
    private canvas: HTMLCanvasElement;
    private viewMatrix: mat4 = mat4.create();
    private cameraMatrix: mat4 = mat4.create();
    private simpleShader: WebGLSimpleShader;

    constructor(canvas: HTMLCanvasElement)
    {
        this.canvas = canvas;

        // Premultiplied Alpha fixes an issue in Firefox where transparent
        // chart colours render weirdly.
        this.gl = this.canvas.getContext('webgl', {
            premultipliedAlpha: false
        });

        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        this.canvas.width = width * window.devicePixelRatio;
        this.canvas.height = height * window.devicePixelRatio;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        const aspect = width / height;

        this.viewport = {
            minX: -10 * aspect, maxX: 10 * aspect,
            minY: -10, maxY: 10
        }
    }

    public init()
    {
        const simpleProgram = initShaderProgram(this.gl);
        this.simpleShader = new WebGLSimpleShader(simpleProgram, this.gl);
        this.simpleShader.useShader();

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.disable(this.gl.CULL_FACE);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        mat4.lookAt(this.viewMatrix, [0, 0, -1], [0, 0, 10], [0, 1, 0]);
        mat4.ortho(this.cameraMatrix, -5, 5, -5, 5, 0.1, 50);

        this.gl.uniformMatrix4fv(this.simpleShader.viewUniform, false, this.viewMatrix);
    }

    public drawMesh(mesh: WebGLMesh, worldTransform: mat4)
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform4fv(this.simpleShader.fragColourUniform, mesh.colour);
        this.gl.uniformMatrix4fv(this.simpleShader.modelUniform, false, worldTransform);
        this.gl.drawArrays(mesh.mode, 0, mesh.length);
    }

    public createMesh(data: Float32Array, colour: number[])
    {
        const buffer = createMesh(this.gl, data);
        const mesh = new WebGLMesh(buffer, this.gl.TRIANGLE_STRIP, data.length / 2, colour, 1);
        return mesh;
    }

    public setupRender()
    {
        const { viewport } = this;

        mat4.ortho(this.cameraMatrix, viewport.minX, viewport.maxX, viewport.minY, viewport.maxY, 0.1, 50);
        this.gl.uniformMatrix4fv(this.simpleShader.cameraUniform, false, this.cameraMatrix);
    }
}