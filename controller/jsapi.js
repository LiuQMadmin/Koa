
const http=require("../utils/http");
const config=require("../config/weixin.config")
const tools=require("../utils/tools")
const querystring = require('querystring')
const db=require("../model/index")


async function getData() {
  //1、获取access_token
  let { appID, appsecret } = config
  let { access_token, expires_in:at_expires_in } = await http.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`)

  //2、获取jsapi_ticket
  let { ticket, expires_in:jt_expires_in } = await http.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`)

  return {
    access_token,
    jsapi_ticket: ticket,
    at_expires_in,
    jt_expires_in
  }
}

module.exports={
   async generata(ctx){
     let results=await db("select * from token",[])
    if(results.length>0){
      let createTime=results[0].at_expires_in
      let minusTime=new Date().getTime()-createTime
      if(minusTime<7100000){
        var {
          jsapi_ticket
        }=results[0]
      }else{
        var {access_token,jsapi_ticket}=await getData()
        // 更新数据库
        let result = await db('update token set access_token = ?, jsapi_ticket = ?, at_expires_in = ?, jt_expires_in = ? where id = 1', [
          access_token, jsapi_ticket, new Date().getTime(), new Date().getTime()
        ])
      }
    }else {
      var {
        access_token,
        jsapi_ticket
      } = await getData()
      // 插入数据
      let result = await db('insert into token set ?', {
        access_token,
        jsapi_ticket,
        at_expires_in: new Date().getTime(),
        jt_expires_in: new Date().getTime()
      })
    }
        //3、生成签名
        let noncestr = tools.noncestr()
        let timestamp = tools.timestamp()
        let string1Obj = {
            noncestr,
            jsapi_ticket,
            timestamp,
            url: config.url
        }
        // 排序以后的字符串
        let sortedString1Obj = Object.keys(string1Obj).sort().reduce((obj, key) => {
            obj[key] = string1Obj[key]
            return obj
          }, {})


          let string1 = querystring.stringify(sortedString1Obj, null, null, {
            encodeURIComponent(str) {
              return querystring.unescape(str)
            }
          })
          
          let signature = tools.sha1(string1)
          // 返回config信息
            ctx.body = {
                appId: config.appID,
                timestamp,
                nonceStr: noncestr,
                signature
            }
    }
}