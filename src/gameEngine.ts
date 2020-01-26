import WebGLCanvas from "./webglCanvas";

export default class GameEngine
{
    public readonly webgl: WebGLCanvas;
    public nowTime: number = 0;
    public deltaTime: number = 0;

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
        this.webgl.render();
    }

    public postRender()
    {
        this.prevTime = this.nowTime;
    }
}