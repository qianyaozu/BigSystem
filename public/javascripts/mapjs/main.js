var director;
var Html5can;
var scale = 1;//缩放比例 
var mode = 1; //0为查看模式 1为编辑模式
var isPoint = false; //是否开始画线
var tempSelect; //选中的分站
var tempDelete;//要删除的object
var stationlist = new Array(); //分站列表
var unstationlist = new Array(); //未选择的分站列表
var ipport="";


onload = function () {
    try {
        var fd = new FormData();
    } catch (e) {
        alert("请选择全面支持HTML5的浏览器：Internet Explorer10以上或者Chrome,Firefox,Opera");
        return;
    }
    $.getJSON("webconfig.json",function(data){
        ipport=data.html;

    //禁止右键和选中
    document.oncontextmenu = new Function('event.returnValue=false;');
    document.onselectstart = new Function('event.returnValue=false;');
    Html5can = document.getElementById("can");

    director = new Director(Html5can); //初始化导演类
    initScene();

    //单击事件
    Html5can.onmousedown = function (e) {
        e = e || event;
        var x = e.layerX - Html5can.offsetLeft;
        var y = e.layerY - Html5can.offsetTop;
        //判断是否点击到分站，点，线上面 
        if (event.button <= 1) {//左键  IE中左键为1  FF中为0 点击滚轮为1
            leftclickmap(x, y); //commonMethod.js中
        }
        else if (event.button == 2) {//右键
            rightclickmap(x, y);
        }
    }
    //双击事件
    Html5can.ondblclick = function (e) {
        if (mode == 0) return;
        e = e || event;
        var x = e.layerX - Html5can.offsetLeft;
        var y = e.layerY - Html5can.offsetTop;
        if (document.getElementById("_DialogDiv_Station").style.display == "block") {//正在设置分站
            if (tempSelect != null) {
                dbclickaddstation(x, y); //双击增加修改分站
            }
        }
    }
    });
}




initScene = function () {
    //初始化map 
    var map = new MapSpirit();
    director.addChild(map);
    //初始化分站 
    StationInit(); 
    //初始化点
    PointInit();
    //初始化线
    LineInit();
    //初始化人物 
}