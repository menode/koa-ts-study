import { Context } from "koa";
import  fs  from "fs";
import  path  from "path";

let fn_index = async (ctx: Context, next:any) => {
    ctx.response.type = 'html';
    
    let l = path.join(__dirname, '../view/index.html');
    ctx.response.body = fs.createReadStream(l );
    // ctx.response.body = `<h1>Index</h1>
    //     <form action="/signin" method="post">
    //         <p>Name: <input name="name" value="koa"></p>
    //         <p>Password: <input name="password" type="password"></p>
    //         <p><input type="submit" value="Submit"></p>
    //     </form>`;
};

let fn_signin = async (ctx: Context, next:any) => {
    let
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
};

module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin
};