var express = require('express');
const router = express.Router();

const { token_check } = require('../utils/tokenUtil');
const Result = require('../entity/result');
const sendChatGPT = require('../utils/sendChatGPT');

router.ws('/chat', function (ws, req) {

    if ( token_check(ws, req)) {
        sendChatGPT(ws, req)
    } else {
        ws.send(JSON.stringify(new Result('token error!', 403, false)))
        ws.close()
    }

})

module.exports = router