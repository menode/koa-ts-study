import Koa from 'koa';
import cors from 'koa2-cors';
import Koaroute from 'koa-router';
import bodyParser from 'koa-body';
import Koastatic from 'koa-static';
import path from 'path';
import http from 'http';
import controller from './controllers';
import { AuthError } from './Middleware/AuthCheck'

const { ValidationError } = require("koa2-validation");

const app = new Koa();
app.proxy = true;
const router = new Koaroute();


//创建 websocket 服务
const server = http.createServer(app.callback());
const io = require('socket.io')(server,{ cors: true })

//允许跨域
app.use(cors({credentials: true}))

const staticPath = '../public'
app.use(Koastatic(
    path.join( __dirname,  staticPath)
))



app.use(bodyParser({
    multipart: true,//支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, 'temp/upload'),
        keepExtensions: true,//保持文件后缀
        maxFileSize: 40*1024, //文件上传大小
        onFileBegin: (name: any, file: any) => { // 文件上传前的设置
            console.log(`name: ${name}`);
            console.log(file);
        },
        onError: (error: any, context: any) => {
            console.log(error)
        }
    } as any
}));


//检索controllers中的接口
app.use(controller(io))
//使用路由
app.use(router.routes());

const port: number = 3000;



server.listen(process.env.PORT || port, () => {
    console.log(`app run at : http://127.0.0.1:${port}`)
});

