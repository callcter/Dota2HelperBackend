var Dota2api = require('../modules/dota2api.js');
var key = '5276D16C651DB0FF86E7E612A3782F45';
var dota = new Dota2api(key);
var bodyParser = require('body-parser');
var async = require('async');
var request = require('request');

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit: 10,
	host: '127.0.0.1',
	user: 'root',
	password: '%CmX0#cCdHSmR8Qs',
	database: 'dreamser',
	port: '3124'
});

module.exports = function(app){
	app.use(bodyParser.json());
	app.get('/',function(req,res){
		res.send('This is DOTA!');
	});
	app.get('/match',function(req,res){
		var _res = res;
		dota.getMatchDetails('2635238276',function(err,res){
			_res.send(res);
		});
	});
	app.get('/matchByHero',function(req,res){
		var _res = res;
		dota.getByHeroID(1,function(err,res){
			_res.send(res);
		});
	});
	app.get('/heroes',function(req,res){
		var _res = res;
		dota.getHeroes(function(err,res){
			_res.send(res);
		});
	});
	app.get('/items',function(req,res){
		var _res = res;
		dota.getItems(function(req,res){
			_res.send(res);
		});
	});
	app.post('/matchlist',function(req,res){
		var _res = res;
		dota.getMatchHistory({
			account_id: req.body.account_id,
			matches_requested: req.body.limit,
			start_at_match_id: req.body.offset
		},function(err,res){
			if(err){
				_res.send(err);
			}else{
				async.each(res.matches,function(item,callback){
					var hid = 0;
					for(var i=0;i<item.players.length;i++){
						if(item.players[i].account_id===req.body.account_id){
							hid = item.players[i].hero_id;
							break;
						}
					}
					pool.query('select * from ds_dotaheroes where serial_number = '+hid,function(err,rows){
						if(err){
							_res.send(err);
						}else{
							item.hero = rows[0];
							callback(err);
						}
					});
				},function(err){
					var result = new Object();
					if(err){
						result.result = false;
						result.error = err;
						_res.send(result);
					}else{
						result.result = true;
						result.data = res;
						_res.send(result);
					}
				});
				//_res.send(res);
			}
		});
	});
	app.post('/matchbyid',function(req,res){
		var _res = res;
		dota.getMatchDetails(req.body.match_id,function(err,res){
			var sql_h = '(';
			var field_h = '(serial_number,'
			for(var i=0;i<res.players.length;i++){
				sql_h += '"'+res.players[i].hero_id+'"';
				field_h += '"'+res.players[i].hero_id+'"';
				if(i<res.players.length-1){
					sql_h += ',';
					field_h += ',';
				}else{
					sql_h += ')';
					field_h += ')';
				}
			}
			pool.query('select * from ds_dotaheroes where serial_number in '+sql_h+' order by field'+field_h,function(err,rows){
				if(err){
					err.from = "hero_sql";
					_res.send(err);
				}else{
					for(var i=0;i<res.players.length;i++){
						res.players[i].hero = rows[i];
					}
					var sql = '';
					var sql_a = 'select * from ds_dotaitems where serial_number=';
					var sql_b = ' union all select * from ds_dotaitems where serial_number=';
					for(var k=0;k<res.players.length;k++){
						sql += sql_a+res.players[k].item_0+sql_b+res.players[k].item_1+sql_b+res.players[k].item_2+sql_b+res.players[k].item_3+sql_b+res.players[k].item_4+sql_b+res.players[k].item_5;
						if(k<res.players.length-1){
							sql += ' union all ';
						}
					}
					pool.query(sql,function(err,rows){
						for(var j=0;j<res.players.length;j++){
							var arr = rows.slice(j*6,j*6+6);
							res.players[j].items = arr;
						}
						if(err){
							err.from = "item_sql";
							_res.send(err);
						}else{
							var sql_array = new Array();
							for(var j=0;j<res.players.length;j++){
								var sql_x = '';
								var sql_y = 'select * from ds_dotaabilities where serial_number=';
								for(var k=0;k<res.players[j].ability_upgrades.length;k++){
									sql_x += sql_y+res.players[j].ability_upgrades[k].ability;
									if(k<res.players[j].ability_upgrades.length-1){
										sql_x += ' union all ';
									}
								}
								sql_array.push(sql_x);
							}
							var result_array = new Array();
							async.each(sql_array,function(item,callback){
								pool.query(item,function(err,rows){
									result_array.push(rows);
									callback(err);
								});
							},function(err){
								if(err){
									_res.send(err);
								}else{
									for(var i=0;i<res.players.length;i++){
										for(var j=0;j<result_array.length;j++){
											if(res.players[i].hero_id===result_array[j][0].hero_id){
												res.players[i].ability = result_array[j];
												break;
											}
										}
									}
									var nullplayer = {personaname:'不明群众',avatar:'http://oalqimdk5.bkt.clouddn.com/1609165315339.jpg'};
									async.each(res.players,function(item,callback){
										var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+key+'&steamids=7656'+getSteamid(item.account_id);
										request(url,function(err,res_steam,body){
											if(!err&&res_steam.statusCode===200){
												var res_steam = JSON.parse(body);
												if(res_steam.response.players.length===0){
													item.playerinfo = nullplayer;
												}else{
													item.playerinfo = res_steam.response.players[0];
												}
												callback(err);
											}
										});
									},function(err){
										if(err){
											_res.send(err);
										}else{
											_res.send(res);
										}
									});
								}
							});
						}
					});
				}
			});
		});
	});
	app.post('/listofaccount',function(req,res){
		var _res = res;
		var url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+key+'&steamids=7656'+getSteamid(req.body.steam_id);
		request(url,function(err,res,body){
			if(!err && res.statusCode===200){
				var res = JSON.parse(body);
				_res.send(res);
			}else{
				_res.send(err);
			}
		});
	});
	app.get('/heroes_db',function(req,res){
		pool.query('select * from ds_dotaheroes',function(err,rows){
			if(err){
				res.send(err);
			}else{
				res.send(rows);
			}
		});
	});
	app.get('/items_db',function(req,res){
		pool.query('select * from ds_dotaitems',function(err,rows){
			if(err){
				res.send(err);
			}else{
				res.send(rows);
			}
		});
	});
	app.get('/abilities_db',function(req,res){
		pool.query('select * from ds_dotaabilities',function(err,rows){
			if(err){
				res.send(err);
			}else{
				res.send(rows);
			}
		});
	});
}
function getSteamid(id){
	return 1197960265728+id;
}
