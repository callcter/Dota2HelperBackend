var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
	res.send('This is DOTA!');
});

module.exports = router;
