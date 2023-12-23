import { BufferAttribute, BufferGeometry, Color, Object3D } from "three";
import { MeshLine } from 'three.meshline';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils'
import ShapeOption from './base/shape-option'
const polylineColor = new Color()
export default class Polyline extends Object3D{
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
        let style;
        let styleColor 
        if (this.option.polylineStyleCallBack) {
            style = Polyline.getPolylineStyle(this.data , this.option)
            styleColor = polylineColor.set(style.color).toArray().map(item => item * 255)
        }
        let tem = []
        if (geo.type === "LineString") {
           this.points = []
           for (let i = 0 ; i < geo.coordinates.length; i++) {
             tem.push(geo.coordinates[i][0] , geo.coordinates[i][1] , 0)
           }
           const bufferGeometry = new BufferGeometry()
           bufferGeometry.setAttribute(
            'position' , new BufferAttribute(new Float32Array(tem) , 3)
           )
           
           const meshline = new MeshLine()
           if (style) {
            meshline.setGeometry(bufferGeometry , (p)=> style.width)
            this.setGeometryColor(meshline , styleColor)
           } else {
            meshline.setGeometry(bufferGeometry)
           }
           this.geometry = meshline.geometry
        }

        if (geo.type === "MultiLineString") {

            if(Array.isArray(geo.coordinates[0][0])) {
                const lines = []
                geo.coordinates.forEach(res => {
                    tem = []
                    for (let i = 0 ; i < res.length; i++) {
                        tem.push(res[i][0] , res[i][1] , 0)
                      }
                      const bufferGeometry = new BufferGeometry()
                      bufferGeometry.setAttribute(
                       'position' , new BufferAttribute(new Float32Array(tem) , 3)
                      )
                    const meshline = new MeshLine()
                    if (style) {
                        meshline.setGeometry(bufferGeometry , ()=> style.width)
                        this.setGeometryColor(meshline , styleColor)
                        console.log(meshline)
                    } else {
                        meshline.setGeometry(bufferGeometry)
                    }
                    lines.push(meshline)
                })
                this.geometry = mergeGeometries(lines , true)
                console.log(this.geometry)
            } else {
                for (let i = 0 ; i < geo.coordinates.length; i++) {
                    tem.push(geo.coordinates[i][0] , geo.coordinates[i][1] , 0)
                  }
                const bufferGeometry = new BufferGeometry()
                bufferGeometry.setAttribute(
                'position' , new BufferAttribute(new Float32Array(tem) , 3)
                )
                const meshline = new MeshLine()
                if (style) {
                    meshline.setGeometry(bufferGeometry , ()=> style.width)
                    this.setGeometryColor(meshline , styleColor)
                } else {
                    meshline.setGeometry(bufferGeometry)
                }
                this.geometry = meshline
            }
        }
    }

    /**
     * 
     * @param {BufferGeometry} geometry 
     * @param {Array<number>} color 
     */
    setGeometryColor(geometry  , color){
        const position = geometry.getAttribute('position')
        const tem = []

        for (let i = 0 ; i < position.count ; i++){
            tem.push(color[0] , color[1] , color[2])
        }

        const colorAtt = new BufferAttribute( new Uint8Array(tem ) , 3)
        geometry.setAttribute('acolor' , colorAtt)
    }

    static getPolylineStyle(fe , option){
        return option.polylineStyleCallBack(fe)
    }
}