const qiniu = require('qiniu')

const accessKey = process.env.QINIU_ACCESS
const secretKey = process.env.QINIU_SECRET

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

exports.uptoken = function(){
  let options = {
    scope: 'djpro',
    expires: 7200
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return uptoken = putPolicy.uploadToken(mac)
}