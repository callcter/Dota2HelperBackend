var express = require('express');
var router = express.Router();

router.get('/',function(res,res){
	res.send('this is user');
});

module.exports = router;