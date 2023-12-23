<script setup>
import { onMounted } from 'vue';
import ThreeView from './three-viewer/three-view'
import * as THREE from 'three'
import {ShpFileRender , ShapeOption} from './three-shapfile-render/shap/index'
const getLinerColor = ()=>{
    const c=  document.createElement("canvas")
    const ctx=c.getContext("2d");
    //创建一个线条渐变
    const jb=ctx.createLinearGradient(0,0,100,0);
    jb.addColorStop(0, '#ffd89b');//参数为0<stop<1,color
    jb.addColorStop(1, "#19547b");
    //填充渐变
    ctx.fillStyle=jb;
    ctx.fillRect(0,0,255 ,1);//参数依次为：x,y,width,height 
    return ctx 
}

const ctx = getLinerColor()
const stet = 255 / 30
const heightMap2 = new Array(30).fill(0).map((item , index)=>{
  const color = ctx.getImageData(index * stet , 0 , 1 , 1)
  return {
    range : [index * 10 , (index + 1) * 10 ],
    color : `rgb(${color.data[0]} , ${color.data[1]},${color.data[2]})`
  }
})

const colorSizeMap = new Array(30).fill(0).map((item , index)=>{
  const color = ctx.getImageData(index * stet , 0 , 1 , 1)
  return {
    range : [index  , (index + 1) ],
    color : `rgb(${color.data[0]} , ${color.data[1]},${color.data[2]})`,
    size : (index + 1) * 10
  }
})

console.log(heightMap2)
const baseOption = {
    ...ShapeOption,
    url : `${location.href}/data/polyline.zip`,//`${location.href}/data/Export_Output.zip`
    polygonStyleCallBack : (fe)=>{
      const color = heightMap2.find((item)=>{return item.range[0] <= fe.properties.Elevation && item.range[1] >= fe.properties.Elevation})?.color || 'rgb(91,153,150)'
     // console.log("当前选择的颜色",  fe , color ,  fe.properties.Elevation)
      return {
        color : color,
        extrudeHeight : fe.properties.Elevation
      }
    },
    pointStyleCallBack : (fe)=>{
      const item = colorSizeMap[Math.floor(Math.random() * 30)]
      return {
        color : item?.color || 'rgb(91,153,150)',
        size : item?.size || 10
      }
    },
    polylineStyleCallBack : (fe)=>{
      const item = colorSizeMap[Math.floor(Math.random() * 30)]
      return {
        color : item?.color || 'rgb(91,153,150)',
        width : item?.size / 30
      }
    }
    
}
baseOption.style.point.size = 4
baseOption.style.point.sizeAttenuation = false
baseOption.style.point.color ='rgb(255 , 255, 255)'
baseOption.style.polyline.color = 'rgb(255 , 255, 255)'
baseOption.style.polyline.lineWidth = 1

const shpPolygon = new ShpFileRender({
  ...baseOption , 
  url : `${location.href}/data/polyline.zip`
})


const tem = [
  shpPolygon.init()
]

const render = new THREE.Object3D()
const viewer = new ThreeView('three-con')
// x: -2492.2442436057995, y: -5.763053670660309e-13, z: -2595.4486363701935
//x: -3227.450158706827, y: -1.1981221363435217e-12, z: -5395.862406781027
const lightPoint = [
  {
    point : new THREE.Vector3(5236.24954436416 , -5.763053670660309 ,  5614.271063313183),
    color : new THREE.Color('#ffd89b'),
    distance : 100000000
  },
  {
    point :  new THREE.Vector3(-3398.894108447418 ,-1.1981221363435217 , 3784.0523842477296),
    color : new THREE.Color("#19547b"),
    distance : 100000000
  },
]
Promise.all(tem).then(()=>{
  render.add(shpPolygon)
  console.log(shpPolygon)
  shpPolygon.toOrigin()
  // render.add(shpPolyline)
  // render.add(shpPoint)
  const box = new THREE.Box3().expandByObject(render)
  const size = box.getSize(new THREE.Vector3())
  const plane = new THREE.PlaneGeometry(size.x , size.x)
  const text = new THREE.Mesh(plane , new THREE.MeshBasicMaterial({
    side : THREE.DoubleSide
  }))

  text.visible = false
  text.rotateX(Math.PI / 2)
  viewer.scene.add(text)
  viewer.initPickEvent(text)
  console.log('box' , box , box.getCenter(new THREE.Vector3()) , box.getSize(new THREE.Vector3()))
//  render.position.copy(box.getCenter(new THREE.Vector3()).negate())
  // shpPolygon.toOrigin()
  // shpPolyline.toOrigin()
  // shpPoint.toOrigin()
})
onMounted(()=>{
  window.viewer = viewer
  viewer.init()
  viewer.camera.position.set(-8.836303895275307, 15069.542106651586, 15298.25862359854)
  // viewer.camera.position.set(-643.0865095380605,  8841.298833690838, 7293.638305700457)
  // viewer.addCubeMap('/tex/city.hdr' , '/tex/city.hdr')
  viewer.getObjectControl()
  viewer.scene.add(render)
  viewer.scene.add(
    new THREE.Mesh(new THREE.BoxGeometry(1 ,1 , 1) , new THREE.MeshBasicMaterial({
      color : "red"
    }))
  )
  // viewer.scene.add(new THREE.AmbientLight(0xe0f7fa, 0.1))
  // lightPoint.forEach((item)=>{
  //   const pointLight = new THREE.PointLight(item.color, 10000000 , item.distance)
  //   pointLight.position.set(item.point.x , 200 , item.point.y)
  //   const sphereSize = 1;
  //   const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
  //   viewer.scene.add( pointLightHelper )
  //   viewer.scene.add(pointLight)
  // })
  const start  = ()=>{
    viewer.renderer.render(viewer.scene , viewer.camera)
    requestAnimationFrame(()=>{
     start()
    })
  }

  start()
})

</script>

<template>
  <div id="three-con"></div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
