const jwt = require('jsonwebtoken');
const Result=require('../entity/result')
const axios=require('axios')

function token_check(wsConnect, req) {
    let token = req.headers['authorization']
    let clientIP = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
    try {
        let result = jwt.verify(token, global.config.private_key)
        console.log('验证结果', result);
        return true;
    } catch (e) {
        wsConnect.send(new Result("校验失败,禁止访问", 403, false));
        global.logger.warn(" 403,未授权的请求, ip :" + clientIP + ",Authorization:" + req.headers['authorization']);
        wsConnect.close();
        return false;
    }
}

async function token_creat(ws, req) {
    let code = req.headers['js_code']
    let clientIP = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
    if (req.headers['js_code'] == null) {
        global.logger.warn(` 403,无效code,禁止生成token, ip: ${clientIP}`)
        ws.send(JSON.stringify(new Result(`无效code:${req.headers['js_code']},禁止生成token`, 403, false)))
        ws.close();
        return
    }
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${global.config.appId}&secret=${global.config.appSecret}&js_code=${code}&grant_type=authorization_code`
    let result = await axios.get(url)
    const userinfo = result.data
    if (userinfo.session_key != null && userinfo.openid != null) {//判断code是否有效
        const token = jwt.sign({ userinfo }, global.config.private_key, { expiresIn: global.config.token_live_time })
        ws.send(JSON.stringify(new Result(token)))
        global.logger.warn(`生成新token, ip: ${clientIP} ,openid: ${userinfo.openid}`)
        ws.close()
    } else {
        global.logger.warn(` 403,无效code,禁止生成token, ip: ${clientIP}`)
        ws.send(JSON.stringify(new Result(`无效code:${req.headers['js_code']},禁止生成token`, 403, false)))
        ws.close();
    }
}

module.exports = {
    token_check,
    token_creat
}