import { toMercator } from "@turf/projection"
import shp from "shpjs/dist/shp"
import polygonWorker from './polygon-worker.js?worker'
import pointWorker from './point-worker.js?worker'
import PolylineWorker from './polyline-worker.js?worker'
import center from "@turf/center"
import WorkerPool from "../../worker-pool/worker-pool"

async function getShpData(url){
  const geojson = await shp(url)
  const meactor = toMercator(geojson , {mutate : true})
  return meactor
}


let id = 0
const textEncoder = new TextEncoder()
let count = 0
const size = globalThis.navigator.hardwareConcurrency


function getPolygonWorker(){
  return new Array(size).fill(0).map(item =>{
    return new polygonWorker()
  })
}

function getPointWorker(){
  return new Array(size).fill(0).map(item =>{
    return new pointWorker()
  })
}


function getPolylineWorker(){
  return new Array(size).fill(0).map(item =>{
    return new PolylineWorker()
  })
}




function polygonWorkerCallback(e){
  console.log('发往主线程的数据')
  const transferableGeometry = e.data.geometry
  postMessage(
    {geometry : transferableGeometry , type : "polygon"} ,[
      transferableGeometry.attributes.position.array.buffer,
      transferableGeometry.attributes.normal.array.buffer,
      transferableGeometry.attributes.uv.array.buffer,
      transferableGeometry.attributes.color.array.buffer,
      transferableGeometry.groups.buffer
    ] 
  )
  count--
  if (count <= 0 ){
    self.close()
  }
}

function pointWorkerCallback(e){
  const transferableGeometry = e.data.geometry

  postMessage({
    geometry : transferableGeometry  , type : "point"
  },[
    transferableGeometry.position.buffer,
    transferableGeometry.color.buffer,
    transferableGeometry.size.buffer
  ])
  count--
  if (count <= 0 ){
    self.close()
  }
}

function polylineWorkerCallback(e){
  const transferableGeometry = e.data.geometry
  const data = e.data

  postMessage({
    geometry : transferableGeometry  , type : "polyline"
  },[
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
  count--
  if (count <= 0 ){
     self.close()
  }
}


function initWorker(type){
  switch(type){
    case 'polygon':
      return new WorkerPool(getPolygonWorker())
    case 'point' :
      return new WorkerPool(getPointWorker())
    case 'polyline' :
      return new WorkerPool(getPolylineWorker())
  }
}



function getStyle(geometrys , type){
  id++
  let str = textEncoder.encode(JSON.stringify(
    {
      id : id,
      geojsons : geometrys
    }
  ))

  postMessage({
    type : type,
    data : str
  } , [str.buffer])

  str = null
  geometrys = null
}


let workerPool;
onmessage = async (e)=>{
    const {type , data} = e.data
    if (type === 'shp') {
      let tem = await getShpData(data.url)
      let centers = center(tem)
      postMessage({
        type : 'center',
        data : centers
      })
      let res = {
        polygon : [],
        polyline : [],
        point : []
      }
      const step = 1000
      let item;
      for(let i = 0 ; i < tem.features.length ; i++) {
        item = tem.features[i]
        if (["Polygon", "MultiPolygon"].includes(item.geometry.type)) {
    
          res.polygon.push(item)
          if (res.polygon.length > step) {
            getStyle(res.polygon , "getPolygonStyle")
            res.polygon = []
            count++
          }
        }

        if (["LineString" , "MultiLineString"].includes(item.geometry.type)) {
          res.polyline.push(item)
          if (res.polyline.length > step) {
            getStyle(res.polyline , "getPolylineStyle")
            res.polyline = []
            count++
          }
        }

        if (["Point" , "MultiPoint"].includes(item.geometry.type)) {
          res.point.push(item)
          if (res.point.length > step) {
            getStyle(res.point , "getPointStyle")
            res.point = []
            count++
          }
        }
      }

      if (res.point.length) {
        getStyle(res.point , "getPointStyle")
        count++
      }

      if (res.polyline.length) {
        getStyle(res.polyline , "getPolylineStyle")
        count++
      }

      if (res.polygon.length) {
        getStyle(res.polygon , "getPolygonStyle")
        count++
      }
      tem = null
      res = null
      centers = null
    }


    if (type === 'getPolygon') {
      if (!workerPool) {
        const worker = initWorker('polygon')
        workerPool = worker
        worker.setWorkerCallBack(polygonWorkerCallback)
      }
      workerPool.postMessage(data , [data.buffer])
    }

    if (type === 'getPoint') {
      if (!workerPool) {
        const worker = initWorker('point')
        workerPool = worker
        worker.setWorkerCallBack(pointWorkerCallback)
      }

      workerPool.postMessage(data , [data.buffer])
    }

    if (type === 'getPolyline') {
      if (!workerPool) {
        const worker = initWorker('polyline')
        workerPool = worker
        worker.setWorkerCallBack(polylineWorkerCallback)
      }

      workerPool.postMessage(data , [data.buffer])
    }
}