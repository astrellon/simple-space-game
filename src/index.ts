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
obj.mesh = gameEngine.webgl.createMesh(meshData, [1, 0, 0, 1]);;
obj.setParent(gameEngine.root);

let angle = 0;

function render()
{
    gameEngine.preRender();

    angle += 3 * gameEngine.deltaTime;
    mat4.fromZRotation(obj.mesh.transform, angle);

    gameEngine.render();
    gameEngine.postRender();

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);