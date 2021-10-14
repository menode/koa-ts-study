let config = {
    port: process.env.AUTH_SERVER_PORT || 3500,
    host: process.env.SERVER_HOST || '0.0.0.0',
    cross: process.env.CROSS_HOST || 'http://127.0.0.1:3500',
    apiKey: process.env.API_KEY || '903C62A1-E2D2-48C9-845B-C88640700621',
    redis: {
        url: process.env.REDIS_URL || 'redis://10.50.1.115:6379',
        key: process.env.REDIS_KEY || 'Booming:RCU:BOT-backend:'
    },
    wechat: {
        appid: process.env.WECHAT_APPID || 'wx748fbfb37d7342fd',
        appsec: process.env.WECHAT_APPSEC || 'eb1c1cc73f1f1f67e5a4130e1c08c274'
    },
    mariadb: {
        host: process.env.MARIA_HOST || '10.50.1.115',
        port: process.env.MARIA_PORT || 3306,
        username: process.env.MARIA_USER || 'root',
        password: process.env.MARIA_PWD || 'root',
        database: process.env.MARIA_DB || 'bot'
    },
    mqtt: {
        url: process.env.MQTT_URL || 'mqtt://10.50.1.115:1883',
        username: process.env.MQTT_USERNAME || 'admin',
        password: process.env.MQTT_PASSWORD || 'public'
    },
    log: {
        path: __dirname + '/../',
        filelevel: process.env.LOG_FILE_LEV || 'debug',
        stdlevel: process.env.LOG_STD_LEV || 'debug'
    },
    ttLock: {
        CLIENT_ID: process.env.TTLOCK_ID || '485245468d4c411ba3f8df88495b9beb',
        CLIENT_SECRET: process.env.TTLOCK_SECRET || 'b1cf0b37c55c2fc24602976f272c8f56',
    },
}
module.exports = config
export default config