import { BufferAttribute, BufferGeometry, DoubleSide, Mesh, Vector3 , Color, Vector2, Object3D, Points, TextureLoader, SRGBColorSpace, AdditiveBlending, NormalBlending, MeshPhongMaterial} from 'three'
import Deffer from '../util/deffer'
import shp from "shpjs/dist/shp"
import Polygon from './polygon'
import { toMercator } from '@turf/projection'
import { mergeGeometries } from "./base/BufferGeometryUtils";
import Polyline from './polyline'
import Point from './point'
import ShapeOption from "./base/shape-option";
import define from '../util/define'
import ShapWorker from './worker/shap-worker.js?worker'
import PolygonMaterial from './shader/polygon-material'
import center from '@turf/center'
import PointMaterial from './shader/point-material'
import PolylineMaterial from './shader/polyline-material'
export default class ShapParse{
    /**
     * 
     * @param {ShapeOption} option 
     */
    constructor(option){
        this.url = option.url
        this.option = option
    }

    async initWithShpWoker(){
        const textDecoder = new TextDecoder()
        const shpWorer = new ShapWorker()
        const res = {
            "polygon" : new Object3D(),
            "polyline" : new Object3D(),
            "point": new Object3D()
        }
        const deffer = new Deffer()
        let color = new Color()
        this.type = null
        shpWorer.onmessage = (e)=>{
            const data = e.data
            let baseStyle;
            if (data.type === 'getPolygonStyle') {
                this.type = 'polygon'
                const {id , geojsons} = JSON.parse(textDecoder.decode(data.data))
                const tem = geojsons.map((fe)=>{
                    baseStyle = Polygon.getPolygonStyle(fe , this.option)
                    baseStyle.color = color.set(baseStyle.color).toArray()
                    return {
                        geo : fe.geometry,
                        style : baseStyle
                    }
                })

                let strs = JSON.stringify(tem)
                const coder = new TextEncoder().encode(strs)
                shpWorer.postMessage({
                    type : "getPolygon",
                    data : coder
                } , [coder.buffer])
               strs = null
            }

            if (data.type === 'getPointStyle') {
                this.type = 'point'
                const {id , geojsons} = JSON.parse(textDecoder.decode(data.data))
                let style;
                const tem = geojsons.map((fe)=>{
                    style = Point.getPointStyle(fe , this.option)
                    style.color = color.set(style.color).toArray()

                    return {
                        geometry : fe.geometry,
                        style : style
                    }
                })
                let strs = JSON.stringify(tem)
                const coder = new TextEncoder().encode(strs)
                shpWorer.postMessage({
                    type : "getPoint",
                    data : coder
                } , [coder.buffer])
               strs = null
            }



            if (data.type === 'getPolylineStyle') {
                this.type = 'polyline'
                const {id , geojsons} = JSON.parse(textDecoder.decode(data.data))
                let style;
                const tem = geojsons.map((fe)=>{
                    style = Polyline.getPolylineStyle(fe , this.option)
                    style.color = color.set(style.color).toArray().map((item)=>{
                        return item * 255
                    })

                    return {
                        geometry : fe.geometry,
                        style : style
                    }
                })
                let strs = JSON.stringify(tem)
                const coder = new TextEncoder().encode(strs)
                shpWorer.postMessage({
                    type : "getPolyline",
                    data : coder
                } , [coder.buffer])
               strs = null

            }

            if (data.type === 'center') {
                const fe = data.data
                this.center = new Vector3(fe.geometry.coordinates[0] , fe.geometry.coordinates[1] , 0)
            }

            if (data.type === 'point') {
                if (!this.material) this.initPointMaterial()
                let geometry = e.data.geometry
                let bufferGeometry = new BufferGeometry()
                bufferGeometry.setAttribute("position" , ShapParse.arrayBufferToAttr(geometry.position , 3))
                bufferGeometry.setAttribute('color' , ShapParse.arrayBufferToAttr(geometry.color , 3))
                bufferGeometry.setAttribute('asize' , ShapParse.arrayBufferToAttr(geometry.size , 1))
                res.point.add(
                    new Points(bufferGeometry , this.material)
                )
                res.polygon = null
                res.polyline = null
                deffer.resolve()   
            }

            if (data.type === 'polygon') {
                if (!this.material)  this.initPolygonMaterial()
                let geometry = e.data.geometry
                let attributes = geometry.attributes
                let bufferGeometry = new BufferGeometry()
                let textDecoder = new TextDecoder()
                let groups = JSON.parse(textDecoder.decode(geometry.groups))
                bufferGeometry.groups = groups
                bufferGeometry.setAttribute('position' , ShapParse.arrayBufferToAttr(attributes.position.array , attributes.position.itemSize))
                bufferGeometry.setAttribute('uv' , ShapParse.arrayBufferToAttr(attributes.uv.array , attributes.uv.itemSize))
                bufferGeometry.setAttribute('normal' , ShapParse.arrayBufferToAttr(attributes.normal.array , attributes.normal.itemSize))
                bufferGeometry.setAttribute('color' , ShapParse.arrayBufferToAttr(attributes.color.array , attributes.color.itemSize))
               // bufferGeometry.setIndex(ShapParse.arrayBufferToAttr(attributes.index.array , attributes.index.itemSize))
                res.polygon.add(
                    new Mesh(bufferGeometry , this.material)
                )
                geometry = null
                res.point = null
                res.polyline = null
                deffer.resolve()                
            }


            if (data.type === 'polyline') {
                if (!this.material) this.initPolylineMaterial()
                let geometry = e.data.geometry
                let bufferGeometry = new BufferGeometry()
                bufferGeometry.setAttribute('acolor' , ShapParse.arrayBufferToAttr(geometry.acolor , 3))
                bufferGeometry.setAttribute('counters' , ShapParse.arrayBufferToAttr(geometry.counters , 1))
                bufferGeometry.setAttribute('next' , ShapParse.arrayBufferToAttr(geometry.next , 3))
                bufferGeometry.setAttribute('position' , ShapParse.arrayBufferToAttr(geometry.position , 3))
                bufferGeometry.setAttribute('previous' , ShapParse.arrayBufferToAttr(geometry.previous , 3))
                bufferGeometry.setAttribute('side' , ShapParse.arrayBufferToAttr(geometry.side , 1))
                bufferGeometry.setAttribute('uv' , ShapParse.arrayBufferToAttr(geometry.uv , 2))
                bufferGeometry.setAttribute('width' , ShapParse.arrayBufferToAttr(geometry.width , 1))
                bufferGeometry.setIndex(ShapParse.arrayBufferToAttr(geometry.index , 1))
                res.point = null
                res.polygon = null
                res.polyline.add(
                    new Mesh(bufferGeometry , this.material)
                )
                deffer.resolve()
            }
            if (data.type === 'finished') {

            }
 
        }

        shpWorer.postMessage({
            type : "shp",
            data : {
                url : this.url 
            }
        })

        await deffer.promise

        return res
    }


    /**
     * 
     * @param {ArrayBuffer} buffer 
     * @param {number} itemSize 
     */
    static arrayBufferToAttr(buffer , itemSize){
        const geo = new BufferAttribute(buffer , itemSize)
        return geo
    }

    async init(){
        const tem = await shp(this.url)
        const geoJson = toMercator(tem , {mutate : true})
        const centers = center(geoJson)
        this.center = new Vector3(centers.geometry.coordinates[0] , centers.geometry.coordinates[1] , 0)
        const geoDatas = {
            "polygon" : [],
            "polyline" : [],
            "point" : []
        }
         geoJson.features.forEach((item)=>{
            if (["Polygon", "MultiPolygon"].includes(item.geometry.type)) {
                const tem = new Polygon(item , this.option)
                tem.init()
                geoDatas.polygon.push(tem.geometry)
            }

            if (["LineString" , "MultiLineString"].includes(item.geometry.type)) {
                const tem = new Polyline(item , this.option)
                tem.init()
                geoDatas.polyline.push(tem.geometry)
            }

            if (["Point" , "MultiPoint"].includes(item.geometry.type)) {
                const tem = new Point(item , this.option)
                tem.init()
                geoDatas.point.push(tem)
            }
        })
        const res = {
            "polygon" : null,
            "polyline" : null,
            "point": null
        }
        if (geoDatas.polygon.length) {
            const geo = mergeGeometries(geoDatas.polygon , true)
            this.initPolygonMaterial()
            res.polygon = new Mesh(geo , this.material)
        }

        if (geoDatas.polyline.length) {
            const geo = mergeGeometries(geoDatas.polyline , true)
            this.initPolylineMaterial()
            res.polyline = new Mesh(geo , this.material)
        }

        if (geoDatas.point.length) {
            const tem = geoDatas.point.reduce((pre , cur)=>{
                pre.position.push(...cur.points)
                cur.color && pre.color.push(...cur.color)
                cur.size && pre.size.push(cur.size)
                return pre
            },
                {
                    position : [],
                    color : [],
                    size : []
                }
            )

            const geometry = new BufferGeometry()
            geometry.setFromPoints(tem.position)
            if (tem.color.length) {
                const att = new BufferAttribute(new Uint8Array(tem.color) , 3)
                const size = new BufferAttribute(new Uint8Array(tem.size) , 1)
                geometry.setAttribute('asize' , size)
                geometry.setAttribute('color' , att)
            }
            this.initPointMaterial()
            const point = new Points(geometry , this.material)
            res.point = point
        }
        return res
        
    }


    /**
     * 
     *  材质
     */
    initPointMaterial(){

        if (!this.material) {
            this.material = new PointMaterial({
                side : DoubleSide,
            })
        }

        const pointStyle = this.option.style.point
        if (!define(pointStyle)) return

        if (pointStyle.lighting) {
            this.material.blending = AdditiveBlending
        } else {
            this.material.blending = NormalBlending
        }
        
        if (define(pointStyle.color)) {
            this.material.color = new Color(pointStyle.color)
        }

        if (define(pointStyle.map)) {
            this.material.map = new TextureLoader().load(pointStyle.map)
            this.material.map.colorSpace = SRGBColorSpace
        }

        if (define(pointStyle.size)) {
            this.material.size = pointStyle.size
        }

        if (define(pointStyle.depthTest)) {
            this.material.depthTest = pointStyle.depthTest
        }

        if (define(pointStyle.depthWrite)) {
            this.material.depthWrite = pointStyle.depthWrite
        }

        if (define(pointStyle.transparent)) {
            this.material.transparent = pointStyle.transparent
        }

        if (this.option.pointStyleCallBack) {
            this.material.vertexColors = true
        }
    }

    initPolygonMaterial(){

        if (!this.material) {
            this.material = new PolygonMaterial(
                {
                    vertexColors : true
                }
            )
        }

        const polygonStyle = this.option.style.polygon

        if (!define(polygonStyle)) return
        
        if (define(polygonStyle.color)) {
            this.material.color = new Color(polygonStyle.color)
        }
    }

    initPolylineMaterial(){
        if (!this.material) {
            this.material = new PolylineMaterial( {
                map: null,
                useMap: false,
                color: new Color('#6495ed'),
                resolution: new Vector2(window.innerWidth  , window.innerHeight),
                sizeAttenuation: false,
                lineWidth: 1,
                depthWrite: false,
                depthTest: false,
                transparent: false
            })
        }

        const polylineStyle = this.option.style.polyline

        if (!define(polylineStyle)) return

        if (define(polylineStyle.lighting)) {
            if (polylineStyle.lighting) {
                this.material.blending = AdditiveBlending
            } else {
                this.material.blending = NormalBlending
            }
        }

        if (define(polylineStyle.color)) {
            this.material.color = new Color(polylineStyle.color)
        }

        if (define(polylineStyle.lineWidth)) {
            this.material.lineWidth = polylineStyle.lineWidth
        }

        if (define(polylineStyle.useMap)) {
            this.material.useMap = polylineStyle.useMap
        }

        if (define(polylineStyle.map)) {
            this.material.map = new TextureLoader().load(polylineStyle.map)
        }

        if (define(polylineStyle.depthTest)) {
            this.material.depthTest = polylineStyle.depthTest
        }

        if (define(polylineStyle.depthWrite)) {
            this.material.depthWrite = polylineStyle.depthWrite
        }

        if (define(polylineStyle.resolution)) {
            this.material.resolution = new Vector2().fromArray(polylineStyle.resolution)
        }

        if (define(polylineStyle.transparent)) {
            this.material.transparent = polylineStyle.transparent
        }

    }


    /**
     * 
     * @param {ShapeOption} option 
     */
    setOption(option){
        if (!define(option)) return
        this.option = {
            ...this.option,
            ...option
        }

        if (this.type === 'point') {
            this.initPointMaterial()
            return
        }

        if (this.type === 'polyline') {
            this.initPolylineMaterial()
            return
        }

        if (this.type === 'polygon') {
            this.initPolygonMaterial()
            return
        }
    }
}