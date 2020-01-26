export default class WebGLShader
{
    public readonly program: WebGLProgram;
    public readonly gl: WebGLRenderingContext;

    constructor(program: WebGLProgram, gl: WebGLRenderingContext)
    {
        this.program = program;
        this.gl = gl;
    }
}

export class WebGLSimpleShader extends WebGLShader
{
    public readonly viewUniform: WebGLUniformLocation;
    public readonly cameraUniform: WebGLUniformLocation;
    public readonly modelUniform: WebGLUniformLocation;
    public readonly fragColourUniform: WebGLUniformLocation;

    constructor(program: WebGLProgram, gl: WebGLRenderingContext)
    {
        super(program, gl);

        gl.useProgram(program);
        this.cameraUniform = gl.getUniformLocation(program, 'camera');
        this.viewUniform = gl.getUniformLocation(program, 'view');
        this.modelUniform = gl.getUniformLocation(program, 'model');
        this.fragColourUniform = gl.getUniformLocation(program, 'fragColour');
    }

    public useShader()
    {
        this.gl.bindAttribLocation(this.program, 0, 'vertexPos');
        this.gl.enableVertexAttribArray(0);
    }
}