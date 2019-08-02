
// 需要安装一下yarn add randomstring
const randomstring = require('randomstring')
const crypto = require('crypto')


// 生成一个noncestr随机串32位
exports.noncestr = () => {
  return randomstring.generate(32)
}
// 生成一个时间戳
exports.timestamp = () => {
  return Math.floor(new Date().getTime() / 1000)
}
// 
exports.sha1 = (str) => {
  return crypto.createHash('sha1').update(str).digest('hex')
}