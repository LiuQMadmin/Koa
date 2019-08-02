const Koa=require("koa")
const Route=require("koa-router")
const views = require('koa-views')
const path = require('path')
const app=new Koa()
const bodyParder=require("koa-bodyparser")
const static = require('koa-static')

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))
// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './public'
app.use(static(
  path.join( __dirname, staticPath)
))

app.use(bodyParder(
  {
    extendTypes: {
      text: ['text/xml']
    }
  }
))
const auth=require("./router")
const router=new Route()


router.use("/",auth.routes())

app.use(router.routes())

app.listen(4000, () => {
    console.log('localhost:4000')
  })