import GameObject from "./gameObject";
import GameEngine from "./gameEngine";
import { mat4 } from "gl-matrix";

const meshData = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1
]);

export default class Square extends GameObject
{
    constructor(gameEngine: GameEngine, colour: number[], rotation: number)
    {
        super();

        this.mesh = gameEngine.webgl.createMesh(meshData, colour);
        mat4.rotateZ(this.mesh.transform, this.mesh.transform, rotation);
        mat4.translate(this.mesh.transform, this.mesh.transform, [-5, 0, 0]);
    }

    protected doUpdate(gameEngine: GameEngine)
    {
        mat4.rotateZ(this.mesh.transform, this.mesh.transform, gameEngine.deltaTime);
    }
}