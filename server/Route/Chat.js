const express = require('express');
const router = express.Router();
const chatbotController = require('../controller/Chat');
const {AuthToken} = require("../middleware/Auth")

router.post('/chat',AuthToken, chatbotController.ChatBot);

module.exports = router;