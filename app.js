
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
var fs = require('fs');
console.log(__dirname+'/public/webconfig.json');
fs.readFile(__dirname+'/public/webconfig.json',function(err,data){
    if(err) throw err;
    var ip = JSON.parse(data);
    app.set('port', ip.myport);


    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    app.get('/map', routes.map);
    app.get('/', routes.index);
    app.get('/Shine/AppMapData/GetMap', routes.getmap);
    app.post('/Shine/AppMapData/SaveMap', routes.savemap);
    app.post('/Shine/AppMapData/SaveFile', routes.savefile);
    app.post('/Shine/AppMapData/SaveStation', routes.savestation);
    app.post('/Shine/AppMapData/SavePoint', routes.savepoint);
    app.post('/Shine/AppMapData/SaveLine', routes.saveline);

   // app.all('*',  routes.page404);
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
});