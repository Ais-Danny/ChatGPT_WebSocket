

const axios = require('axios');
const proxy = global.config.proxy // 请求负载均衡主机


function sendChatGPT(ws, req) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization']
    }
    const data = JSON.parse(req.headers['body'])
    var requestOptions = {
        method: 'POST',
        headers: headers,
        responseType: 'stream'
    }
    const url = proxy + "/api/v1/chat"
    axios.post(url, data, requestOptions).then(response => {
        response.data.on('data', chunk => {
            // console.log(chunk.toString());
            ws.send(chunk.toString())
        }).on('end', () => {
            //读流操作完成，结束流
            ws.close()
        });
    }).catch(function (error) {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('Closing WebSocket connection');
            ws.close();
        }
        return global.logger.error(error)
    });
}

module.exports = sendChatGPT