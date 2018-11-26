const fs = require('fs')
const parse = require('./parse')

fileUnit()

function fileUnit(){
  let file = fs.readFileSync('./npc_units.txt')
  let txt = file.toString('utf8')
  let data = parse(txt)
  fs.writeFileSync('units.json', JSON.stringify(data, null, 2), 'utf8') // 技能数据写入 json 文件
}