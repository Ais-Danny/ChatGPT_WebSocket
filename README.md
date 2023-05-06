# <b>ChatGPT_API</b>

## <b>简介</b>
<font color = #00FFFF size=4 >此仓库应与仓库<a>https://github.com/Ais-Danny/ChatGPT_API</a>配合使用</font>
### <b>WebSocket接口</b>
- <b>/api/login/creatToken</b><br>
创建token, 在请求头中填入"js_code"参数,此参数由下面代码产生
```javascript
  wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          console.log(res.code)
        } else {
          // console.log('登录失败！' + res.errMsg)
        }
      }
    })
```
    
返回数据格式,取出data作为请求下一个接口/api/v1/chat的请求头
```json
{
    "code": 200,
    "success": true,
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6eyJzZXNzaW9uX2tleSI6IkVaTXZiVTc5TU42RXMxZldCQTVNSGc9PSIsIm9wZW5pZCI6Im9rQmM3NHhKM1g2MGRUX3BJbU1NOHZhV1R0NWcifSwiaWF0IjoxNjgyOTE1NDEzLCJleHAiOjE2ODI5MTcyMTN9.cARM2BU1tcVqtCHqgo9SEOQ7TnFDqH1KiSdH00rsr78"
}
```

- <b> /api/v1/chat</b><br>
使用上一个接口产生的token作为请求头"authorization"的值
<br><br>
请求头(下面消息应封装在wss连接请求头<mark>"body"</mark>中,还有请求头<mark>"authorization"</mark>)
```json
{
    "messages": [
        {
            "role": "user",
            "content": "hi"
        },
        {
            "role":"assistant",
            "content":"你好，有什么可以帮助你的吗？"
        },
        {
            "role": "user",
            "content": "你是谁"
        }
    ]
}
```
### <b>配置步骤
1. 拉取项目</b>

```shell
git clone https://github.com/Ais-Danny/ChatGPT_WebSocket.git
```
2. <b> 进入目录下载依赖</b>
```shell
npm i
```
3. <b>修改配置文件</b><br>
appId，appSecret查阅微信开发者平台获取
```json
{
    "文件名必须修改为config.json才能生效":"",
    "port":443,
    
    "private_key":"token密钥",

    "token_live_time":"30min",

    "proxy":"负载均衡主机ip或域名",

    "appId": "必填",
    "appSecret": "必填"
}
```
4. <b>启动项目</b>
```shell
npm run start
```

## <b>附录</b>

<b>因启动https加密，需要在scr/ssl中添加ca_bundle.crt,certificate.pem,private.key证书(命名必需一样)</b>