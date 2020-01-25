export default class Matrix4x4
{
    public readonly data: Float32Array = new Float32Array(16);

    constructor()
    {
        this.data[0] = 1;
        this.data[5] = 1;
        this.data[10] = 1;
        this.data[15] = 1;
    }

    public rotateZ(radians: number)
    {
        const s = Math.sin(radians);
        const c = Math.cos(radians);

        // Perform axis-specific matrix multiplication
        this.data[0] = c
        this.data[1] = s
        this.data[2] = 0
        this.data[3] = 0
        this.data[4] = -s
        this.data[5] = c
        this.data[6] = 0
        this.data[7] = 0
        this.data[8] = 0
        this.data[9] = 0
        this.data[10] = 1
        this.data[11] = 0
        this.data[12] = 0
        this.data[13] = 0
        this.data[14] = 0
        this.data[15] = 1
    }

    public setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number)
    {
        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);

        this.data[0] = -2 * lr;
        this.data[5] = -2 * bt;
        this.data[10] = 2 * nf;
        this.data[12] = (left + right) * lr;
        this.data[13] = (top + bottom) * bt;
        this.data[14] = (far + near) * nf;
        this.data[15] = 1;
    }

    public setBasicView(zDistance: number)
    {
        this.data[0] = 1;
        this.data[5] = 1;
        this.data[10] - 1;
        this.data[14] = -zDistance;
        this.data[15] = 1;
    }

    public translateRelative(vector: number[])
    {
        const x = vector[0], y = vector[1], z = vector[2], d = this.data;

        d[12] = d[0] * x + d[4] * y + d[8] * z + d[12];
        d[13] = d[1] * x + d[5] * y + d[9] * z + d[13];
        d[14] = d[2] * x + d[6] * y + d[10] * z + d[14];
        d[15] = d[3] * x + d[7] * y + d[11] * z + d[15];
    }

    public translateWorld(vector: number[])
    {
        this.data[12] += vector[0];
        this.data[13] += vector[1];
        this.data[14] += vector[2];
    }
}
