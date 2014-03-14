//////////////////精灵元素基类///////////////////////////////////////////////////
BasicSpirit = function () {
    this.id = 0;
    this.name = "";
    this.x = 0;
    this.y = 0;
    this.width = 50;
    this.height = 50;
    this.visible = true;
    this.image = new Image();
    this.state = 0;
    this.sensortype = "";
    this.type = 0; //0为地图,1为分站,2为点，3为线，4为人员
    this.color = "black";
    this.init = function () {//初始化数据
        //抽象方法,需要重写。
    }
    this.render = function (x, y) {//重绘方法
        //抽象方法,需要重写。
    }

}
///////////////////////地图元素////////////////////////////////////////////////
MapSpirit = function () {
    this.type = 0;
    this.init = function (spirit) {
        $.ajax({
            type: "Get",
            url: 'Shine/AppMapData/GetMap?random=' + (10 * Math.random()),
            dataType: "html",
            async: false,
            success: function (data) {
                if (data.indexOf("@@") > 0) {
                    alert(data.replace("@@", ""));
                    return;
                } 
                spirit.image.src = 'mapimage/map/' + data;
                spirit.image.onload = function () {
                    var height = spirit.image.height;
                    var width = spirit.image.width;
                    Html5can.height = height * scale;
                    Html5can.width = width * scale;
                }
            }
        });
    }
    this.render = function () {//重绘方法   
        if (!this.visible) return;
        if (director != null && director != undefined) {
            Html5can.height = this.image.height * scale;
            Html5can.width = this.image.width * scale;
            director.canvas.save();
            director.canvas.translate(0, 0);
            director.canvas.drawImage(this.image, 0, 0, this.image.width * scale, this.image.height * scale);
            director.canvas.restore();
        }
    }
    this.init(this);
}
MapSpirit.prototype = new BasicSpirit();

//////////////////////////////////////////////////////////////////////////
////////////////////////////////分站元素//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function StationInit() {
    $.ajax({
        type: "Get",
        url:    ipport+ 'Shine/AppMapData/GetStationInfo?random=' + (10 * Math.random())+'&callback=?',
        dataType: "jsonp",
        async: false,
        success: function (data) {
            if (data.indexOf("@@") > 0) {
                alert(data.replace("@@", ""));
                return;
            } 
            var sensors = JSON.parse(data);
            var dt = sensors;
            for (var i = 0; i < dt.length; i++) {
                var sensor = new SensorSpirit();
                sensor.id = dt[i].ID;
                sensor.name = dt[i].Name;
                sensor.sensortype = dt[i].Type;
                sensor.state = dt[i].State;
                sensor.x = dt[i].X;
                sensor.y = dt[i].Y;
                sensor.image.src = "mapimage/station/sensor.png";
                if (sensor.x != 0 && sensor.y != 0) {//加入已配置列表
                    director.addChild(sensor);
                    stationlist.push(sensor);
                }
                else { unstationlist.push(sensor); } //加入未配置列表 
            } 
            //如果不是手机浏览器则加载到界面
            if (document.body.clientWidth>500) {
                //显示已配置分站  
                var stlist = "";
                for (var i = 0; i < stationlist.length; i++) {
                    //将已配置的分站放入列表中
                    if (stationlist[i].sensortype==-1)//是128分站 
                        stlist += "<li class='l_128'><p id='p_" + stationlist[i].id + "' >" + stationlist[i].name + "</p><input type='button' class='functype' style='width:30px;' id='btn_" + stationlist[i].id + "' onclick='deletestation(this);' value='X'/></li>";
                    else
                        stlist += "<li class='l_70'><p id='p_" + stationlist[i].id + "' >" + stationlist[i].name + "</p><input type='button' class='functype' style='width:30px;' id='btn_" + stationlist[i].id + "' onclick='deletestation(this);' value='X'/></li>";
                }

                document.getElementById("ullist").innerHTML = stlist;

                //将未配置的分站放入列表中
                stlist = "";
                for (var i = 0; i < unstationlist.length; i++) {
                    //将未配置的分站放入列表中
                    if (unstationlist[i].sensortype == -1)//是128分站 
                        stlist += "<li class='l_128'  id='li_" + unstationlist[i].id + "'  onclick='sstation(this);' style='cursor: pointer;' > " + unstationlist[i].name + "</li>"
                    else
                        stlist += "<li class='l_70' id='li_" + unstationlist[i].id + "'  onclick='sstation(this);' style='cursor: pointer;' > " + unstationlist[i].name + "</li>"
                    

                }
                document.getElementById("unullist").innerHTML = stlist; //分站列表中  未配置的分站 
            } 
        }
    });
}
SensorSpirit = function () {
    this.type = 1;
    this.render = function () {//重绘方法
        if (!this.visible) return;
        if (director != null && director != undefined) {
            var top = this.y*scale - this.image.height / 2;
            var left = this.x * scale - this.image.width / 2;
            director.canvas.save();
            director.canvas.drawImage(this.image, left, top, this.image.width, this.image.height);
            director.canvas.textAlign = 'center';
            director.canvas.fillStyle = this.color;
            director.canvas.fillText(this.name, (left + this.image.width / 2), (top + this.image.height + 10));
            director.canvas.restore();
        }
    }
}
SensorSpirit.prototype = new BasicSpirit();

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////点元素////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
function PointInit() {
    $.ajax({
        type: "Get",
        url:  ipport+ 'Shine/AppMapData/GetPointInfo?random=' + (10 * Math.random())+'&callback=?',
        dataType: "jsonp",
        success: function (data) {
            if (data.indexOf("@@") > 0) {
                alert(data.replace("@@", ""));
                return;
            } 
            var sensors = JSON.parse(data);
            var dt = sensors;
            for (var i = 0; i < dt.length; i++) {
                var point = new PointSpirit();
                point.id = dt[i].id;
                point.x = dt[i].x;
                point.y = dt[i].y;
                director.addChild(point); 
            }
        }
    });
}

PointSpirit = function () {
    this.color = "blue";
    this.type = 2;
    this.render = function () {//重绘方法
        if (!this.visible) return;
        if (director != null && director != undefined) { 
            director.canvas.save(); 
            director.canvas.beginPath();
            director.canvas.arc(this.x * scale, this.y * scale, 3, 0, Math.PI * 2, true);
            director.canvas.closePath(); 
            director.canvas.fillStyle = this.color;
            director.canvas.fill();
            director.canvas.restore();
        }
    }
}
PointSpirit.prototype = new BasicSpirit();
//////////////////////////////////////////////////////////////////////////
/////////////////////////////////////线元素/////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function LineInit() {
    $.ajax({
        type: "Get",
        url:  ipport+'Shine/AppMapData/GetLineInfo?random=' + (10 * Math.random())+'&callback=?',
        dataType: "jsonp",
        success: function (data) {
            if (data.indexOf("@@") > 0) {
                alert(data.replace("@@", ""));
                return;
            } 
            var sensors = JSON.parse(data);
            var dt = sensors;
            for (var i = 0; i < dt.length; i++) {
                var point = new LineSpirit();
                point.id = dt[i].ID;
                point.x = dt[i].fromx;
                point.y = dt[i].fromy;
                point.tox = dt[i].tox;
                point.toy = dt[i].toy;
                director.addChild(point);
            }
        }
    });
}
LineSpirit = function () {
    this.type = 3;
    this.tox = 0;
    this.toy = 0;
    this.visible = true;
    this.render = function () {//重绘方法
        if (!this.visible) return;
        if (director != null && director != undefined) {
            director.canvas.save();
            director.canvas.fillStyle = this.color;
            director.canvas.moveTo(this.x * scale, this.y * scale);
            director.canvas.lineTo(this.tox * scale, this.toy * scale);
            director.canvas.stroke();
            director.canvas.restore();
        }
    }
}
LineSpirit.prototype = new BasicSpirit();

//////////////////////////////////////////////////////////////////////////
/////////////////////////////人员元素/////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
HeroSpirit = function () {
    this.type = 4;
    this.visible = true;
    this.render = function (x, y) {//重绘方法

    }
}
HeroSpirit.prototype = new BasicSpirit();