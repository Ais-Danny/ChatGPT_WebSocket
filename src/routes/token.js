var express = require('express');
const router = express.Router();

const { token_creat } = require('../utils/tokenUtil')

router.ws('/creatToken', function (ws, req) {
    token_creat(ws, req)
})

module.exports = router