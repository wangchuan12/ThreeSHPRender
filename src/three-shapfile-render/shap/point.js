import { Color, Object3D, Vector3 } from "three";
import ShapeOption from "./base/shape-option";
const pointColor = new Color()
export default class Point extends Object3D{
    /**
     * 
     * @param {any} fe 
     * @param {ShapeOption} option 
     */
    constructor(fe , option){
        super()
        this.data = fe
        this.option = option
    }

    init(){
        const geo = this.data.geometry
        if (geo.type === "Point") {
            this.points = [
                new Vector3(geo.coordinates[0] , geo.coordinates[1] , 0)
            ]
        }

        if (geo.type === 'MultiPoint') {
            this.points = geo.coordinates.map((item)=>{
                return new Vector3(item.coordinates[0] , item.coordinates[1] , 0) 
            })
        }

        if (this.option.pointStyleCallBack) {
            const style = Point.getPointStyle(this.data , this.option)
            this.color = pointColor.setStyle(style.color).toArray().map((item)=>{
                return item * 255
            })
            this.size = style.size
        }
    }

    /**
     * 
     * @param {any} fe 
     * @param {ShapeOption} option 
     */
    static getPointStyle(fe , option){
        return option.pointStyleCallBack(fe)
    }
    
}