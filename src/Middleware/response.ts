import { Context, Next } from "koa"

type Ok = {
    [key: string]: any
}

type ErrStatus = 200 | 400 | 401 | 403 | 500

export default function () {
    return async (ctx: Context, next: Next) => {
        ctx.success = (data?: Ok) => {
            ctx.status = 200
            ctx.body = data ? JSON.stringify({
                success: true,
                [Object.keys(data)[0]]: Object.values(data)[0] || null // 改
            }) : JSON.stringify({ success: true })
        }

        ctx.fail = (status: ErrStatus = 500, errmsg?: string) => {
            if (!errmsg) {
                switch (status) {
                    case 200: {
                        errmsg = "AppError"
                        break
                    }
                    case 400: {
                        errmsg = 'bad resquest'
                        break
                    }
                    case 401: {
                        errmsg = "Protected resource, use Authorization header to get access\n"
                        break
                    }
                    case 403: {
                        errmsg = "Forbidden"
                        break
                    }
                    case 500: {
                        errmsg = "服务器异常，请检查日志"
                        break
                    }
                    default: {
                        errmsg = "服务器异常，请检查日志"
                        break
                    }
                }
            }
            ctx.status = status
            ctx.body = JSON.stringify({
                success: false,
                errmsg
            })
        }


        await next()
    }
}

export interface ResContext extends Context  {
    /**
     * @param data 返回数据 { key: value }
     */
    success: (data?: { [key: string]: any }) => void
    /**
     * @param status 状态码 200 AppError| 400 bad request| 401 protected resource| 403 forbidden| 500 服务器异常(默认)
     * @param errmsg 具体错误信息
     */
    fail: (status?: ErrStatus , errmsg?: string) => void
}
