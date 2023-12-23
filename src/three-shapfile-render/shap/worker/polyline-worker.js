import { BufferAttribute, BufferGeometry } from "three";
import { MeshLine } from "three.meshline";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

const textDecoder = new TextDecoder()

/**
 * 
 * @param {BufferGeometry} geometry 
 * @param {Array<number>} color 
 */
function setGeometryColor(geometry  , color){
    const position = geometry.getAttribute('position')
    const tem = []

    for (let i = 0 ; i < position.count ; i++){
        tem.push(color[0] , color[1] , color[2])
    }

    const colorAtt = new BufferAttribute( new Uint8Array(tem ) , 3)
    geometry.setAttribute('acolor' , colorAtt)
}

/**
 * 
 * @param {MeshLine} mesh 
 */
function postMeshLine(mesh){
    const data = {
        geometry : {
            acolor : mesh.attributes["acolor"].array,
            counters : mesh.attributes["counters"].array,
            next : mesh.attributes["next"].array,
            position : mesh.attributes["position"].array,
            previous : mesh.attributes["previous"].array,
            side : mesh.attributes["side"].array,
            uv : mesh.attributes["uv"].array,
            width : mesh.attributes["width"].array,
            index : mesh.index.array
        },
        type : 'polyline'
    }

    postMessage(data ,[
        data.geometry.acolor.buffer,
        data.geometry.counters.buffer,
        data.geometry.next.buffer,
        data.geometry.position.buffer,
        data.geometry.previous.buffer,
        data.geometry.side.buffer,
        data.geometry.uv.buffer,
        data.geometry.width.buffer,
        data.geometry.index.buffer
    ])

}

onmessage = (e)=>{
    const data = e.data
    const geojson = JSON.parse(textDecoder.decode(data))
    let geo;
    let style;
    let tem = []
    let geometry = [];
    for (let i = 0 ; i < geojson.length ; i++) {
        geo = geojson[i].geometry
        style = geojson[i].style
        tem = []
        if (geo.type === "LineString") {
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
             setGeometryColor(meshline , style.color)
            } else {
             meshline.setGeometry(bufferGeometry)
            }
            geometry.push(meshline)
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
                         setGeometryColor(meshline , style.color)
                         console.log(meshline)
                     } else {
                         meshline.setGeometry(bufferGeometry)
                     }
                     lines.push(meshline)
                 })
                 geometry.push(mergeGeometries(lines , true))
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
                     setGeometryColor(meshline , style.color)
                 } else {
                     meshline.setGeometry(bufferGeometry)
                 }
                 geometry.push(meshline)
             }
         }
    }
    postMeshLine(mergeGeometries(geometry))
}