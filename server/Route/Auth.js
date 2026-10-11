const Auth= require("../controller/Auth")
// please find more infro about this
const express = require('express')
const router = express.Router();
const {AuthToken} = require("../middleware/Auth")

router.post('/login', Auth.Login );
router.post('/register', Auth.Regis );
module.exports = router;