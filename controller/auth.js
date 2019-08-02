
const config=require("../config/weixin.config")
const crypto = require('crypto')

module.exports={
    auth(ctx){
        let{
            signature,
            echostr,
            timestamp,
            nonce
        }=ctx.query
        // 这里对这三个里面的字符串变量进行拼接排序
        let ordereStr=[config.token,timestamp,nonce].sort().join("")
        // 再使用sha1进行加密算法，算出来一个结果
        let mySignature = crypto.createHash('sha1').update(ordereStr).digest('hex')
        // 如果结果能和signature的结果相同，那就返回请求体中echostr
        if(mySignature===signature){
            ctx.body=echostr
        }else{
            ctx.body=""
        }
    }
}