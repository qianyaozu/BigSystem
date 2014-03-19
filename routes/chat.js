/**
 * Created by qyz on 14-3-18.
 */

var path = require('path');
var fs = require('fs');
if(!fs.existsSync(__dirname + '/../public/chatfiles'))
{
    fs.mkdirSync(__dirname + '/../public/chatfiles',0755);
}
if(!fs.existsSync(__dirname + '/../public/chatfiles/emplist.json'))
{
    fs.writeFileSync(__dirname + '/../public/chatfiles/emplist.json',"")
    /*fs.open(__dirname + '/../public/chatfiles/emplist.json', 'w+', 0666, function(err, fd){
        fs.close(fd);
    });*/
}
var allempList=readAllEmpList();//人员列表


exports.connection=function(socket){
    //实名注册事件
    socket.on('login',function(msg){
        var json=JSON.parse(msg);
        socket.name=json.card;
        isExists(json,socket); //加入连接列表
        socket.broadcast.emit('in',msg);//通知用户登入
        socket.emit('emplist','{"data":'+ BroadCastPeopleList()+'}');//获取用户列表

        OffLineMessage(socket,json); //拉取离线消息

    });
    //接收消息事件
    socket.on('message', function (msg) {
        OnMessage(socket,msg);
    });

    //断开连接事件
    socket.on('disconnect', function () {
        socket.broadcast.emit('out',socket.name);
        Exit(socket);
    });
}


///判断列表中是否已经存在该socket，不存在则加入
function isExists(json,socket){
    var bo = false;
    for(var i=0;i<allempList.length;i++)
    {
        if(allempList[i].card== json.card)//如果存在则 认为在线
        {
            allempList[i].socket=socket;
            allempList[i].online=true;
            bo = true;
            break;
        }
    }
    if(!bo){
        var v = new EmpList();
        v.card= json.card;
        v.name=json.name;
        v.dept=json.dept;
        v.online=true;
        v.socket=socket;
        allempList.push(v);

        var arr=[];
        for(var j=0;j<allempList.length;j++)
        {
            var vv=new   EmpListEasy();
            vv.card=allempList[j].card;
            vv.name=allempList[j].name;
            vv.dept=allempList[j].dept;
            arr.push(vv);
        }
        if(arr!=null)
        {
            fs.writeFileSync(__dirname + '/../public/chatfiles/emplist.json',JSON.stringify(arr));
        }


    }
    console.log(JSON.stringify(json) +'创建连接');
}

///断开连接 删除列表
function Exit(socket){
    console.log(socket.name+'断开连接');
    for(var i=0;i<allempList.length;i++)
    {
        if(allempList[i].card== socket.name)
        {
            allempList[i].online=false;
            allempList[i].socket=null;
            break;
        }
    }
    socket = null;
}

///广播发送所有人员名单
function BroadCastPeopleList(){
    var arr=[];
    for(var i=0;i<allempList.length;i++)
    {
        var v=new EmpListEasy();
        v.card=allempList[i].card;
        v.name=allempList[i].name;
        v.dept=allempList[i].dept;
        v.online=allempList[i].online;
        arr.push(v);
    }
     return JSON.stringify(arr);
}



///发送信息
function OnMessage(socket,msg){
    var message = JSON.parse(msg);
    if(message!=null){
        var m=new  MessageModel();
        m.from=message.from;
        m.to=message.to;
        m.body=message.body;
        m.time=new Date();
        var info=JSON.stringify(m);
        console.log('接收信息 ', info);
        if(message.to=="")//广播发送信息
        {
            socket.broadcast.emit('message',info);
        }
        else
        {
            for(var i=0;i<allempList.length;i++)
            {
                if(allempList[i].card==message.to)//找到对应的人，判断是离线还是在线，如果离线则保存，在线则发送
                {
                    if(allempList[i].online)
                    {
                        allempList[i].socket.emit('message',info);
                    }
                    else{
                        if(!fs.exists(__dirname + '/../public/chatfiles/'+allempList[i].card+'.json'))
                        {
                            fs.writeFileSync(__dirname + '/../public/chatfiles/'+allempList[i].card+'.json',info+'||');
                        }
                        else{
                            fs.appendFileSync(__dirname + '/../public/chatfiles/'+allempList[i].card+'.json',info+'||');
                        }
                    }
                    break;
                }
            }
        }
    }
}

//读取人员列表
function readAllEmpList(){
    var fs = require('fs');
    var path = require('path');
    var arr=[];

    var data=   fs.readFileSync(__dirname + '/../public/chatfiles/emplist.json');
    if(data!=null&&data!="" )
    {
        var json = JSON.parse(data);
        if(json!=null && json.length>0)
        {
            for(var i=0;i<json.length;i++)
            {
                var v = new EmpList();
                v.card= json[i].card;
                v.name=json[i].name;
                v.dept=json[i].dept;
                v.online=false;
                v.socket=null;
                arr.push(v);
            }
        }
    }
    return  arr;
}

//拉取离线消息
function OffLineMessage(socket,json){
    if(fs.exists(__dirname + '/../public/chatfiles/'+json.card+'.json'))
    {
        var info=  fs.readFileSync(__dirname + '/../public/chatfiles/'+json.card+'.json');
        if(info!="")
        {
            var strarr=   info.split("||");
            var arr=[];
            for(var i=0;i<strarr.length;i++)
            {
                if(strarr[i]!=""){
                  var v=new  OffLineModel();
                    v.data=strarr[i];
                    arr.push(v);
                }
            }
            socket.emit('offline',JSON.stringify(arr));//发送离线消息
           // fs.unlinkSync(__dirname + '/../public/chatfiles/'+json.card+'.json');//删除离线文件
        }
    }
}


/***************实体类********************/
function EmpListEasy(){
    this.card = 0;
    this.name = "";
    this.dept = "";
    this.online=false;
}
function EmpList(){
    this.card = 0;
    this.name = "";
    this.dept = "";
    this.online = false;
    this.socket = null;
}
function MessageModel(){
    this.from="";
    this.to="";
    this.body="";
    this.time="";
}

function OffLineModel(){
    this.data="";
}

/***************公共方法********************/
//删除array中项　根据索引
function removeArray(ob, index)  {
	if (isNaN(index) || index > ob.length) {
        return false;
    }
	for (var i = 0, n = 0; i < ob.length; i++) {
		if (ob[i] != ob[index]) {ob[n++] = ob[i];
        }
    }
    ob.length -= 1;
}
//删除array中项　根据id
function removeArrayByID(ob, id) {
	for (var i = 0; i < ob.length; i++) {
		if (ob[i].id == id) {removeArray(ob, i);
            break;
        }
    }
}


