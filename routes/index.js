var express = require('express');
var router = express.Router();
var fs = require('fs');
var qiniu = require('qiniu');

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 10,
	host: '127.0.0.1',
	user: 'root',
	password: '%CmX0#cCdHSmR8Qs',
	// password: '',
	database: 'dreamser',
	port: '3124'
	// port: '3306'
});

qiniu.conf.ACCESS_KEY = 'SBzLHQJp-FAJvYry1AwZ3AnjEkc2jFZAm659boek';
qiniu.conf.SECRET_KEY = 'argH4ZC-iVmdiL1fVFEgRo6Kt8J85ATnl166gMNn';

router.get('/',function(req,res){
	res.sendfile('views/index.html');
});

router.get('/edit',function(req,res){
	res.sendfile('views/edit.html');
})

router.post('/release',function(req,res){
	console.log(req.body);
	var val = '(null,"'+req.body.title+'","'+req.body.date+'","'+req.body.content+'","'+req.body.source+'","'+req.body.backUrl+'");';
	pool.query('INSERT INTO `ds_dotaarticle` (`id`, `title`, `date`, `content`, `source`, `background`) VALUES '+val,function(err,rows){
		var result = new Object();
		if(err){
			result.result = err;
			console.log(err);
		}else{
			result.result = 'success';
		}
		res.send(result);
	});
})

router.get('/article/:id',function(req,res){
	pool.query('select * from `ds_dotaarticle` where id = '+req.params.id,function(err,rows){
		if(err){
			res.render('article',{error: err});
		}else{
			var article = rows[0];
			res.render('article',{
				title: article.title,
				date: timeFormat(article.date,'date'),
				content: article.content,
				source: article.source,
				background: article.background
			});
		}
	})
	// res.render('article');
})

router.get('/uptoken',function(req,res){
	var putPolicy = new qiniu.rs.PutPolicy('reactnativetest');
	res.send({uptoken:putPolicy.token()});
})

module.exports = router;

function timeFormat(date,type){
	switch(type){
		case 'date':
			Y = date.getFullYear() + '-';
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate();
			return Y+M+D;
			break;
		case 'datetime':
			Y = date.getFullYear() + '-';
		  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		  D = date.getDate();
		  h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		  m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		  s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
			return Y+M+D+' '+h+m+s;
			break;
		case 'time':
			h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
		  m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
		  s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
			return h+m+s;
			break;
	}
}