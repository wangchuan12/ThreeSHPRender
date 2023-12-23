const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()
onmessage = (e)=>{
    const data = e.data
    const points = JSON.parse(textDecoder.decode(data))
    let item;
    let geometry;
    let style;
    const point = []
    const color = []
    const size = []
    for(let i = 0 ; i < points.length ; i++) {
        geometry = points[i].geometry
        style = points[i].style
        if (geometry.type === "Point") {
            point.push(
                geometry.coordinates[0],
                geometry.coordinates[1],
                0
            )
            color.push(
                style.color[0] * 255,
                style.color[1] * 255,
                style.color[2] * 255
            )
            size.push(style.size)
        }

        if (geometry.type === 'MultiPoint') {
            geometry.coordinates.forEach(element => {
                point.push(element.coordinates[0] , element.coordinates[1] , 0)
                color.push(
                    style.color[0] * 255,
                    style.color[1] * 255,
                    style.color[2] * 255
                )
                size.push(style.size)
            })
        }
    }

    const position = new Float32Array(point)

    const colors = new Uint8Array(color)

    const sizes = new Uint8Array(size)

    postMessage( {
        geometry : {
            position : position,
            color : colors,
            size : sizes
        },
        type : 'point'
    } , [
        position.buffer,
        colors.buffer,
        sizes.buffer
    ])
}