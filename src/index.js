const express = require('express');
const expressWs  = require('express-ws');
const https = require('https');
const fs = require('fs');
require('./utils/logs')

const app = express();


const options = {
    ca: fs.readFileSync('ssl/ca_bundle.crt'),
    cert: fs.readFileSync('ssl/certificate.pem'),
    key: fs.readFileSync('ssl/private.key')
};

fs.readFile('config.json', 'utf8', (err, data) => {  // 加载环境变量
    if (err) {
        global.logger.error(err)
        throw err
    };
    global.config = JSON.parse(data);
    init()
});

function init() {
    route_init()
}

function route_init() {
    
    // 获取到所有的客户端连接池
    const wss = expressWs (app).getWss('/');
    app.use('/api/login',require('./routes/token'));
    app.use('/api/v1',require('./routes/chat'))
    const httpsServer = https.createServer(options, app); // 创建 HTTPS 服务器
    
    httpsServer.listen(global.config.port, () => {  // 用 HTTPS 服务器监听指定端口
        global.logger.info("WebSocketServer启动成功")
    });
    expressWs (app,httpsServer);
}