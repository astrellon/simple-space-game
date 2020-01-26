import { remove } from "./utils";
import { mat4 } from "gl-matrix";
import WebGLMesh from "./webglMesh";
import WebGLCanvas from "./webglCanvas";

export default class GameObject
{
    public transform: mat4 = mat4.create();
    public parent?: GameObject;
    public children: GameObject[] = [];
    public mesh: WebGLMesh;

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

    public render(webgl: WebGLCanvas)
    {
        if (this.mesh)
        {
            webgl.drawMesh(this.mesh);
        }

        for (let child of this.children)
        {
            child.render(webgl);
        }
    }
}