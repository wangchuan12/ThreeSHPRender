import TaskWorker from "./task-woker"

export default class WorkerPool{
    /**
     * 
     * @param {Array<Worker>} workers 
     */   
    constructor(workers){
        this.taskList = []
        this.workers = workers.map((item)=>{
            return new TaskWorker(item , this._next.bind(this))
        })
    }

    postMessage(message , transfer){
        this.taskList.push({
            message : message,
            transfer : transfer
        })
        this._next()
    }

    /**
     * 
     * @param {Function} callback 
     */
    setWorkerCallBack(callback){
        this.callback = callback
    }


    _next(){
        if (this.taskList.length === 0) return
        const idleWorker = this.workers.find(item => item.isIdle())
        if (!idleWorker) return

        let task = this.taskList.shift()
        console.time('单次worker时间')
        idleWorker.postMessage(task.message , task.transfer).then((data)=>{
            this.callback(data)
            console.timeEnd('单次worker时间')
        }).catch(j => console.log(j))

        task = null
        
    }

}