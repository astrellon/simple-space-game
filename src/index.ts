import GameEngine from "./gameEngine";
import { mat4 } from "gl-matrix";
import GameObject from "./gameObject";
import Square from "./square";

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

for (let i = 0; i < 1000; i++)
{
    const objChild = new Square(gameEngine, [0, 1, 0, 1], i / 1000 * Math.PI * 2);
    objChild.setParent(obj);
}

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