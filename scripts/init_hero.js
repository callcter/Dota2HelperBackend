const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const superagent = require('superagent')
require('superagent-charset')(superagent)
const _ = require('lodash')
const model = require('../config/model')
const Dhero = model.Dhero
const list_url = `http://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1?key=${process.env.STEAM_KEY}&language=zh`
const info_url = 'http://www.dota2.com/jsfeed/heropickerdata?l=schinese'
const attr_url = 'http://www.dota2.com/jsfeed/heropediadata?feeds=herodata&l=schinese'
const hero_base_url = 'http://cdn.dota2.com/apps/dota2/images/heroes/'

syncHeros()

async function syncHeros(){
  try{
    let list = await superagent.get(list_url)
    let info = await superagent.get(info_url)
    let attr = await superagent.get(attr_url)
    if(list.status == 200 && info.status == 200 && attr.status == 200){
      let heroes = list.body.result.heroes
      let hero_infos = info.body
      let hero_attrs = attr.body.herodata
      let sum = heroes.length
      let count = 0
      _.forEach(heroes, function(hero){
        let sid = hero.id
        let name = hero.name.replace(/npc_dota_hero_/, '')
        let name_l = hero.localized_name
        let bio = hero_infos[name]['bio']
        let atk = hero_infos[name]['atk']
        let atk_l = hero_infos[name]['atk_l']
        let roles = hero_infos[name]['roles'].join(',')
        let roles_l = hero_infos[name]['roles_l'].join(',')
        let main_attr = heroAttr(hero_attrs[name]['pa'])
        let movespeed = hero_attrs[name]['attribs']['ms']
        let armor = hero_attrs[name]['attribs']['armor']
        let damage = hero_attrs[name]['attribs']['dmg']['min']+','+hero_attrs[name]['attribs']['dmg']['max']
        let strength = hero_attrs[name]['attribs']['str']['b']+','+hero_attrs[name]['attribs']['str']['g']
        let agility = hero_attrs[name]['attribs']['agi']['b']+','+hero_attrs[name]['attribs']['agi']['g']
        let intelligence = hero_attrs[name]['attribs']['int']['b']+','+hero_attrs[name]['attribs']['int']['g']
        Dhero.findOrCreate({
          where: {
            sid: sid
          },
          defaults: {
            sid: sid,
            name: name,
            name_l: name_l,
            bio: bio,
            atk: atk,
            atk_l: atk_l,
            roles: roles,
            roles_l: roles_l,
            avatar_sb: `${hero_base_url}${name}_sb.png`,
            avatar_full: `${hero_base_url}${name}_full.png`,
            avatar_vert: `${hero_base_url}${name}_vert.jpg`,
            main_attr: main_attr,
            movespeed: movespeed,
            armor: armor,
            damage: damage,
            strength: strength,
            agility: agility,
            intelligence: intelligence
          }
        }).spread(async (hero, created) => {
          if(created==false){
            await hero.update({
              name: name,
              name_l: name_l,
              bio: bio,
              atk: atk,
              atk_l: atk_l,
              roles: roles,
              roles_l: roles_l,
              avatar_sb: `${hero_base_url}${name}_sb.png`,
              avatar_full: `${hero_base_url}${name}_full.png`,
              avatar_vert: `${hero_base_url}${name}_vert.jpg`,
              main_attr: main_attr,
              movespeed: movespeed,
              armor: armor,
              damage: damage,
              strength: strength,
              agility: agility,
              intelligence: intelligence
            })
            console.log('更新：'+name_l)
          }else{
            console.log('创建：'+name_l)
          }
          count++
          if(count==sum){
            console.log('英雄信息同步完成！！！')
            process.exit()
          }
        })
      })
    }
  }catch(err){
    console.log(err)
    process.exit()
  }
}

function heroAttr(str){
  let new_str = ''
  switch(str){
    case 'str':
      new_str = 'strength,力量'
      break
    case 'agi':
      new_str = 'agility,敏捷'
      break
    case 'int':
      new_str = 'intelligence,智力'
      break
  }
  return new_str
}