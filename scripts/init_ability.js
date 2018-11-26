const fs = require('fs')
const parse = require('./parse')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const superagent = require('superagent')
require('superagent-charset')(superagent)
const _ = require('lodash')
const model = require('../config/model')
const Dability = model.Dability
const Dhero = model.Dhero

const list_url = 'http://www.dota2.com/jsfeed/heropediadata?feeds=abilitydata&l=schinese'
const ability_base_url = 'http://cdn.dota2.com/apps/dota2/images/abilities/'

syncAbilities()

async function syncAbilities(){
  try{
    let list = await superagent.get(list_url)
    if(list.status==200){
      let abilities = list.body.abilitydata
      let file = fs.readFileSync('./npc_abilities.txt')
      let txt = file.toString('utf8')
      let data = parse(txt)
      // fs.writeFileSync('abilities.json', JSON.stringify(data, null, 2), 'utf8') // 技能数据写入 json 文件
      let heroes = await Dhero.findAll({ attributes: ['sid', 'name'] })
      _.forEach(abilities, function(abi, key){
        let sid = parseInt(data['DOTAAbilities'][key]['ID'])
        let name = key
        let name_l = abi['dname']
        let idx = _.findIndex(heroes, function(hero){
          return abi['hurl'].toLowerCase() == hero['name']
        })
        let hero_id = heroes[idx]['sid']
        Dability.findOrCreate({
          where: {
            sid: sid
          },
          defaults: {
            sid: sid,
            name: name,
            name_l: name_l,
            img_url: name.match(/special_bonus_/) ? null : `${ability_base_url}${name}_hp1.png`
          }
        }).spread(async (nitem, created) => {
          if(created==false){
            await nitem.update({
              name: name,
              name_l: name_l,
              img_url: name.match(/special_bonus_/) ? null : `${ability_base_url}${name}_hp1.png`
            })
            console.log('更新：'+name_l)
          }else{
            console.log('创建：'+name_l)
          }
        })
      })
    }
  }catch(err){
    console.log(err)
    process.exit()
  }
}