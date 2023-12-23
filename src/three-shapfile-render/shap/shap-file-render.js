import {  Object3D, Vector3 } from "three";
import ShapParse from "./shap-parse";
import { Box3 } from "three";
import ShapeOption from "./base/shape-option";
class ShpFileRender extends Object3D{
    /**
     * 
     * @param {ShapeOption} option 
     */
    constructor(option){
        super()
        this.option = {
            ...ShapeOption,
            ...option
        }

        this.rotateX(-Math.PI / 2)
    }

    async init(){
        this.shaParse = new ShapParse(this.option)
        const data = this.option.useWorker ? await this.shaParse.initWithShpWoker() : await this.shaParse.init()
        this.center = this.shaParse.center
        this.material = this.shaParse.material
        if (data.polygon) {
            this.geoType = 'polygon'
            this.shp = data.polygon
            this.add(data.polygon)
        }

        if (data.point) {
            this.geoType = 'point'
            this.shp = data.point
            this.add(data.point)
        }

        if (data.polyline) {
            this.geoType = 'polyline'
            this.shp = data.polyline
            this.add(data.polyline)
        }
        this.box3 = new Box3().expandByObject(this)
    }

    computeBox3(){
        this.box3 = new Box3().expandByObject(this)
    }
    toOrigin(){
        this.shp.position.copy(this.center.clone().negate())
    }

    update(){
        this.children.forEach((item)=>{
            item["update"] && item["update"]()
        })
    }

    destroy(){
        this.traverse((item)=>{
            item?.geometry?.dispose()
            item?.material?.dispose()
        })
    }
}

export default ShpFileRender