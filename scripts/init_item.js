const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const superagent = require('superagent')
require('superagent-charset')(superagent)
const _ = require('lodash')
const model = require('../config/model')
const Ditem = model.Ditem

const list_url = `http://api.steampowered.com/IEconDOTA2_570/GetGameItems/v1?key=${process.env.STEAM_KEY}&language=zh`
const info_url = 'http://www.dota2.com/jsfeed/heropickerdata?l=schinese'

const item_base_url = 'http://cdn.dota2.com/apps/dota2/images/items/'

syncItems()

async function syncItems(){
  try{
    let list = await superagent.get(list_url)
    if(list.status == 200){
      let items = list.body.result.items
      let sum = items.length
      let count = 0
      _.forEach(items, function(item){
        let sid = item.id
        let name = item.name.replace(/item_/, '')
        let name_l = item.localized_name
        let cost = item.cost
        let secret_shop = item.secret_shop
        let side_shop = item.side_shop
        let recipe = item.recipe
        let img_lg = `${item_base_url}${name}_lg.png`
        Ditem.findOrCreate({
          where: {
            sid: sid
          },
          defaults: {
            sid: sid,
            name: name,
            name_l: name_l,
            cost: cost,
            secret_shop: secret_shop,
            side_shop: side_shop,
            recipe: recipe,
            img_lg: img_lg
          }
        }).spread(async (nitem, created) => {
          if(created==false){
            await nitem.update({
              name: name,
              name_l: name_l,
              cost: cost,
              secret_shop: secret_shop,
              side_shop: side_shop,
              recipe: recipe,
              img_lg: img_lg
            })
            console.log('更新：'+name_l)
          }else{
            console.log('创建：'+name_l)
          }
          count++
          if(count==sum){
            console.log('物品信息同步完成！！！')
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