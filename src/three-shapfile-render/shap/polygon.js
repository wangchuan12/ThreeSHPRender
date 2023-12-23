import { BufferAttribute, Color, Object3D } from "three";
import Convert from "./convert";
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils'
import ShapeOption from "./base/shape-option";
export default class Polygon extends Object3D{
    /**
     * 
     * @param {any} feature 
     * @param {ShapeOption} option 
     */
    constructor(feature , option){
        super()
        this.data = feature
        this.option = option
    }

    init(){
        const geometry = this.data.geometry
        let style = this.option.style.polygon

        if (this.option.polygonStyleCallBack) {
            style = this.option.polygonStyleCallBack(this.data)
        }
        this.color = style.color || "red"
        this.height = style.extrudeHeight || 1
        if (geometry.type === "Polygon") {
            const shap = Convert.polygonToGeometry(geometry , this.height)
            this.geometry = shap
        } else {
            const multi = geometry.coordinates.map((item)=>{
                return Convert.polygonToGeometry({
                    type : "Polygon",
                    coordinates : item
                })
            })
    
            this.geometry = mergeGeometries(multi)
        }
        const position = this.geometry.getAttribute('position')
        const color = new Color(this.color)
        const colorArr = []
        for (let i = 0 ; i < position.array.length ;i += 3) {
            colorArr.push(color.r , color.g , color.b)
        }

        const att = new BufferAttribute(new Float32Array(colorArr) , 3)
        this.geometry.setAttribute('color' , att)
    }


    static getPolygonStyle(data , option){
        let style = option.style.polygon

        if (option.polygonStyleCallBack) {
            style = option.polygonStyleCallBack(data)
        }

        return style
    }
    
}