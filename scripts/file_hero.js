const fs = require('fs')
const parse = require('./parse')

fileHero()

function fileHero(){
  let file = fs.readFileSync('./npc_heroes.txt')
  let txt = file.toString('utf8')
  let data = parse(txt)
  fs.writeFileSync('heroes.json', JSON.stringify(data, null, 2), 'utf8') // 技能数据写入 json 文件
}