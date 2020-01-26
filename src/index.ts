import GameEngine from "./gameEngine";
import { mat4 } from "gl-matrix";
import GameObject from "./gameObject";

const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement;
const gameEngine = new GameEngine(mainCanvas);

const meshData = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1
]);

const obj = new GameObject();
obj.mesh = gameEngine.webgl.createMesh(meshData, [1, 0, 0, 1]);
obj.setParent(gameEngine.root);

const objChild = new GameObject();
objChild.mesh = gameEngine.webgl.createMesh(meshData, [0, 1, 0, 1]);
mat4.translate(objChild.mesh.transform, objChild.mesh.transform, [-5, 0, 0]);
objChild.setParent(obj);

let angle = 0;

function render()
{
    gameEngine.preRender();

    angle += 3 * gameEngine.deltaTime;
    mat4.fromZRotation(obj.mesh.transform, angle);
    mat4.rotateZ(objChild.mesh.transform, objChild.mesh.transform, gameEngine.deltaTime);

    gameEngine.render();
    gameEngine.postRender();

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);