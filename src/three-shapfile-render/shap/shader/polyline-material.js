import { MeshLineMaterial } from "three.meshline";
import { fixedVertexShader } from "./fixed-mesh-line-shader";

export default class PolylineMaterial extends MeshLineMaterial{
    constructor(option) {
        super(option)
        this._init()
    }

    _init(){
        this.onBeforeCompile = (shader)=>{
            shader.vertexShader = fixedVertexShader
            return shader
        }
    }
}