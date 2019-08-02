
const config=require("../config/weixin.config")
let getRawBody = require('raw-body')
let xmljs = require('xml-js')
module.exports={
    // getRawBody种的第一个参数为node.js的Sream
    // 此处要定义为ctx.req，而不是ctx.request
   async autoreply(ctx){
       let xml=await getRawBody(ctx.req,{
           length:ctx.req.headers["content-length"],
           limit:"1mb",
           encoding:true
       })
        // 将xml转化js
        let replyObject=xmljs.xml2js(xml,{
            compact:true,
            cdataKey:"value",
            textKey:"value"
        })
        // 归并，扁平化js对象
        let xmlObj=replyObject["xml"]
        let result=Object.keys(xmlObj).reduce((obj,key)=>{
            obj[key]=xmlObj[key]["value"]
            return obj
        },{})
        // 此处ToUserName，FromUserName要把拿到的数据，做个颠倒
        let data = {
        Content: '<a href="http://lqm.zlweb.cc/">test</a>',
        CreateTime: new Date().getTime(),
        ToUserName: result.FromUserName,
        FromUserName: result.ToUserName
      }
      await ctx.render("reply",data)
    }
}