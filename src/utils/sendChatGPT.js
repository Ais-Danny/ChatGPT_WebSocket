

const axios = require('axios');
const Result = require('../entity/result');
const proxy = global.config.proxy // 请求负载均衡主机
const url = proxy + "/api/v1/chat"


function sendChatGPT(ws, req) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': req.headers['authorization']
    }

    var requestOptions = {
        method: 'POST',
        headers: headers,
        responseType: 'stream'
    }


    //废弃方案(使用请求头传递问题请求体)
    // const data = JSON.parse(req.headers['body']) 
    // axios.post(url, data, requestOptions).then(response => {
    //     response.data.on('data', chunk => {
    //         ws.send(chunk.toString())
    //     }).on('end', () => {
    //         //读流操作完成，结束流
    //         ws.close()
    //     });
    // }).catch(function (error) {
    //     if (ws.readyState === WebSocket.OPEN) {
    //         console.log('Closing WebSocket connection');
    //         ws.close();
    //     }
    //     return global.logger.error(error)
    // });

    ws.on('message', (data) => {
        try {
            var body
            try{
                body=JSON.parse(data.toString())
            }catch(e){
                ws.send(JSON.stringify(new Result("发送格式错误的消息!!!",400,false)))
                return
            }
            axios.post(url, body, requestOptions).then(response => {
                response.data.on('data', chunk => {
                    ws.send(chunk.toString())
                }).on('end', () => {
                    ws.send('[DONE]')//发送标识，告诉客户端响应完毕
                    //读流操作完成，结束流
                    // ws.close()
                });
            }).catch(function (error) {
                if (ws.readyState === WebSocket.OPEN) {
                    console.log('与openai通信异常!!!');
                    ws.close();
                }
                return global.logger.error(error)
            });
        } catch (e) {
            global.logger.error(e)
        }
    })
}

module.exports = sendChatGPT