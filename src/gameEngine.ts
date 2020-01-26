import WebGLCanvas from "./webglCanvas";
import GameObject from "./gameObject";

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

        this.root.render(this.webgl);
    }

    public postRender()
    {
        this.prevTime = this.nowTime;
    }
}