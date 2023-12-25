import { PointsMaterial } from "three";
import { color_vertex, size_vertex, size_vertex_define } from "./point-shader";

export default class PointMaterial extends PointsMaterial{
    constructor(option){
        super(option)
        this._init()
    }
    _init(){
        this.onBeforeCompile = (shader)=>{
            shader.vertexShader = shader.vertexShader.replace(
                '#include <common>' , size_vertex_define
            )
            shader.vertexShader = shader.vertexShader.replace(
                '#include <color_vertex>' , color_vertex
            )

            shader.vertexShader = shader.vertexShader.replace(
                'gl_PointSize = size;' , size_vertex
            )

            return shader
        }
    }
}