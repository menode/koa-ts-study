import log4js from 'log4js'
// import log4ex from 'log4js-extend'
import AuthConfig from './Config/config'
log4js.configure({
    appenders: {
        stdo: { type: 'stdout', layout: { type: 'coloured' } },
        logfile: { type: "dateFile", pattern: "yyyy-MM-dd.log", filename: AuthConfig.log.path + "/log/info", encoding: "utf-8", alwaysIncludePattern: true },
        errorlog: { type: "dateFile", pattern: "yyyy-MM-dd.log", filename: AuthConfig.log.path + "/log/error/err", encoding: "utf-8", alwaysIncludePattern: true },
        error: { type: 'logLevelFilter', appender: 'errorlog', level: 'error' },
        log: { type: 'logLevelFilter', appender: 'logfile', level: AuthConfig.log.filelevel },
        std: { type: 'logLevelFilter', appender: 'stdo', level: AuthConfig.log.stdlevel }
    },
    categories: {
        default: { appenders: ['std'], level: 'all' },
        WCB: { appenders: ['std', 'log', 'error'], level: 'all' },
        controller: { appenders: ['std', 'log', 'error'], level: 'all' },
        model: { appenders: ['std', 'log', 'error'], level: 'all' },
        logic: { appenders: ['std', 'log', 'error'], level: 'all' },
        SDK: { appenders: ['std', 'log', 'error'], level: 'all' }
    }
})
// log4ex(log4js, {
//     path: __dirname,
//     format: "(@file:@line:@column)"
//     })

type LogKey = 'SDK' | 'logic' | 'controller' | 'model'
type Log = log4js.Logger & Record<LogKey, log4js.Logger>

let logger: Partial<Log> = log4js.getLogger('WCB')
logger.SDK = log4js.getLogger('SDK')
logger.logic = log4js.getLogger('logic')
logger.controller = log4js.getLogger('controller')
logger.model = log4js.getLogger('model')

module.exports = logger as Log
export default logger as Log