export default class ShaderWrapper
{
    public readonly program: WebGLProgram;
    public readonly attribute: { [name: string]: number } = {};
    public readonly uniform: { [name: string]: WebGLUniformLocation } = {};

    constructor(gl: WebGLRenderingContext, program: WebGLProgram)
    {
        this.program = program;

        let attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; i++)
        {
            const attrib = gl.getActiveAttrib(program, i);
            this.attribute[attrib.name] = gl.getAttribLocation(program, attrib.name);
        }

        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++)
        {
            const uniform = gl.getActiveUniform(program, i);
            const name = uniform.name.replace("[0]", "");
            this.uniform[name] = gl.getUniformLocation(program, name);
        }
    };
}