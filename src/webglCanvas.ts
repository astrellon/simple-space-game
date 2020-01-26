import WebGLMesh from "./webglMesh";
import { initShaderProgram, createMesh } from "./webglUtils";
import { mat4 } from "gl-matrix";

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
    private shaderProgram: WebGLProgram;
    private viewMatrix: mat4 = mat4.create();
    private cameraMatrix: mat4 = mat4.create();

    private pointSizeUniform: WebGLUniformLocation;
    private viewUniform: WebGLUniformLocation;
    private cameraUniform: WebGLUniformLocation;
    private modelUniform: WebGLUniformLocation;
    private fragColourUniform: WebGLUniformLocation;

    private meshes: WebGLMesh[] = [];

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
        this.shaderProgram = initShaderProgram(this.gl);

        this.gl.useProgram(this.shaderProgram);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.disable(this.gl.CULL_FACE);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.pointSizeUniform = this.gl.getUniformLocation(this.shaderProgram, 'pointSize');
        this.cameraUniform = this.gl.getUniformLocation(this.shaderProgram, 'camera');
        this.viewUniform = this.gl.getUniformLocation(this.shaderProgram, 'view');
        this.modelUniform = this.gl.getUniformLocation(this.shaderProgram, 'model');
        this.fragColourUniform = this.gl.getUniformLocation(this.shaderProgram, 'fragColour');

        mat4.lookAt(this.viewMatrix, [0, 0, -1], [0, 0, 10], [0, 1, 0]);
        mat4.ortho(this.cameraMatrix, -5, 5, -5, 5, 0.1, 50);

        this.gl.uniformMatrix4fv(this.cameraUniform, false, this.cameraMatrix);
        this.gl.uniformMatrix4fv(this.viewUniform, false, this.viewMatrix);

        this.gl.bindAttribLocation(this.shaderProgram, 0, 'vertexPos');
        this.gl.enableVertexAttribArray(0);
    }

    public drawMesh(mesh: WebGLMesh)
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer);
        this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.uniform1f(this.pointSizeUniform, mesh.pointSize);
        this.gl.uniform4fv(this.fragColourUniform, mesh.colour);
        this.gl.uniformMatrix4fv(this.modelUniform, false, mesh.transform);
        this.gl.drawArrays(mesh.mode, 0, mesh.length);
    }

    public createMesh(data: Float32Array, colour: number[])
    {
        const buffer = createMesh(this.gl, data);
        const mesh = new WebGLMesh(buffer, this.gl.TRIANGLE_STRIP, data.length / 2, colour, 1);
        this.meshes.push(mesh);
        return mesh;
    }

    public render()
    {
        const { viewport } = this;
        mat4.ortho(this.cameraMatrix, viewport.minX, viewport.maxX, viewport.minY, viewport.maxY, 0.1, 50);
        this.gl.uniformMatrix4fv(this.cameraUniform, false, this.cameraMatrix);

        for (let mesh of this.meshes)
        {
            this.drawMesh(mesh);
        }
    }
}