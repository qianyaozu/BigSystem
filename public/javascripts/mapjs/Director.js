var Director = function (canvs) {
    this.timer = "";
    this.canv = canvs;
    this.canvas = canvs.getContext("2d");
    this.childs = new Array(); //元素列表
    this.width = canvs.width;
    this.height = canvs.height;
    this.frameRate = 24; //每秒刷新频率 
    this.visible = true;
    this.canvas.save();


    //快速排序。
    this.quickSort = function (array, compareFun) {
        if (compareFun == null) compareFun = function (value1, value2) { return value1 > value2; }
        var size = array.length;
        sort(0, size - 1);
        function sort(left, right) {
            if (left >= right) return;
            var mid = getPartition(left, right, array[right]);
            sort(left, mid - 1);
            sort(mid + 1, right);
        }

        function getPartition(left, right, mid) {
            var lp = left - 1;
            var rp = right;
            var len = array.length;
            var temp;
            while (true) {
                while (compareFun(mid, array[++lp])) { }
                while (rp > 0 && compareFun(array[--rp], mid)) { }
                if (lp >= rp) {
                    break;
                } else {
                    temp = array[lp];
                    array[lp] = array[rp];
                    array[rp] = temp;
                }
            }
            temp = array[right];
            array[right] = array[lp];
            array[lp] = temp;
            return lp;
        }
    }

    //添加一个显示对象。
    this.addChild = function (child) {
        child.parent = this;
        this.childs.push(child);
    }
    //移除一下显示对象.
    this.removeChild = function (child) {
        for (var i = 0; i < this.childs.length; i++) {
            if (this.childs[i] == child) {
                this.childs.splice(i, 1);
            }
        }
    }
    //渲染
    this.render = function () {
        if (!this.visible) return;
        this.canvas.clearRect(0, 0, this.width, this.height);
        for (var i = 0; i < this.childs.length; i++) {
            this.childs[i].render();
        }
    }
    this.animation = function (director) {
        timer = setInterval(function () {
            director.render();
        }, 1000 / this.frameRate);
    }
    this.stopanimation = function (director) {
        clearInterval(director.timer);
    }
    this.animation(this);
}
