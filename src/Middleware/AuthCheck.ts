import { ResContext as Context } from "./response"
import { Next } from "koa"
// import AuthModel from "../Models/Permission_auth"

/* Partial<Auth> 模板 (同时也是默认权限, 更改菜单栏见 Middleware MenuCreator)*/
export const TemplateAuth: Partial<Auth> = {
    // 项目系统
    project: {
        basic: { // 基础设置
            summary: 2, // 项目概况
            duer: 2, // 小度音响设定
            miniapp: 2 // 小程序设置
        },
        roomList: { // 房间列表
            edit: 2, // 编辑房间
            setting: 2, // 房间设定
            gateway: 2, // 网关
            software: 2, // 网关软件
            test: 2 // 设备测试
        },
        loadRoom: false, // 导入房间
        gatewayManage: false,//网关管理
        equitTest: false,//设备测试
        commandLine: false, //命令行
        roomOverview: false, //房间概况
    },
    // 系统设置
    systemSet: {
        areaSet: false, // 地区设置
        proSet: false, // 项目设置
        roomSet: false, // 房间设置
        roleEdit: false, // 角色编辑
        accountManage: false // 账号管理
    },
    // 网关软件仓库
    repository: {
        viewSoftware: false, // 查看软件
        softwareUpload: false, // 软件上传
    },
    // 操作日志
    log: false,
    // 手机工具
    phone: {
        registerGateway: true, // 注册网关
        equitDep: true, //设备部署
        equitTest: true, // 设备测试
        testConfig: true, //管理测试配置
    }
}

export interface Auth {
    project: Partial<Project>
    systemSet: Partial<SystemSet>
    repository: Partial<Repository>
    log: boolean
    phone: Partial<Phone>
}

type Project = {
    basic: Partial<Basic>
    roomList: Partial<RoomList>
    loadRoom: boolean
    gatewayManage: boolean
    equitTest: boolean
    commandLine: boolean
    roomOverview: boolean
}

type Basic = {
    summary: 1 | 2
    duer: 1 | 2
    miniapp: 1 | 2
}

type RoomList = {
    edit: 1 | 2
    setting: 1 | 2
    gateway: 1 | 2
    software: 1 | 2
    test: 1 | 2
}

type SystemSet = {
    areaSet: boolean
    proSet: boolean
    roomSet: boolean
    roleEdit: boolean
    accountManage: boolean
}

type Repository = {
    viewSoftware: boolean
    softwareUpload: boolean
}

type Phone = {
    registerGateway: boolean
    equitDep: boolean
    equitTest: boolean
    testConfig: boolean
}

export class AuthError extends Error {
    private errors
    constructor(errors: string[]) {
        const message = errors
            .join(", ")
            .replace(/"/g, "")
        super(message)
        this.errors = errors
    }
}

export class AuthCheck {
    private authCall: Partial<Auth>
    private errors: string[]
    constructor(auth: Partial<Auth>) {
        this.authCall = auth
        this.errors = [] // 用来收集缺少的权限
    }

    /**
     * 权限中间件
     * @param authCall Auth 类型的对象(字段可选)
     */
    // public checkAuth(authCall: Partial<Auth>) {
    //     return async (ctx: Context, next: Next) => {
    //         const { id } = ctx.state.user
    //         if (!id) throw new AuthError(["userid"])
    //         const authList: Partial<Auth>[] = await AuthModel.getAuth(id)
    //         // 对每个职位进行检查，若不通过则记录缺失权限
    //         let record: string[] = []
    //         for (let authData of authList) {
    //             this.errors = [] // 清空以开始检查
    //             this.check(authData, authCall)
    //             if (!(this.errors.length)) break // 若 role 通过则直接 break -> await next()
    //             record.push.apply(record, this.errors) // 记录缺失权限
    //         }
    //         if ((this.errors.length) && record.length) { // 处理未 break 的情况下记录的缺失权限
    //             const num = authList.length
    //             record = record.filter((item, _, a) => a.filter(e => e === item).length === num) // 筛选出每个角色都缺失的权限
    //             if (record.length) throw new AuthError(record.filter((v, i, a) => a.indexOf(v) === i ))
    //         }
    //         await next()
    //     }
    // }

    private check(a: any, b: any): void {
        for (let i of Object.keys(b)) {
            if (i in a) {
                if (a[i] instanceof Object) {
                    this.check(a[i], b[i])
                } else if (a[i] === 1 || a[i] === 2) {
                    if (a[i] < b[i]) this.errors.push(i)
                } else {
                    if (a[i] !== b[i]) this.errors.push(i)
                }
            } else {
                // return false
                this.errors.push(i)
            }
        }
    }

    /**
     * 对传入的权限对象进行检查
     * @param struct 待检查的权限结构体对象
     * @param source (一般不填)模板权限结构体
     */
    static structCheck(struct: any, source: any = TemplateAuth): boolean {

        let result = true
        if (!(struct instanceof Object)) {
            return true // validate 中间件需保证 struct 是 object，这里只处理递归参数
        }
        for (let i of Object.keys(struct)) {
            if (i in source) {
                result = this.structCheck(struct[i], source[i]) // 若 struct 的键符合给定的模板结构则进行递归检查
                if (!result) return false
            } else {
                return false // 不符合
            }
        }
        return result

    }

    /**
     * 根据传入的权限对象更新已有权限对象
     * @param source 待更新权限
     * @param update 更新权限
     */
    static structUpdate(source: any, update: any): boolean {
        for (let i of Object.keys(update)) {
            if (i in source) {
                if (update[i] === null) { // 若更新对象为 null 则删除原字段
                    delete source[i]
                    continue
                } else if (source[i] instanceof Object) {
                    this.structUpdate(source[i], update[i])
                } else { // 若原对象不为对象
                    source[i] = update[i]
                }
            } else if (update[i] !== null) { // 若字段不存在则更新对象不为 null 才进行更新
                source[i] = update[i]
            }

        }
        return true
    }

    /**
     * 根据获得的权限对象列表生成菜单
     * @param authList 权限对象列表
     */
    // static menuCreater(authList: Partial<Auth>[]): any[] {

    //     return []
    // }
}

const defaultAuthCheck = new AuthCheck({})

// export default defaultAuthCheck.checkAuth.bind(defaultAuthCheck)
