
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');

var ipinfo=fs.readFileSync(__dirname+'/public/webconfig.json');
var ip = JSON.parse(ipinfo);
//启动数据服务
var app = express();
app.set('port', ip.dataport); //设置端口号
app.set('views', path.join(__dirname, 'views'));//设置视图文件夹
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源文件夹
app.use(app.router);//设置路由
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/map', routes.map);
app.get('/', routes.map);
app.get('/Shine/AppMapData/GetMap', routes.getmap);
app.post('/Shine/AppMapData/SaveMap', routes.savemap);
app.post('/Shine/AppMapData/SaveFile', routes.savefile);
app.post('/Shine/AppMapData/SaveStation', routes.savestation);
app.post('/Shine/AppMapData/SavePoint', routes.savepoint);
app.post('/Shine/AppMapData/SaveLine', routes.saveline);
app.all('*',  routes.page404);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



//启动聊天服务
var chat = require('./routes/chat');
var app1 = express();
var socketio = require('socket.io');
var server =http.createServer(app1).listen(ip.chatport, function(){
    console.log('socket-io listening on port '+ip.chatport);
});
socketio.listen(server).on('connection', function (socket) {
    chat.connection(socket);//简历连接 创建事件
});
