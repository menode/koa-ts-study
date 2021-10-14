import fs from 'fs';
import path from 'path';
import socketJwt from 'socketio-jwt'

function addControllers(router: any,io: any,dir:string){
    let files = fs.readdirSync(dir).filter((f: string)=> !f.endsWith('.d.ts'));
    console.log(files);
    for(let f of files){
        //检查controllers中的文件夹
        if(fs.lstatSync(dir + path.sep + f).isDirectory()){
            console.log('load dir %s', dir + path.sep + f);
            addControllers(router,io ,dir + path.sep + f);
        }else{
            console.log(`process controller: ${f}...`);
            //导入js文件
            let mapping = require(dir + path.sep + f);

            for(let x in mapping){
                let action = x.split(' ')

                let url = (dir + path.sep + f).replace(dir, '').replace('/IndexController.js', '').replace('Controller.js', '').toLowerCase()
                if (!action[1].startsWith('/')) {
                    url = url + '/' + action[1]  //不为绝对路径则自动生成路径 path/model/action
                } else {
                    url = action[1]
                }

                // 对 controller 模块逐一
                if (action[0] === 'GET') {
                    router.get(url, mapping[x])
                    console.info('process action URL %s %s', action[0], url)
                }
                else if (action[0] === 'POST') {
                    if (mapping[x] instanceof Array) {
                        router.post(url, ...mapping[x])
                    } else {
                        router.post(url, mapping[x])
                    }
                    console.info('process action URL %s %s', action[0], url)
                } else if (action[0] === 'WS') {
                    console.log(url);
                    let ws = io.of(url)

                    // socket jwt 验证
                    // ws.use(socketJwt.authorize({
                    //     secret: '903C62A1-E2D2-48C9-845B-C88640700621',
                    //     handshake: true,
                    //     auth_header_required: true,
                    //     onError: (err: any) => {
                    //         console.log(err)
                    //     }
                    // } as any))

                    ws.on('connection', mapping[x])
                    console.info('process action URL Websocket %s', url)
                };
            };
        };
    };
}

export default function (io:any ) {
    let
        rootdir :string = __dirname + path.sep + 'controllers', 
        router = require('koa-router')();
    addControllers(router,io ,rootdir );
    return router.routes();
};