import { remove } from "./utils";
import { mat4 } from "gl-matrix";
import WebGLMesh from "./webglMesh";
import WebGLCanvas from "./webglCanvas";
import GameEngine from "./gameEngine";
import WebGLMeshInstances from "./webglMeshInstances";

export default class GameObject
{
    //public transform: mat4 = mat4.create();
    public parent?: GameObject;
    public children: GameObject[] = [];
    public mesh: WebGLMesh | WebGLMeshInstances;

    public setParent(parent?: GameObject)
    {
        if (this.parent)
        {
            remove(this.parent.children, this);
        }

        this.parent = parent;

        if (this.parent)
        {
            this.parent.children.push(this);
        }
    }

    public update(engine: GameEngine)
    {
        this.doUpdate(engine);

        for (let child of this.children)
        {
            child.update(engine);
        }
    }

    public render(webgl: WebGLCanvas, transformStack: mat4[])
    {
        let worldTransform = transformStack[transformStack.length - 1];

        if (this.mesh)
        {
            worldTransform = mat4.clone(transformStack[transformStack.length - 1]);
            mat4.multiply(worldTransform, worldTransform, this.mesh.transform);

            if (this.mesh instanceof WebGLMesh)
            {
                webgl.drawMesh(this.mesh, worldTransform);
            }
            else
            {
                webgl.drawMeshInstances(this.mesh, worldTransform);
            }
        }

        transformStack.push(worldTransform);

        for (let child of this.children)
        {
            child.render(webgl, transformStack);
        }

        transformStack.pop();
    }

    protected doUpdate(engine: GameEngine)
    {

    }
}