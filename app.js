var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var apis = require('./routes/apis');

var app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(favicon(path.join(__dirname+'/public/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname,'public')));

app.use('/',routes);
app.use('/users',users);
app.use('/apis',apis);

//上传时修改端口号为3000
app.listen(3000);
