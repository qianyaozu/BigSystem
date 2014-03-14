//上传文件
function uploadFile() {
    debugger;
    var fd = new FormData();
    fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    var xhr = new XMLHttpRequest(); 
    xhr.addEventListener("load", uploadComplete, false);
//    xhr.addEventListener("error", uploadFailed, false);
//    xhr.addEventListener("abort", uploadCanceled, false);
    xhr.open("POST", "Shine/AppMapData/SaveMap");
    xhr.send(fd);
}
function uploadComplete() {
    for(var i=0;i<director.childs.length;i++) {
        if(director.childs[i].type==0) {
            director.childs[i].init(director.childs[i]);
            break;
        }

    } 
}
//判断点是否在线上
function on_segment(p1x, p1y, p2x, p2y, p3x, p3y) {
    var max = p1x > p2x ? p1x : p2x;
    var min = p1x < p2x ? p1x : p2x;
    var max1 = p1y > p2y ? p1y : p2y;
    var min1 = p1y < p2y ? p1y : p2y;
    if (p3x >= min && p3x <= max &&
  p3y >= min1 && p3y <= max1 && ((p1x - p3x) * (p2y - p3y) - (p2x - p3x) * (p1y - p3y)))
        return 1;
    else
        return 0;
}

//获取点击的坐标点
function getEventPosition(ev) {
    var x, y;
    if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        x = ev.offsetX;
        y = ev.offsetY;
    }
    return { x: x, y: y };
}
function getNames(obj, name, tij) {
    var p = document.getElementById(obj);
    var plist = p.getElementsByTagName(tij);
    var rlist = new Array();
    for (i = 0; i < plist.length; i++) {
        if (plist[i].getAttribute("name") == name) {
            rlist[rlist.length] = plist[i];
        }
    }
    return rlist;
}
function butong_net(obj, name) {
    var p = obj.parentNode.getElementsByTagName("td");
    var p1 = getNames(name, "f", "div");
    for (i = 0; i < p1.length; i++) {
        if (obj == p[i]) {
            p[i].className = "s";
            p1[i].className = "dis";
        } else {
            p[i].className = "";
            p1[i].className = "undis";
        }
    }
}
//开始画线
function beginpaint(v) {
    if (v.checked) {
        isPoint = true;
        $("#unullist li").css("background-color", "Transparent"); //取消选中的分站
        tempSelect.color = "black";
        tempSelect = null;  
    } else {
        isPoint = false; 
    }
}

//删除已选分站,增加到备选分站列表中
function deletestation(o) {
    var id = o.id.split('_')[1];
    var name = document.getElementById("p_" + id).innerText;
    ullist.removeChild(o.parentNode);
    unullist.innerHTML += "<li id='li_" + id + "' onclick='sstation(this);' style='cursor: pointer;' >" + name + "</li>"
    //加入到待配置列表中,从已配置列表中删除
    for (var i = 0; i < stationlist.length; i++) {
        if (stationlist[i].ID == id) {
            var s = new SensorSpirit();
            s.id = stationlist[i].id;
            s.name = stationlist[i].name;  
            s.x = 0;
            s.y = 0;
            unstationlist.push(s);
            stationlist.splice(i,1); 
            break;
        }
    }
    //从地图上删除
    for (var ii = 0; ii < director.childs.length; ii++) {
        if (director.childs[ii].type == 1 && director.childs[ii].id == id) {
            director.childs.splice(ii,1);
            break;
        } 
    }
   // director.render();//重绘
}

//分站中选择待选分站
function sstation(v) {
    $("#unullist li").css("background-color", "Transparent");
    v.style.background = "red"; //待选分站背景色置为红色
    for (var i = 0; i < unstationlist.length; i++) {
        if (unstationlist[i].id == v.id.split('_')[1]) {
            tempSelect = unstationlist[i];
            break;
        }
    }
}
///关闭窗口
function toggleLayer(layerid) {
    document.getElementById(layerid).style.display = "none";
}
//////////////////////////////////////////////////////////////////////////
//设置模式->0为浏览模式 1为编辑模式
//////////////////////////////////////////////////////////////////////////
function ChangeMode() {
    if (mode == 0) {
        document.getElementById("_DialogDiv_Station").style.display = "block";
        document.getElementById("layerDia").style.display = "block";
        mode = 1;
    }
    else {
        document.getElementById("_DialogDiv_Station").style.display = "none";
        document.getElementById("layerDia").style.display = "none";
        mode = 0;
   }
}
//////////////////////////////////////////////////////////////////////////
//删除分站，点，线
//////////////////////////////////////////////////////////////////////////
function removeobject() {
    if (tempDelete == null) return;
    if (tempDelete.type == 1) {
        ullist.removeChild(document.getElementById("p_" + tempDelete.id).parentNode);
        unullist.innerHTML += "<li id='li_" + tempDelete.id + "' onclick='sstation(this);' style='cursor: pointer;' >" + tempDelete.name + "</li>"
        //加入到待配置列表中,从已配置列表中删除
        for (var i = 0; i < stationlist.length; i++) {
            if (stationlist[i].ID == tempDelete.id) {
                var s = new SensorSpirit();
                s.id = stationlist[i].id;
                s.name = stationlist[i].name;
                s.x = 0;
                s.y = 0;
                unstationlist.push(s);
                stationlist.splice(i, 1);
                break;
            }
        }
    }
    else if (tempDelete.type == 2) {//如果删除点，则把他关联的线也删除掉
        for (var i = 0; i < director.childs.length; i++) {
            if(director.childs[i].type==3&&((director.childs[i].x==tempDelete.x&&director.childs[i].y==tempDelete.y)||(director.childs[i].tox==tempDelete.x&&director.childs[i].toy==tempDelete.y))) {
                director.removeChild(director.childs[i]);
            } 
        }
    } 
    director.removeChild(tempDelete);
    tempDelete = null;
    document.getElementById("deleteDiv").style.display = "none";
}
//////////////////////////////////////////////////////////////////////////
//双击增加分站
//////////////////////////////////////////////////////////////////////////
function dbclickaddstation(x, y) {
    if ($("#disdiv").css("display") == "none") return;
    if (mode == 0 || tempSelect == null || tempSelect.type != 1||isPoint) return;//不是编辑模式或者没有选中分站，或者选中的不是分站,或者在画点，则跳出不执行逻辑
    var index = -1;
    for (var i = 0; i < director.childs.length; i++) {
        if (director.childs[i].type == 1 && director.childs[i].id == tempSelect.id)//判断该分站是未配置分站中的  还是点击地图获得的临时分站
        {
            index = i;
            break;
        }
    }
    if (index != -1) {//点击地图获得临时分站
        var sensor = director.childs[index];
        sensor.x = x/this.scale;
        sensor.y = y / this.scale;
        sensor.color = "black";
        tempSelect = null;
        //设置下一个待选分站
        if ($("#disdiv").css("display") != "none") {
            for (var i = 0; i < $("#unullist li").length; i++) {
                if ($("#unullist li")[i].style.background == "red") {
                    var id = $("#unullist li")[i].id.split('_')[1];
                    for (var i = 0; i < unstationlist.length; i++) {
                        if (unstationlist[i].id == id) {
                            tempSelect = unstationlist[i];
                            return;
                        }
                    }
                } 
           }
        } 
       
    }
    else { //点击未配置分站列表中的分站 
        //从未配置分站中删除，加入到已配置分站列表中
        if (tempSelect != null) {
            //设置临时分站的图层，坐标 
            tempSelect.x = x / scale;
            tempSelect.y = y / scale;

            //从未配置分站列表中删除并加入到已配置分站列表中 
            for (var i = 0; i < unstationlist.length; i++) {
                if (unstationlist[i].id == tempSelect.id) {
                    var s = new SensorSpirit();
                    s.id = tempSelect.id;
                    s.name = tempSelect.name;
                    s.x = tempSelect.x;
                    s.y = tempSelect.y;
                    stationlist.push(s);
                    unstationlist.splice(i, 1);
                    break;
                }
            }
            director.addChild(tempSelect); //加入到绘制列表中
            //选中下一个分站
            var tl = $("#li_" + tempSelect.id).next();
            if (tl.length == 0) {
                tl = $("#li_" + tempSelect.id).prev();
            }

            //从未配置中删除
            var ss = document.getElementById("li_" + tempSelect.id);
            ss.parentNode.removeChild(ss);
            //画在已配置的分站上
            document.getElementById("ullist").innerHTML += "<li><p id='p_" + tempSelect.id + "' >" + tempSelect.name + "</p><input type='button' class='functype' style='width:30px;'  id='btn_" + tempSelect.id + "' onclick='deletestation(this);' value='X'/></li>";
            tempSelect = null;
            if (tl.length > 0) { //设置下一个分站
                tl[0].style.background = "red"; //待选分站背景色置为红色
                for (var i = 0; i < unstationlist.length; i++) {
                    if (unstationlist[i].id == tl[0].id.split('_')[1]) {
                        tempSelect = unstationlist[i];
                        break;
                    }
                }
            }
        }
    }
}
//////////////////////////////////////////////////////////////////////////
//鼠标左键单击地图，选中分站，选中点
//////////////////////////////////////////////////////////////////////////
function leftclickmap(x, y) {
    debugger;
    var deletediv = document.getElementById("deleteDiv");
    if (deletediv.style.display == "block")
        deletediv.style.display = "none";
    SetPointBlue();
    var temp = null;
    //按type排序
    director.quickSort(director.childs, function (v1, v2) {
        return v1.type < v2.type;
    });
    for (var i = 0; i < director.childs.length; i++) {
        if (director.childs[i].type == 2 && isPoint) {//先判断点，再判断分站，再判断地图
            //判断是否在圆点中半径为3
            if (Math.sqrt(Math.pow(Math.abs(x - director.childs[i].x * this.scale), 2) + Math.pow(Math.abs(y - director.childs[i].y * this.scale), 2)) <= 3) {
                if (tempSelect != null && tempSelect.type == 2)//如果已经画了点了。则画线
                {
                    var v = new LineSpirit();
                    v.x = tempSelect.x  ;
                    v.y = tempSelect.y  ;
                    v.tox = director.childs[i].x  ;
                    v.toy = director.childs[i].y  ;
                    director.addChild(v);
                }
                tempSelect = director.childs[i];
                tempSelect.color = "red";
                break;
            }
        }
        else if (director.childs[i].type == 1) {//先判断点，再判断分站，再判断地图 
            if (x > (parseInt(director.childs[i].x * this.scale) - director.childs[i].image.width / 2) && x < (parseInt(director.childs[i].x * this.scale) + director.childs[i].image.width / 2)
                    && y > (parseInt(director.childs[i].y * this.scale) - director.childs[i].image.height / 2) && y < (parseInt(director.childs[i].y * this.scale) + director.childs[i].image.height / 2)) {
                if (mode == 1) {
                    if (!isPoint) {
                        tempSelect = director.childs[i];
                        tempSelect.color = "red";
                        break;
                    }
                    else {//画点模式下面，在分站上画点
                        var p = new PointSpirit();
                        p.x = director.childs[i].x;
                        p.y = director.childs[i].y;
                        p.color = "red";
                        director.addChild(p);
                        if (tempSelect != null && tempSelect.type == 2) {
                            var v = new LineSpirit();
                            v.x = tempSelect.x  ;
                            v.y = tempSelect.y  ;
                            v.tox = director.childs[i].x  ;
                            v.toy = director.childs[i].y ;
                            director.addChild(v);
                            tempSelect = p;
                        }
                        else {
                            tempSelect = p;
                        }

                        break;
                    }
                }
                else {
                    //弹出分站下人员信息列表
                    //////////////////////////////////////////////////////////////////////////预留
                }
            }
        }
        else if (director.childs[i].type == 0) {
            if (mode == 1 && isPoint) {
                if (x >= 0 && x <= director.childs[i].image.width * this.scale && y >= 0 && y <= director.childs[i].image.height * this.scale) {
                    if (tempSelect != null && tempSelect.type == 2) {//已经有选中的点则画线 
                        var v = new LineSpirit();
                        v.x = tempSelect.x  ;
                        v.y = tempSelect.y  ;
                        v.tox = x / this.scale;
                        v.toy = y / this.scale;
                        director.addChild(v);
                        var p = new PointSpirit();
                        p.x = x / this.scale;
                        p.y = y / this.scale;
                        p.color = "red";
                        director.addChild(p);
                        tempSelect = p;
                    }
                    else if (tempSelect == null) {//否则画点
                        var p = new PointSpirit();
                        p.x = x / this.scale;
                        p.y = y / this.scale;
                        p.color = "red";
                        director.addChild(p);
                        tempSelect = p;
                    }
                }
                break;
            }
        }
    }
    //按type排序,重新排序
    director.quickSort(director.childs, function (v1, v2) {
        return v1.type > v2.type;
    });
}

//////////////////////////////////////////////////////////////////////////
//鼠标右击选中
//////////////////////////////////////////////////////////////////////////
function rightclickmap(x, y) {
    var deletediv = document.getElementById("deleteDiv");
    if (deletediv.style.display == "block")
        deletediv.style.display = "none";
    //右键，取消临时点
    if (tempSelect != null && tempSelect.type == 2) {
        for (var i = 0; i < director.childs.length; i++) {
            if (director.childs[i].type == 2 && director.childs[i].color == "red") {
                director.childs[i].color = "blue";
                tempSelect = null;
                break;
            }
        }
    }
    //判断右击的是点，线还是分站
    if (mode == 0) return; 
    //获取实际的xy坐标
    var realx = x / scale;
    var realy = y / scale;
    //按type排序,重新排序，保证绘制顺序从线，点分站的顺序开始
    director.quickSort(director.childs, function (v1, v2) {
        return v1.type < v2.type;
    });
    for (var i = 0; i < director.childs.length; i++) {
        if (director.childs[i].type == 3) {//右击点到线
            var line=director.childs[i];
            if (on_segment(line.x, line.y, line.tox, line.toy, realx, realy)) {
                deletediv.style.top = y + "px";
                deletediv.style.left = x + "px";
                deletediv.style.display = "block";
                tempDelete = director.childs[i];
                deletediv.value = "删除线"; 
                break;
            }
        }
        else if (director.childs[i].type == 2)//右击点到点
        {
            if (Math.sqrt(Math.pow(Math.abs(x - director.childs[i].x * this.scale), 2) + Math.pow(Math.abs(y - director.childs[i].y * this.scale), 2)) <= 3) {
                deletediv.style.top = y + "px";
                deletediv.style.left = x + "px";
                deletediv.style.display = "block";
                tempDelete = director.childs[i];
                deletediv.value = "删除点";
                break;
            }
        }
        else if (director.childs[i].type == 1) {//右击点到分站
            if (realx > (parseInt(director.childs[i].x * this.scale) - director.childs[i].image.width / 2) && realx < (parseInt(director.childs[i].x * this.scale) + director.childs[i].image.width / 2)
                    && realy > (parseInt(director.childs[i].y * this.scale) - director.childs[i].image.height / 2) && realy < (parseInt(director.childs[i].y * this.scale) + director.childs[i].image.height / 2)) {
                deletediv.style.top = y + "px";
                deletediv.style.left = x + "px";
                deletediv.style.display = "block";
                tempDelete = director.childs[i];
                deletediv.value = "删除分站";  
                break;
            }
        }
    }
    //按type排序,重新排序，保证绘制顺序从线，点分站的顺序开始
    director.quickSort(director.childs, function (v1, v2) {
        return v1.type > v2.type;
    });
}


//切换分站显示，全部分站，70分站，128分站
function ChangeStationVisible() {
    
    var sel = document.getElementById("stationType");
    if (sel.value == "0") {
        for (var i = 0; i < director.childs.length; i++) {
            if (director.childs[i].type == 1) { director.childs[i].visible = true; }
        }
        $(".l_128").css("display", "block");
        $(".l_70").css("display", "block"); 
    }
    else if (sel.value == "1") {
        for (var i = 0; i < director.childs.length; i++) {
            if (director.childs[i].type == 1) {
                if (director.childs[i].sensortype == -1)
                    director.childs[i].visible = true;
                else
                    director.childs[i].visible = false;
            }
        }
        $(".l_128").css("display", "block");
        $(".l_70").css("display", "none"); 
    }
    else {
        for (var i = 0; i < director.childs.length; i++) {
            if (director.childs[i].type == 1) {
                if (director.childs[i].sensortype == -1)
                    director.childs[i].visible = false;
                else
                    director.childs[i].visible = true;
            }
        }
        $(".l_128").css("display", "none");
        $(".l_70").css("display", "block"); 
    }
}



//设置点为蓝色
function SetPointBlue() {
    for (var i = 0; i < director.childs.length; i++) {
        if (director.childs[i].type == 2) {
            director.childs[i].color = "blue";
        }
    }
}

//放大
function enlarge() {
    this.scale = this.scale + 0.2;
}

//缩小
function decrease() {
    if (this.scale > 0.4) {
        this.scale = this.scale - 0.2;
    }
}









 


