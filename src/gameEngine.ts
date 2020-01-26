import WebGLCanvas from "./webglCanvas";
import GameObject from "./gameObject";
import { mat4 } from "gl-matrix";

export default class GameEngine
{
    public readonly webgl: WebGLCanvas;
    public nowTime: number = 0;
    public deltaTime: number = 0;

    public root: GameObject = new GameObject();

    private prevTime: number = 0;

    constructor(canvas: HTMLCanvasElement)
    {
        this.webgl = new WebGLCanvas(canvas);
        this.webgl.init();
    }

    public preRender()
    {
        this.nowTime = Date.now();

        if (this.prevTime > 0)
        {
            this.deltaTime = (this.nowTime - this.prevTime) / 1000;
        }
    }

    public render()
    {
        this.webgl.setupRender();

        const transformStack = [mat4.create()];

        this.root.render(this.webgl, transformStack);
    }

    public postRender()
    {
        this.prevTime = this.nowTime;
    }
}