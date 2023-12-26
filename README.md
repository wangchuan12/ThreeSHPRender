

# three-shp-render 

three-shp-render is a library for rendering Shapefiles (SHP) use three.js

**Read this in other languages: [English](README.md), [中文](README_zh.md).**

## render point feature

![image-20231225212310725](https://wangchuan12.github.io/public/example/image-point.png)

## render polygon feature

![image-20231225212425616](https://wangchuan12.github.io/public/example/image-polygon.png)

## render polyline feature

![image-20231225212528317](https://wangchuan12.github.io/public/example/image-polyline.png)

## sample

[shp-point (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-point.html)

[shp-polygon (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-polygon.html)

[shp-polyline (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-polyline.html))

[shp-polygon-worker (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-polygon-worker.html)

# How to use

## use umd files directly

```html
<script src="https://unpkg.com/three@0.159.0/build/three.min.js"></script>
<script src="../build/three-shp-render.umd.js"></script>
<script >
    const {ShpFileRender , ShapeOption} = ThreeShpRender
    const scene = new THREE.Scene() // init three.js scene
    // Prepare the style for rendering the shp file
    const baseOption = {
        ...ShapeOption,
        url : `http://${location.host}/public/data/polygon.zip`, // shp file address
        //fe is a geojson format of data that contains the geometry and attribute information of the elements
        polygonStyleCallBack : (fe)=>{ 
            return {
                color : 'rgb(255 , 0 ,0)', // custom colors
                extrudeHeight : fe.properties.Elevation // Customize the height according to the property
            }
        }
    }
    
    const shpPolygon = new ShpFileRender( baseOption)
    shpPolygon.init().then(()=>{
        shpPolygon.toOrigin()
        scene.add(shpPolygon)
    })
</script>
```

## Use npm

use **npm i three-shp-render** to install this moudle.

```js
npm i three-shp-render
```

```js
import {ShpFileRender , ShapeOption} from 'three-shp-render'
import {Scene} from 'three'

const scene = new Scene()
// Prepare the style for rendering the shp file
const baseOption = {
    ...ShapeOption,
    url : `http://${location.host}/public/data/polygon.zip`,
    //fe is a geojson format of data that contains the geometry and attribute information of the elements
    polygonStyleCallBack : (fe)=>{
        return {
            color : 'rgb(255 , 0 ,0)', // custom colors
            extrudeHeight : fe.properties.Elevation // Customize the height according to the property
        }
    }
}

const shpPolygon = new ShpFileRender( baseOption)
shpPolygon.init().then(()=>{
    shpPolygon.toOrigin()
    scene.add(shpPolygon)
})

```

# webworker

1 from [ThreeSHPRender/worker at main · wangchuan12/ThreeSHPRender (github.com)](https://github.com/wangchuan12/ThreeSHPRender/tree/main/worker)to get worker files.

2  Then place the folder at the root of your url, where the worker can be accessed at "http://${location.host}/worker/.... "

3  Then open the webworker configuration option

```js
import {ShpFileRender , ShapeOption} from 'three-shp-render'
import {Scene} from 'three'

const scene = new Scene()
const baseOption = {
    ...ShapeOption,
    useWorker : true,// open webworker
    url : `http://${location.host}/public/data/polygon.zip`,
    polygonStyleCallBack : (fe)=>{
        return {
            color : 'rgb(255 , 0 ,0)', // custom colors
            extrudeHeight : fe.properties.Elevation // Customize the height according to the property
        }
    }
}

const shpPolygon = new ShpFileRender( baseOption)
shpPolygon.init().then(()=>{
    shpPolygon.toOrigin()
    scene.add(shpPolygon)
})
```



# parameter definition

## ShapeOption

**The following parameters are default. If you need to modify them,  advised to copy and modify them.**

```js
const ShapeOption = { 
    url : "", // A url specifies the address of the shp file, be sure to enter the absolute address
    useWorker : false, // Whether to use webwoker for acceleration true to use webworker false to not use
    style : {
        // polygon style
        polygon : {
            extrudeHeight : 1 , // The height of a polygon, in meters
            color :  "rgb(255 , 255,255)", //polygon color
        },
        // polyline style
        polyline : {
            color :  "rgb(255 , 255,255)", // plyline color
            lineWidth : 1, // polyline width
            map: null, // polyline texture
            useMap: false, // Whether to use maps to color lines
            resolution: [window.innerWidth , window.innerHeight], //  Current canvas size
            sizeAttenuation: false, // Whether to scale with the camera
            depthWrite: false, // Write depth or not
            depthTest: false, // Whether to conduct depth detection
            transparent: false, // Whether to enable transparency
            lighting : true // Whether to light the graphics. After this option is enabled, the graphics can be lit
        },
        // point style
        point : {
            color :  "rgb(255 , 255,255)",// point color
            map : null, // point texture
            size : 1000, // point size
            sizeAttenuation : true, // Whether to scale with the camera
            transparent : true, // Whether to enable transparency
            depthTest : false, // Whether to conduct depth detection
            depthWrite : false, // Write depth or not
            lighting : true  // Whether to light the graphics. After this option is enabled, the graphics can be lit

        }
    },
    // A polygon style callback that calculates the style of each element. fe is the geojson format of the element
    polygonStyleCallBack : (fe)=>{
        return {
            extrudeHeight : 1, 
            color : "rgb(255 , 255,255)"
        }
    },
    // A point style callback that calculates the style of each element. fe is the geojson format of the element
    pointStyleCallBack : (fe)=>{
        return {
            size : 1,
            color : "rgb(255 , 255,255)"
        }
    },
    // A line style callback that calculates the style of each element. fe is the geojson format of the element
    polylineStyleCallBack : (fe)=>{
        return {
            width : 1,
            color : "rgb(255 , 255,255)"
        }
    }

}

export default ShapeOption
```

# ShpFileRender

The main class used to render the shp file, taking a parameter to the ShapeOption structure

## member

### center

A  vector3 object of three that represents the geometric center of the **shp** file

## method

### async init

An  asynchronous function  is used to initialize and resolve the shp file, and when it is resolved , the resolution is complete

### toOrigin

 used to move the graph to the origin

### destroy

used to destroy graphics and free memory

# matters need attention

- The file address of shpfile must be passed to the absolute address

# references

[mrdoob/three.js: JavaScript 3D Library. (github.com)](https://github.com/mrdoob/three.js/)

[calvinmetcalf/shapefile-js: Convert a Shapefile to GeoJSON. Not many caveats. (github.com)](https://github.com/calvinmetcalf/shapefile-js)

