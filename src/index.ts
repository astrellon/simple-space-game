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

const num = 100;
const offsets = new Float32Array(num * 2);
for (let i = 0; i < num; i++)
{
    const a = i / num * Math.PI * 2;
    offsets[i * 2] = Math.cos(a) * 5;
    offsets[i * 2 + 1] = Math.sin(a) * 5;
    // const objChild = new Square(gameEngine, [0, 1, 0, 1], i / num * Math.PI * 2);
    // objChild.setParent(obj);
}
const objChild = new GameObject();
objChild.mesh = gameEngine.webgl.createMeshInstance(meshData, [0.2, 1, 0.3, 1], num);
objChild.mesh.setOffsets(offsets);
objChild.setParent(obj);

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