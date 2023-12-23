/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-05-18 14:56:28
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-05-22 15:21:01
 * @FilePath: \three-effect\src\three\viewer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as THREE from 'three'
import {FloatType , PMREMGenerator ,HalfFloatType  } from 'three' 
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/addons/libs/stats.module.js';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls'
export default class ThreeView {
    /**
     * 
     * @param {string} id 
     */
    constructor(id){
        this.id = id
    }

    init(isToViewer = true ){
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.5, 1000000  )
        this.camera.position.set(0 , 5 , 5)
        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.renderer = new THREE.WebGLRenderer( { antialias: true , logarithmicDepthBuffer : true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.camera.rotation.order = "YXZ"
        this.initLight()
      //  this.scene.add(new THREE.AmbientLight())
        window.addEventListener("reset" , ()=>{
          this.camera.aspect = this.el.clientWidth / this.el.clientHeight
          this.camera.updateProjectionMatrix()
          this.renderer.setSize(this.el.clientWidth, this.el.clientHeight)
        })

        if (isToViewer) {
           this.el = document.getElementById(this.id)
           this.el.appendChild(this.renderer.domElement)
        }
        

    }

    /**
     * 
     * @param {THREE.Object3D} tem 
     */
    initPickEvent(tem){
      let vec = new THREE.Vector2()
      const ray = new THREE.Raycaster()
      this.renderer.domElement.addEventListener("click" , (e)=>{
        vec.x = ((e.clientX / this.renderer.domElement.clientWidth) - 1) / 2
        vec.y =  ((e.clientX / this.renderer.domElement.clientWidth) - 1) / 2
        ray.setFromCamera(vec , this.camera)
        const res = ray.intersectObject(tem)
        console.log(res)
      })
    }

    toViewer(){
      this.el = document.getElementById(this.id)
      this.el.appendChild(this.renderer.domElement)
    }

   initTransform(){
      this.transformControls = new TransformControls(this.camera , this.renderer.domElement)
      this.transformControls.addEventListener( 'dragging-changed',  ( event )=> {
          this.control.enabled = ! event.value;
      } )
      return this.transformControls
   }

    getObjectControl(){
       this.control = new OrbitControls(this.camera , this.renderer.domElement)
       return this.control
    }

    getStatus(){
      this.stats = new Stats()
      this.el.appendChild(this.stats.dom)
    }
        /**
     *  加载cubeMap
     * @param {string} evnMapAsset 
     * @returns  
     */
        getCubeMapTexture(evnMapAsset , renderer) {
            function isMobile() {
              let check = false
                ; (function (a) {
                  if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                      a
                    ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                      a.substr(0, 4)
                    )
                  )
                    check = true
                })(navigator.userAgent || navigator.vendor || window.opera)
              if (check == false) {
                check =
                  [
                    'iPad Simulator',
                    'iPhone Simulator',
                    'iPod Simulator',
                    'iPad',
                    'iPhone',
                    'iPod'
                  ].includes(navigator.platform) ||
                  // iPad on iOS 13 detection
                  (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
              }
              return check
            }
        
            const isIosPlatform = isMobile()
        
            const path = evnMapAsset
        
            let scope = {
                renderer : renderer
            }
            return new Promise((resolve, reject) => {
              if (!path) {
                resolve({ envMap: null })
              } else if (path.indexOf('.hdr') >= 0) {
                new RGBELoader()
                  .setDataType(isIosPlatform ? HalfFloatType : FloatType)
                  .load(
                    path,
                    texture => {
                      scope.pmremGenerator = new PMREMGenerator(scope.renderer)
                      scope.pmremGenerator.compileEquirectangularShader()
        
                      const envMap =
                        scope.pmremGenerator.fromEquirectangular(texture).texture
                      scope.pmremGenerator.dispose()
        
                      resolve({ envMap })
                    },
                    undefined,
                    reject
                  )
              } else if (path.indexOf('.png') >= 0) {
                new RGBMLoader(this.options.manager).setMaxRange(8).load(
                  path,
                  texture => {
                    scope.pmremGenerator = new PMREMGenerator(scope.renderer)
                    scope.pmremGenerator.compileEquirectangularShader()
        
                    const envMap =
                      scope.pmremGenerator.fromEquirectangular(texture).texture
                    scope.pmremGenerator.dispose()
        
                    resolve({ envMap })
                  },
                  undefined,
                  reject
                )
              }
            })
    }


    getCubeMapTexture2(evnMapAsset , renderer) {
      const loader = new RGBELoader();

      // 加载HDR图像
      return new Promise((r , j)=>{
          loader.load(evnMapAsset, function (texture) {
            // 根据HDR图像生成立方体贴图
            const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
            cubeRenderTarget.fromEquirectangularTexture(renderer, texture);
            r(cubeRenderTarget.texture)
            // cubeRenderTarget.dispose()
        });
      }) 
    }
    addCubeMap(backgroundUrl = '/environment/kloppenheim_02_puresky_2k(1).hdr', environmentUrl = '/environment/footprint_court_2k.hdr') {
        if (backgroundUrl) { // 'assets/environment/skybox.hdr'
          this.getCubeMapTexture(backgroundUrl , this.renderer).then(({envMap})=>{
              this.scene.background = envMap
              this.scene.environment = envMap
          })
        }
    }

    getCameraPosition(){
      return this.camera.getWorldPosition(new THREE.Vector3())
    }

    initLight(){
      const light = new THREE.DirectionalLight(0xffffff, 0.5);
      light.position.set(20, 20, 20);
      this.scene.add(light)
      this.scene.add(new THREE.AmbientLight(0xe0f7fa, 0.5))

    }
    
    destroy(){
      this.el && this.el.removeChild(this.renderer.domElement)
      this.renderer && this.renderer.dispose()
      this.scene.traverse((item)=>{
        if (item instanceof THREE.Mesh){
          item.geometry.dispose()
          item.material.dispose()
        }
      })

      if (this.stopId) {
        cancelAnimationFrame(this.stopId)
        this.stopId = null
      }
      this.scene = null
      this.renderer = null
    }

        /**
     * 计算相机所能看到的box的position 从上往下看
     * @param {THREE.Box3} box 
     */
      setCameraPositionFromBox3(box){
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        // 计算相机点与box的最小水平距离
        const x = (2 * size.y) / Math.tan(this.camera.fov)
        const position = center.clone().add(new THREE.Vector3(0 , x + size.y))
        this.camera.position.copy(position)
        this.control.target.copy(center)
        this.camera.lookAt(center)
      }
    
      /**
       * 
       * @param {THREE.Sphere} sphere 
       */
      setCameraPositionFromSphere(sphere){
        const center = sphere.center
        const size = new THREE.Vector3(sphere.radius , sphere.radius , sphere.radius)
        const x = (2 * size.y) / Math.tan(this.camera.fov)
        const position = center.clone().add(new THREE.Vector3(0 , x + size.y))
        this.camera.position.copy(position)
        this.control.target.copy(center)
        this.camera.lookAt(center)
      }
}