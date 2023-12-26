# 简介

three-shp-render 是一个用来在浏览器渲染shapefile(SHP)的库。

## 渲染点

![image-20231225212310725](https://wangchuan12.github.io/public/example/image-point.png)

## 渲染面

![image-20231225212425616](https://wangchuan12.github.io/public/example/image-polygon.png)

## 渲染线

![image-20231225212528317](https://wangchuan12.github.io/public/example/image-polyline.png)

## 示例

链接如下

[shp-point (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-point.html)

[shp-polygon (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-polygon.html)

[shp-polyline (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-polyline.html))

[shp-polygon-worker (wangchuan12.github.io)](https://wangchuan12.github.io/public/example/shp-polygon-worker.html)

# 如何使用

## 一种是直接引入文件

```html
<script src="https://unpkg.com/three@0.159.0/build/three.min.js"></script>
<script src="../build/three-shp-render.umd.js"></script>
<script >
    const {ShpFileRender , ShapeOption} = ThreeShpRender
    const scene = new THREE.Scene()
    const baseOption = {
        ...ShapeOption,
        url : `http://${location.host}/public/data/polygon.zip`,
        polygonStyleCallBack : (fe)=>{
            return {
                color : 'rgb(255 , 0 ,0)', // 自定义颜色
                extrudeHeight : fe.properties.Elevation // 根据属性自定义高度
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

## 一种是基于npm模块

```js
import {ShpFileRender , ShapeOption} from 'three-shp-render'
import {Scene} from 'three'

const scene = new Scene()
const baseOption = {
    ...ShapeOption,
    url : `http://${location.host}/public/data/polygon.zip`,
    polygonStyleCallBack : (fe)=>{
        return {
            color : 'rgb(255 , 0 ,0)', // 自定义颜色
            extrudeHeight : fe.properties.Elevation // 根据属性自定义高度
        }
    }
}

const shpPolygon = new ShpFileRender( baseOption)
shpPolygon.init().then(()=>{
    shpPolygon.toOrigin()
    scene.add(shpPolygon)
})

```

# 结合webworker使用

1 首先从[ThreeSHPRender/worker at main · wangchuan12/ThreeSHPRender (github.com)](https://github.com/wangchuan12/ThreeSHPRender/tree/main/worker)此地址获取worker文件夹下的worker文件

2 然后将这个文件夹放置在你url的根目录下，worker的访问地址为"http://${location.host}/worker/....“

3 然后开启webworker配置选项

```js
import {ShpFileRender , ShapeOption} from 'three-shp-render'
import {Scene} from 'three'

const scene = new Scene()
const baseOption = {
    ...ShapeOption,
    useWorker : true,// 开启webworker
    url : `http://${location.host}/public/data/polygon.zip`,
    polygonStyleCallBack : (fe)=>{
        return {
            color : 'rgb(255 , 0 ,0)', // 自定义颜色
            extrudeHeight : fe.properties.Elevation // 根据属性自定义高度
        }
    }
}

const shpPolygon = new ShpFileRender( baseOption)
shpPolygon.init().then(()=>{
    shpPolygon.toOrigin()
    scene.add(shpPolygon)
})
```



# 参数定义

## ShapeOption

**以下参数为默认参数，如需修改建议拷贝后修改**

```js
const ShapeOption = { 
    url : "", // 一个url 指定 shp文件的地址，注意请填入绝对地址
    useWorker : false, // 是否是用webwoker 进行加速 true 为 使用webworker false 为不使用
    style : {
        // 面样式
        polygon : {
            extrudeHeight : 1 , // 面突起的高度， 单位为米
            color :  "rgb(255 , 255,255)", // 面的颜色
        },
        // 线样式
        polyline : {
            color :  "rgb(255 , 255,255)", // 线的颜色
            lineWidth : 1, // 线的宽度
            map: null, // 线的贴图
            useMap: false, // 是否使用贴图为线着色
            resolution: [window.innerWidth , window.innerHeight], // 当前画布大小
            sizeAttenuation: false, // 是否随相机缩放
            depthWrite: false, // 是否写入深度
            depthTest: false, // 是否进行深度探测
            transparent: false, // 是否开启透明度
            lighting : true // 是否点亮图形 ， 开启此项后能点亮图形
        },
        // 点样式
        point : {
            color :  "rgb(255 , 255,255)",// 点的颜色
            map : null, // 点的贴图
            size : 1000, // 点的大小
            sizeAttenuation : true,// 是否随相机缩放
            transparent : true,// 是否开启透明度
            depthTest : false,// 是否写入深度
            depthWrite : false, // 是否进行深度探测
            lighting : true // 是否点亮图形 ， 开启此项后能点亮图形

        }
    },
    // 一个多变形样式回调，用来计算每一个要素的样式 。 fe为该要素的geojson格式
    polygonStyleCallBack : (fe)=>{
        return {
            extrudeHeight : 1, 
            color : "rgb(255 , 255,255)"
        }
    },
    // 一个点样式回调，用来计算每一个要素的样式 。 fe为该要素的geojson格式
    pointStyleCallBack : (fe)=>{
        return {
            size : 1,
            color : "rgb(255 , 255,255)"
        }
    },
    // 一个线样式回调，用来计算每一个要素的样式 。 fe为该要素的geojson格式
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

用来渲染shp文件的主类，接受一个ShapeOption 结构的参数

## 成员

### center

一个three的**vector3**对象，表示着该**shp**文件的几何中心

## 方法

### async init

一个**异步函数**用来初始化和解析shp文件，当其被**resolve**时代表解析完成

### toOrigin

**用来将图形移动至原点**

### destroy

用来销毁图形并释放内存

# 注意事项

##    shpfile的文件地址务必传入绝对地址

# 参考

[mrdoob/three.js: JavaScript 3D Library. (github.com)](https://github.com/mrdoob/three.js/)

[calvinmetcalf/shapefile-js: Convert a Shapefile to GeoJSON. Not many caveats. (github.com)](https://github.com/calvinmetcalf/shapefile-js)

