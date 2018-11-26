function encode_steamid(id){
  let num = 1197960265728+parseInt(id)
  return '7656'+num
}

function decode_steamid(id){
  return parseInt(id.substring(4))-1197960265728
}

module.exports = { encode_steamid, decode_steamid }