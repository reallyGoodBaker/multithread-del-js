const { rm } = require('./del')

function rmWithUi(folder) {
    console.log('寻找文件')
    rm(folder, {
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
    rm, rmWithUi
}