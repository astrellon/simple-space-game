import GameEngine from "./gameEngine";
import { mat4 } from "gl-matrix";

const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement;
const gameEngine = new GameEngine(mainCanvas);

const meshData = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1
]);

const mesh = gameEngine.webgl.createMesh(meshData, [1, 0, 0, 1]);

let angle = 0;

function render()
{
    gameEngine.preRender();

    angle += 3 * gameEngine.deltaTime;
    mat4.fromZRotation(mesh.transform, angle);

    gameEngine.render();
    gameEngine.postRender();

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);