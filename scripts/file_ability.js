const fs = require('fs')
const parse = require('./parse')

fileAbility()

function fileAbility(){
  let file = fs.readFileSync('./npc_abilities.txt')
  let txt = file.toString('utf8')
  let data = parse(txt)
  fs.writeFileSync('abilities.json', JSON.stringify(data, null, 2), 'utf8') // 技能数据写入 json 文件
}