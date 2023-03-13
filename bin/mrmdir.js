#!/usr/bin/env node

const { rmWithUi } = require('../src/easyClient')
const path = require('path')
const args = process.argv.slice(2)

;(async() => {
    for (let target of args) {
        if (!path.isAbsolute(target)) {
            target = path.join(process.cwd(), target)
        }
    
        await rmWithUi(target)
    }
})()