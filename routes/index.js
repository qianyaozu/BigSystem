var fs = require('fs');
var path = require('path');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.map = function(req, res){
    res.render('map');
};

/*
 * 获取地图信息
 */
exports.getmap = function(req, res){
    var name="";
    var r = new Result();
    if(req.body.mapname!=null)
    {
        name = req.body.mapname;
    }
    var dirList = fs.readdirSync(__dirname+'/../public/mapimage/map/');
    if(dirList.length>0)
    {   r.state="1";
        r.info="";
        if(name!=""&&name==dirList[0])
        {
            r.data="1";
        }
        else{
            if(req.query.random!=null)
            {
                res.write(dirList[0]);
                res.end();
                return;
            }
            r.data="/mapimage/map/"+dirList[0];
        }
    }
    else
    {
        if(req.query.random!=null)
        {
            res.write("@@服务器底图不存在");
            return;
        }
        r.state="0";
        r.info="服务器底图不存在";
        r.data="0";
    }
    res.write( JSON.stringify(r));
    res.end();
};


/*保存地图信息*/
exports.savemap = function(req, res){
    var body = '';
    var header = '';
    var content_type = req.headers['content-type'];
    var boundary = content_type.split('; ')[1].split('=')[1];
    var content_length = parseInt(req.headers['content-length']);
    var headerFlag = true;
    var filename = 'dummy.bin';
    var filenameRegexp = /filename="(.*)"/m;
    req.on('data', function(raw) {
        var i = 0;
        while (i < raw.length)
            if (headerFlag) {
                var chars = raw.slice(i, i+4).toString();
                if (chars === '\r\n\r\n') {
                    headerFlag = false;
                    header = raw.slice(0, i+4).toString();
                    console.log('header length: ' + header.length);
                    console.log('header: ');
                    console.log(header);
                    i = i + 4;
                    // get the filename
                    var result = filenameRegexp.exec(header);
                    if (result[1]) {
                        filename = result[1];
                    }
                    console.log('filename: ' + filename);
                    console.log('header done');
                }
                else {
                    i += 1;
                }
            }
            else {
                // parsing body including footer
                body += raw.toString('binary', i, raw.length);
                i = raw.length;
            }
    });

    req.on('end', function() {
        // removing footer '\r\n'--boundary--\r\n' = (boundary.length + 8)
        body = body.slice(0, body.length - (boundary.length + 8))
        var dirList = fs.readdirSync(__dirname+'/../public/mapimage/map/');
        for(var i=0;i<dirList.length;i++)
        {
            fs.unlinkSync(__dirname+'/../public/mapimage/map/'+dirList[i]);
        }
        fs.writeFileSync(__dirname+'/../public/mapimage/map/' + filename, body, 'binary');
    })
};
/*保存分站信息*/
exports.savestation = function(req, res){
    var ob=   req.body.qm;
    if(ob!=null)
    {
        var reqJosnData="{\"qm\":{\"QueryCondition\":[{\"Key\":\"data\",\"Value\":\""+ ob.replace(/\"/g, "")+"\"}],\"pageIndex\":0,\"rowCount\":0}}";
        httpPost(res,reqJosnData, '/Shine/APPMapData/SetStationPosition');
    }
};
/*保存点信息*/
exports.savepoint = function(req, res){
    var ob=   req.body.qm;
    if(ob!=null)
    {
        var reqJosnData="{\"qm\":{\"QueryCondition\":[{\"Key\":\"data\",\"Value\":\""+ ob.replace(/\"/g, "")+"\"}],\"pageIndex\":0,\"rowCount\":0}}";
        httpPost(res,reqJosnData, '/Shine/APPMapData/SetPointPosition');
    }
};
/*保存线信息*/
exports.saveline = function(req, res){
    var ob=   req.body.qm;
    if(ob!=null)
    {
    var reqJosnData="{\"qm\":{\"QueryCondition\":[{\"Key\":\"data\",\"Value\":\""+ ob.replace(/\"/g, "")+"\"}],\"pageIndex\":0,\"rowCount\":0}}";
    httpPost(res,reqJosnData, '/Shine/APPMapData/SetLinePosition');
    }
};



//保存文件
exports.savefile=function(req,res){
    var body = '';
    var header = '';
    var content_type = req.headers['content-type'];
    var boundary = content_type.split(';')[1].split('=')[1];
    var content_length = parseInt(req.headers['content-length']);
    var headerFlag = true;
    var filename = 'dummy.bin';
    var filenameRegexp = /filename="(.*)"/m;
    req.on('data', function(raw) {
        var i = 0;
        while (i < raw.length)
            if (headerFlag) {
                var chars = raw.slice(i, i+4).toString();
                if (chars === '\r\n\r\n') {
                    headerFlag = false;
                    header = raw.slice(0, i+4).toString();
                    i = i + 4;
                    // get the filename
                    var result = filenameRegexp.exec(header);
                    if (result[1]) {
                        filename = result[1];
                    }
                }
                else {
                    i += 1;
                }
            }
            else {
                // parsing body including footer
                body += raw.toString('binary', i, raw.length);
                i = raw.length;
            }
    });
    req.on('end', function() {
        // removing footer '\r\n'--boundary--\r\n' = (boundary.length + 8)
        body = body.slice(0, body.length - (boundary.length + 8))
        var timepath=CurentTime();
        if(!fs.existsSync(__dirname+'/../public/upload/'+timepath))
        {
            fs.mkdirSync(__dirname+'/../public/upload/'+timepath);
        }
        var ext=filename.split('.')[1];
        if(AllowExt.indexOf(ext)==-1)//不允许的后缀名文件
        {
            var result = new Result();
            result.state = 0;
            result. info = "文件格式不正确";
            result.data = null;
            res.write(JSON.stringify(result));
            res.end();
        }
        else
        {
                fs.writeFile(__dirname+'/../public/upload/'+timepath+'/' + filename, body, 'binary',  function(){
                    // writestream.end();
                    var data = new Data();
                    data.localname=filename;
                    data.url='upload/'+timepath+'/' + filename;
                    data.surl='upload/'+timepath+'/' + filename;
                    var result = new Result();
                    result.state = 1;
                    result. info = "";
                    result.data = data;
                    res.write(JSON.stringify(result));
                    res.end();
            });
        }
    })
}
var AllowExt=[ "amr","arm", "jpg", "jpeg", "gif", "png", "swf"];


exports.page404=function(req,res){
    res.render('page404');
}

///post方法
function httpPost(res,reqJsonData,path){
    var http = require('http');
    // do a POST request
    // prepare the header
    var postheaders = {
        'Content-Type' : 'application/json; charset=UTF-8',
        'Content-Length' : Buffer.byteLength(reqJsonData, 'utf8')
    };

    var fs = require('fs');
    fs.readFile('public/webconfig.json',function(err,data){
        if(err) throw err;
        var ip = JSON.parse(data);
        // the post options
        var optionspost = {
            host : ip.ip,
            port :ip.port,
            path :path,
            method : 'POST',
            headers : postheaders
        };

        // do the POST call
        var reqPost = http.request(optionspost, function(resPost) {
            resPost.on('data', function(d) {
                res.send(d);
            });
        });
        // write the json data
        // 发送REST请求时传入JSON数据
        reqPost.write(reqJsonData);
        reqPost.end();
        reqPost.on('error', function(e) {
            console.error(e);
        });
    });
}


function CurentTime()
{
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var clock = year ;
    if(month < 10)
        clock += "0";
    clock += month ;
    if(day < 10)
        clock += "0";
    clock += day ;
    return(clock);
}


function Result()
{
    this.state=1;
    this.info="";
    this.data=null;
}
function Data(){
    this.localname="";
    this.url="";
    this.surl="";
}
