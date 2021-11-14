import wsWorker from '@/web-worker/wsWorker.js'

class createWorker {
  constructor(worker) {
    console.log('createWorker...')
    const workerStr = worker.toString()
    const blob = new Blob([`(${workerStr})()`])
    return new Worker(URL.createObjectURL(blob))
  }
}
let worker = null
if (!worker) {
  worker = new createWorker(wsWorker)
}
export {
  worker,
}