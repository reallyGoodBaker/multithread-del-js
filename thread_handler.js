const fs = require('fs')

process.on('message', targetFiles => {
    targetFiles.forEach(file => {
        fs.unlinkSync(file)
    })
    process.exit(0)
})