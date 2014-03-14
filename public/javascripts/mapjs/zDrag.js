var Drag={
   "drag":function (elementToDrag,event)
    {
        var startX=event.clientX; startY=event.clientY;//div中间坐标
        var origX=elementToDrag.offsetLeft; origY=elementToDrag.offsetTop;//div左上角的坐标
     
        var deltaX=startX-origX;  deltaY=startY-origY;
     
        document.onmousemove=moveHandler;
        document.onmouseup=upHandler; 
      
        if(event.stopPropagation) event.stopPropagation();//firefox 阻止事件冒泡，使得元素的父节点也响应事件
        else event.cancelBubble=true; //IE
        if(event.preventDefault) event.preventDefault();//阻止默认的方法
        else event.returnValue=false;
        function moveHandler(e)
        {
         
//          if(!e) e=window.event;
//          if(e.stopPropagation) e.stopPropagation();
//          else e.cancelBubble=true;
            if(!e) e = e || event;
            e.cancelBubble=true;
            e.returnValue = false;
          
          elementToDrag.style.left=(e.clientX-deltaX)+'px';
          elementToDrag.style.top=(e.clientY-deltaY)+'px';
          
        }
      
        function  upHandler(e)
        {
           if(!e) e=window.event; 
            document.onmouseup=null;
            document.onmousemove=null; 
           if(e.stopPropagation) e.stopPropagation();
           else e.cancelBubble=true; 
        }
    }
};

function drags(v, event) {
    Drag.drag(document.getElementById(v), event);
}


