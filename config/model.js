const path = require('path')
const fs = require('fs')

let files = fs.readdirSync(path.resolve(__dirname, '../models'))

let js_files = files.filter((f) => {
  return f.endsWith('.js')
}, files)

module.exports = {}

for(let f of js_files){
  let name = f.substring(0, f.length-3)
  module.exports[name] = require(path.resolve(__dirname, '../models/'+f))
}