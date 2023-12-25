import * as THREE  from 'three'
import { vertex } from "./polygon-shader";
export default class PolygonMaterial extends THREE.MeshPhongMaterial{
    constructor(option){
        super(option)
        this._init()
    }

    _init(){
        this.onBeforeCompile = (shader)=>{
            shader.vertexShader = shader.vertexShader.replace(
                '#include <color_vertex>',
                vertex
            )

            return shader
        }

    }
}