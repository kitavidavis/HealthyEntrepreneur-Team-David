var express = require('express');
var router = express.Router();

router.post('/login', function(req, res){
    return res.status(200);
});

module.exports = router;