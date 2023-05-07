const log4js = require('log4js');


/**
 * 日志系统
 */
function Sys_logs() {
    // 对 category 和 appenders 进行配置
    log4js.configure({
        replaceConsole: true,
        appenders: {
            console: { type: 'console' },
            cheese: {
                // 设置类型为 dateFile
                type: 'dateFile',
                // 配置文件名为 chat.log
                filename: 'logs/chatgpt.log',
                maxLogSize: 10 * 1024 * 1024, // 10mb,日志文件大小,超过该size则自动创建新的日志文件
                backups: 20,  // 仅保留最新的20个日志文件
                // compress: true, //  超过maxLogSize,压缩代码
                encoding: 'utf-8',// 指定编码格式为 utf-8
                layout: {// 配置 layout，此处使用自定义模式 pattern
                    type: "pattern",
                    pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
                },
                pattern: "yyyy-MM-dd",// 日志文件按日期（天）切割
                keepFileExt: true,// 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
                alwaysIncludePattern: true,// 输出的日志文件名是都始终包含 pattern 日期结尾
            },
        },
        categories: {
            // 设置默认的 categories
            default: { appenders: ['cheese','console'], level: 'debug' },
        }
    })

    global.logger = log4js.getLogger();
    global.logger.info("日志系统启动成功");
}
module.exports = Sys_logs();

// logger.debug('This is a debug message'); // 记录一条调试级别的日志
// logger.info('This is an info message'); // 记录一条信息级别的日志
// logger.warn('This is a warn message'); // 记录一条警告级别的日志
// logger.error('This is an error message'); // 记录一条错误级别的日志
// logger.fatal('This is a fatal message'); // 记录一条致命级别的日志
