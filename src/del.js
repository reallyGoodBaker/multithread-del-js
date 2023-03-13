const fs = require('fs')
const path = require('path')
const os = require('os')
const cp = require('child_process')

const cpuNums = os.cpus().length
const paths = []
const dirs = []

let opendFindingService = 0
async function gatherPaths(folder, onfinish=Function.prototype) {
    dirs.push(folder)
    opendFindingService ++
    const dirInfo = fs.readdirSync(folder)

    dirInfo.forEach(v => {
        const filePath = path.join(folder, v)

        if (fs.statSync(filePath).isDirectory()) {
            return gatherPaths(filePath)
        }

        paths.push(filePath)
    })

    opendFindingService--

    if (opendFindingService === 0) {
        onfinish.call(undefined)
    }
}

function rmPaths() {
    const size = paths.length
    const tasksPerThread = size / cpuNums
    
    let tasksAssigned = 0
    let workingThreadNums = 0

    return new Promise(resolve => {
        const taskFinished = () => {
            workingThreadNums--
    
            if (workingThreadNums <= 0) {
                resolve()
            }
        }
    
        for (let i = 1; i <= cpuNums; i++) {
            const shouldAssignedAll = Math.ceil(tasksPerThread * i)
            const shouldAssign = shouldAssignedAll - tasksAssigned
            const th = cp.fork('./thread_handler.js')
    
            workingThreadNums++
            tasksAssigned += shouldAssign
            th.send(paths.splice(0, shouldAssign))
            th.on('exit', taskFinished)
        }
    })
}

function rmDirs() {
    for (let i = dirs.length; i--;) {
        fs.rmdirSync(dirs[i])
    }
}

function rm(target, opt) {
    const onFilesFounded = opt.onFilesFounded || Function.prototype
    const onFilesRemoved = opt.onFilesRemoved || Function.prototype
    const onDeleteFinished = opt.onDeleteFinished || Function.prototype

    if (cpuNums < 1) {
        throw '无效的CPU信息'
    }

    return new Promise((resolve, reject) => {
        gatherPaths(target, async () => {
            try {
                await onFilesFounded.call(undefined, paths.length)
                await rmPaths()
                await onFilesRemoved.call(undefined)
                rmDirs()
                await onDeleteFinished.call(undefined)

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })
}

module.exports = {
    rm
}