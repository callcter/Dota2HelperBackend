const express = require('express')
const router = express.Router()
const superagent = require('superagent')
require('superagent-charset')(superagent)
const _ = require('lodash')

const { encode_steamid, decode_steamid } = require('../../utils/dota')

const model = require('../../config/model')
const Dmatch = model.Dmatch
const Dhero = model.Dhero
const Ditem = model.Ditem
const Dability = model.Dability
const Duser = model.Duser

const list_url = `http://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1?key=${process.env.STEAM_KEY}&account_id=`
const base_url = `http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1?key=${process.env.STEAM_KEY}&match_id=`
const user_url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=`

// {account_id}&matches_requested={limit}&start_at_match_id={offset}

router.get('/test', (req, res) => {
  res.json({
    code: 500
  })
})

router.get('/list', async(req, res) => {
  try {
    console.log(req.query)
    let account_id = req.query.account_id
    let matches_requested = req.query.matches_requested ? `&matches_requested=${req.query.matches_requested}` : '&matches_requested=10'
    let start_at_match_id = req.query.start_at_match_id ? `&start_at_match_id=${req.query.start_at_match_id}` : ''
    let result = await superagent.get(`${list_url}${account_id}${matches_requested}${start_at_match_id}`)
    if(result.status==200){
      const heroes = await Dhero.findAll({attributes: ['sid', 'name_l', 'avatar_sb']})
      let matches = result.body['result']['matches']
      let new_matches = [].concat(matches)
      for(let i=0;i<matches.length;i++){
        let idx = _.findIndex(matches[i]['players'], function(player){
          return player['account_id'] == account_id
        })
        new_matches[i]['hero'] = findItem(heroes, matches[i]['players'][idx]['hero_id'])
      }
      res.json({
        code: 200,
        data: new_matches
      })
    }else{
      res.json({
        code: 500,
        msg: 'G胖带着小姨子跑路了'
      })
    }
  } catch(err) {
    res.json({
      code: 500,
      msg: '运行出错：'+err
    })
  }
})

router.get('/', async(req, res) => {
  try {
    let match_id = req.query.match_id
    let match = await Dmatch.findOne({
      where: {
        match_id: match_id
      }
    })
    if(match){
      res.json({
        code: 200,
        data: await matchFormat(match.data)
      })
    }else{
      let result = await superagent.get(base_url+match_id)
      if(result.status==200){
        let match = await Dmatch.create({
          match_id: match_id,
          data: result.body
        })
        if(match){
          res.json({
            code: 200,
            data: await matchFormat(result.body),
            msg: '请求成功'
          })
        }else{
          res.json({
            code: 200,
            data: await matchFormat(result.body),
            msg: '请求成功，但是没缓存'
          })
        }
      }else{
        res.json({
          code: 500,
          msg: 'G 胖带着小姨子跑路了！！！'
        })
      }
    }
  } catch(err) {
    res.json({
      code: 500,
      msg: '运行出错：'+err
    })
  }
})

async function matchFormat(data){
  const heroes = await Dhero.findAll({attributes: ['sid', 'name_l', 'avatar_sb']})
  const abilities = await Dability.findAll({attributes: ['sid', 'name_l', 'img_url']})
  const items = await Ditem.findAll({attributes: ['sid', 'img_lg']})
  let new_data = Object.assign({}, data['result'])
  let players = data['result']['players']
  let accounts = []
  for(let i = 0;i<players.length;i++){
    accounts.push(encode_steamid(players[i]['account_id']))
    new_data['players'][i]['hero'] = findItem(heroes, players[i]['hero_id'])
    new_data['players'][i]['item_0'] = findItem(items, players[i]['item_0'])
    new_data['players'][i]['item_1'] = findItem(items, players[i]['item_1'])
    new_data['players'][i]['item_2'] = findItem(items, players[i]['item_2'])
    new_data['players'][i]['item_3'] = findItem(items, players[i]['item_3'])
    new_data['players'][i]['item_4'] = findItem(items, players[i]['item_4'])
    new_data['players'][i]['item_5'] = findItem(items, players[i]['item_5'])
    new_data['players'][i]['backpack_0'] = findItem(items, players[i]['backpack_0'])
    new_data['players'][i]['backpack_1'] = findItem(items, players[i]['backpack_1'])
    new_data['players'][i]['backpack_2'] = findItem(items, players[i]['backpack_2'])
    let ability_upgrades = players[i]['ability_upgrades']
    new_data['players'][i]['abilities'] = []
    for(let j=0;j<ability_upgrades.length;j++){
      let temp = findItem(abilities, ability_upgrades[j]['ability'])
      new_data['players'][i]['abilities'].push({
        sid: temp['sid'],
        name_l: temp['name_l'],
        img_url: temp['img_url'],
        level: levelFormat(ability_upgrades[j]['level'])
      })
    }
  }
  let user_result = await superagent.get(user_url+accounts.join(','))
  // 用户可能不公开比赛数据
  let nullplayer = {personaname:'不明群众',avatar:'http://oalqimdk5.bkt.clouddn.com/1609165315339.jpg'}
  if(user_result.status==200){
    let steam_accounts = user_result.body['response']['players']
    for(let i = 0;i<players.length;i++){
      if(players[i]['account_id']==4294967295){
        new_data['players'][i]['account'] = nullplayer
      }else{
        let idx = _.findIndex(steam_accounts, function(account){
          return decode_steamid(account['steamid']) == players[i]['account_id']
        })
        new_data['players'][i]['account'] = steam_accounts[idx]
      }
    }
  }else{
    res.json({
      code: 500,
      msg: '用户信息拿不到呀怎么办'
    })
    return false
  }
  return new_data
}

function levelFormat(num){
  switch(num){
    case 17:
      return 18
    case 18:
      return 20
    case 19:
      return 25
    default:
      return num
  }
}

function findItem(arr, sid){
  let idx = _.findIndex(arr, function(ar){
    return sid == ar['sid']
  })
  return arr[idx]
}

module.exports = router