import WebGLCanvas from "./webglCanvas";

const mainCanvas = document.getElementById('main-canvas') as HTMLCanvasElement;
const webgl = new WebGLCanvas(mainCanvas);
webgl.init();

const meshData = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1
]);

const mesh = webgl.createMesh(meshData, [1, 0, 0, 1]);

let angle = 0;
let prevTime = Date.now();

function render()
{
    const now = Date.now();
    const delta = now - prevTime;
    const deltaSeconds = delta / 1000;
    angle += 3 * deltaSeconds;
    webgl.render();
    mesh.transform.rotateZ(angle);

    prevTime = now;

    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);