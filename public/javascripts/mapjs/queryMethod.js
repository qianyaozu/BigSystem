//保存分站信息和轨迹点信息
function Save() {
    var sensorList = [];
    var pointList =[];
    var lineList = [];

    for (var i = 0; i < director.childs.length; i++) {
        if (director.childs[i].type == 1)//分站信息
        {
            var mo = new SensorModel();
            mo.id = director.childs[i].id;
            mo.x = parseInt(director.childs[i].x);
            mo.y = parseInt(director.childs[i].y);
            sensorList.push(mo);
        }
        else if (director.childs[i].type == 2)//点信息
        {
            var mo = new PointModel();
            mo.id = director.childs[i].id;
            mo.x = parseInt(director.childs[i].x);
            mo.y = parseInt(director.childs[i].y);
            pointList.push(mo);
        }
        else if (director.childs[i].type == 3)//线信息
        {
            var mo = new LineModel();
            mo.id = director.childs[i].id;
            mo.fromx = parseInt(director.childs[i].x);
            mo.fromy = parseInt(director.childs[i].y);
            mo.tox = parseInt(director.childs[i].tox);
            mo.toy = parseInt(director.childs[i].toy);
            lineList.push(mo);
        }
    }



    /**/
    //保存分站
    $.post( "Shine/AppMapData/SaveStation",{qm : JSON.stringify(sensorList)} );

    //保存分站
    $.post( "Shine/AppMapData/SavePoint",{qm : JSON.stringify(pointList)} );

    //保存线段
    $.post( "Shine/AppMapData/SaveLine",{qm : JSON.stringify(lineList)} );

    sensorList = new Array();
    pointList = new Array();
    lineList = new Array(); 
    alert("保存结束");
}

