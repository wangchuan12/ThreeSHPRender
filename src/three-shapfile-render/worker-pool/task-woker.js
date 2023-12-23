export default class TaskWorker{
    /**
     * 
     * @param {Worker} worker 
     * @param {function} nextCallback 
     */
    constructor(worker , nextCallback){
        this.worker = worker
        this.state = 'idle'
        this.nextCallback = nextCallback
        this._init()
    }

    _init(){
        this.worker.onmessage = (e)=>{
            this.state = 'idle'
            this.r(e)
            this.nextCallback()
        }

        this.worker.onerror = (e)=>{
            this.j(e)
        }

        this.nextCallback()
    }


    postMessage(){
        this.promise = new Promise((r , j)=>{
            this.r = r
            this.j = j
        })
        this.state = 'active'
        this.worker.postMessage(...arguments)
        return this.promise
    }

    isIdle(){
        return this.state === 'idle'
    }
}