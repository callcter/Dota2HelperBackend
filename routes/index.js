var Dota2api = require('dota2api');
var dota = new Dota2api('5276D16C651DB0FF86E7E612A3782F45');
var bodyParser = require('body-parser');

module.exports = function(app){
	app.use(bodyParser.json());
	app.get('/',function(req,res){
		res.send('hi');
	});
	app.get('/match',function(req,res){
		var _res = res;
		dota.getMatchDetails('2631592102',function(err,res){
			_res.send(res);
		});
	});
	app.post('/matchp',function(req,res){
		//res.json(req.body);
		var _res = res;
		dota.getMatchDetails(req.body.match_id,function(err,res){
			_res.send(res);
		});
	});
}
