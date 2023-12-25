import { BufferAttribute, Vector3 } from "three"
import Convert from "../convert"
import { mergeGeometries } from "../base/BufferGeometryUtils";
let textEncoder = new TextEncoder()
const transferGeo = (geometry)=>{
    let string = JSON.stringify(geometry.groups)
    let groups = textEncoder.encode(string)
    string = null
    const transferableGeometry = {
        attributes: {
          position: {
            array: geometry.attributes.position.array,
            itemSize: geometry.attributes.position.itemSize,
            count: geometry.attributes.position.count
          },
          normal: {
            array: geometry.attributes.normal.array,
            itemSize: geometry.attributes.normal.itemSize,
            count: geometry.attributes.normal.count
          },
          uv : {
            array : geometry.attributes.uv.array,
            itemSize : geometry.attributes.uv.itemSize,
            count: geometry.attributes.uv.count
          },
        //   index : {
        //     array : geometry.index.array,
        //     itemSize : geometry.index.itemSize,
        //     count: geometry.index.count
        //   },
          color : {
            array : geometry.attributes.color.array,
            itemSize :  geometry.attributes.color.itemSize,
            count:  geometry.attributes.color.count
          },
          // 添加其他需要传输的属性...
        },
        groups : groups,
        boundingBox : geometry.boundingBox,
        center : geometry.boundingBox.getCenter(new Vector3()),
        // 添加其他需要传输的属性...
      }

    postMessage({geometry : transferableGeometry} ,[
        transferableGeometry.attributes.position.array.buffer,
        transferableGeometry.attributes.normal.array.buffer,
        transferableGeometry.attributes.uv.array.buffer,
        transferableGeometry.attributes.color.array.buffer,
        // transferableGeometry.attributes.index.array.buffer,
        transferableGeometry.groups.buffer
    ] )

    groups = null
}
onmessage = (e)=>{
    const data = e.data
    const decode = new TextDecoder()
    const polygon = JSON.parse(decode.decode(data))
    let polygons = []
    let colorArr = []
    for(let i = 0 ; i < polygon.length;i++) {
        const {style , geo} = polygon[i]
        const geometry = Convert.polygonToGeometry(geo , style.extrudeHeight)
        const position = geometry.getAttribute('position')
        for (let i = 0 ; i < position.array.length ;i += 3) {
            colorArr.push(style.color[0] * 255 , style.color[1] * 255 , style.color[2] * 255)
        }

        const att = new BufferAttribute(new Uint8Array(colorArr) , 3)
        geometry.setAttribute('color' , att)
        polygons.push(geometry)
        colorArr = []
    }


    let realGeo = mergeGeometries(polygons , false)
    realGeo.computeBoundingBox()
    transferGeo(realGeo)
    realGeo = null
    polygons = null
    colorArr = null

}