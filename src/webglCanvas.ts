import WebGLMesh from "./webglMesh";
import { initShaderProgram, createMesh, DefaultVertexInstanceShader } from "./webglUtils";
import { mat4 } from "gl-matrix";
import WebGLMeshInstances from "./webglMeshInstances";
import ShaderWrapper from "./shaderWrapper";

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
    private simpleShader: ShaderWrapper;
    private instanceShader: ShaderWrapper;
    private instanceExtension: ANGLE_instanced_arrays;

    private currentShader: ShaderWrapper = null;

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
        this.simpleShader = new ShaderWrapper(this.gl, simpleProgram);

        const instanceProgram = initShaderProgram(this.gl, DefaultVertexInstanceShader);
        this.instanceShader = new ShaderWrapper(this.gl, instanceProgram);

        this.instanceExtension = this.gl.getExtension('ANGLE_instanced_arrays');

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.disable(this.gl.CULL_FACE);

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        mat4.lookAt(this.viewMatrix, [0, 0, -1], [0, 0, 10], [0, 1, 0]);
        mat4.ortho(this.cameraMatrix, -5, 5, -5, 5, 0.1, 50);
    }

    public drawMesh(mesh: WebGLMesh, worldTransform: mat4)
    {
        const shader = this.simpleShader;
        this.changeToShader(shader);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer);
        this.gl.enableVertexAttribArray(shader.attribute.vertexPos);
        this.gl.vertexAttribPointer(shader.attribute.vertexPos, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform4fv(shader.uniform.fragColour, mesh.colour);
        this.gl.uniformMatrix4fv(shader.uniform.model, false, worldTransform);
        this.gl.drawArrays(mesh.mode, 0, mesh.length);
    }

    public drawMeshInstances(meshInstances: WebGLMeshInstances, worldTransform: mat4)
    {
        const shader = this.instanceShader;
        this.changeToShader(shader);
        const mesh = meshInstances.baseMesh;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.buffer);
        this.gl.enableVertexAttribArray(shader.attribute.vertexPos);
        this.gl.vertexAttribPointer(shader.attribute.vertexPos, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, meshInstances.offsetBuffer);
        this.gl.enableVertexAttribArray(shader.attribute.offset);
        this.gl.vertexAttribPointer(shader.attribute.offset, 2, this.gl.FLOAT, false, 0, 0);
        this.instanceExtension.vertexAttribDivisorANGLE(shader.attribute.offset, 1);

        this.gl.uniform4fv(shader.uniform.fragColour, mesh.colour);
        this.gl.uniformMatrix4fv(shader.uniform.model, false, worldTransform);
        this.instanceExtension.drawArraysInstancedANGLE(mesh.mode, 0, mesh.length, meshInstances.length);
    }

    public createMesh(data: Float32Array, colour: number[])
    {
        const buffer = createMesh(this.gl, data);
        return new WebGLMesh(buffer, this.gl.TRIANGLE_STRIP, data.length / 2, colour);
    }

    public createMeshInstance(data: Float32Array, colour: number[], numberOfInstances: number)
    {
        const mesh = this.createMesh(data, colour);
        const offsetBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, offsetBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(numberOfInstances * 2), this.gl.DYNAMIC_DRAW);
        return new WebGLMeshInstances(this.gl, mesh, offsetBuffer, numberOfInstances);
    }

    public setupRender()
    {
        const { viewport } = this;

        mat4.ortho(this.cameraMatrix, viewport.minX, viewport.maxX, viewport.minY, viewport.maxY, 0.1, 50);
    }

    private changeToShader(shader: ShaderWrapper)
    {
        if (this.currentShader === shader)
        {
            return;
        }

        this.currentShader = shader;
        this.gl.useProgram(shader.program);
        this.gl.uniformMatrix4fv(shader.uniform.camera, false, this.cameraMatrix);
        this.gl.uniformMatrix4fv(shader.uniform.view, false, this.viewMatrix);
    }
}