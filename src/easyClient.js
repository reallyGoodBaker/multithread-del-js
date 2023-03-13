const { rm } = require('./del')

async function rmWithUi(folder) {
    console.log('寻找文件')
    await rm(folder, {
        onFilesFounded(size) {
            console.log(`找到 ${size} 个文件, 删除中`)
        },
        onFilesRemoved() {
            console.log(`删除完毕, 清理文件夹`);
        },
        onDeleteFinished() {
            console.log(`删除完毕`)
        },
    })
}

module.exports = {
    rmWithUi
}