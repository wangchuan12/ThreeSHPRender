const ShapeOption = { 
    url : "",
    useWorker : false,
    style : {
        polygon : {
            extrudeHeight : 1,
            color :  "rgb(255 , 255,255)",
        },
        polyline : {
            color :  "rgb(255 , 255,255)",
            lineWidth : 1,
            map: null,
            useMap: false,
            resolution: [window.innerWidth , window.innerHeight],
            sizeAttenuation: false,
            lineWidth: 1,
            depthWrite: false,
            depthTest: false,
            transparent: false,
            lighting : true
        },
        point : {
            color :  "rgb(255 , 255,255)",
            map : '/tex/spark1.png',
            size : 1000,
            sizeAttenuation : true,
            transparent : true,
            depthTest : false,
            depthWrite : false,
            lighting : true

        }
    },
    polygonStyleCallBack : ()=>{
        return {
            extrudeHeight : 1,
            color : "rgb(255 , 255,255)"
        }
    },
    pointStyleCallBack : ()=>{
        return {
            size : 1,
            color : "rgb(255 , 255,255)"
        }
    },
    polylineStyleCallBack : ()=>{
        return {
            width : 1,
            color : "rgb(255 , 255,255)"
        }
    }

}

export default ShapeOption