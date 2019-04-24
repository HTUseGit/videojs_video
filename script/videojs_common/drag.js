
$.fn.extend({
    //---元素拖动插件
    dragging:function(data){
        var $this = $(this);
        var xPage;
        var yPage;
        var X;//
        var Y;//
        var xRand = 0;//
        var yRand = 0;//
        var videoId = ''; //控制视频音量自行添加的
        var father = $this.parent();
        var defaults = {
            move : 'both',
            randomPosition : true ,
            hander:1
        };
        var opt = $.extend({},defaults,data);
        var movePosition = opt.move;
        var random = opt.randomPosition;
        var hander = opt.hander;
        var bgDragGroovePath = opt.bgDragGroovePath;
        var replaceImgPath = opt.replaceImgPath;
        if(hander == 1){
            hander = $this;
        }else{
            hander = $this.find(opt.hander);
        }
        //---初始化
        father.css({"position":"relative"});
        $this.css({"position":"absolute"});
        hander.css({"cursor":"default"});

        var faWidth = father.width();
        var faHeight = father.height();
        var thisWidth = $this.outerWidth();
        var thisHeight = $this.outerHeight();
        var mDown = false;//
        var positionX;
        var positionY;
        var moveX ;
        var moveY ;

        if(random){
            $thisRandom();
        }
        function $thisRandom(){ //随机函数
            $this.each(function(index){
                // var randY = parseInt(Math.random()*(faHeight-thisHeight));///
                var randX = 30;

                if(movePosition.toLowerCase() == 'x'){
                    $(this).css({
                        left:randX
                    });
                    if(randX<=4){

                    }
                    $(bgDragGroovePath).css({left: -(faWidth - thisWidth - randX)});
                    opt.videoId.volume(randX*(1/80));
                    $(replaceImgPath).attr('src', 'images/video/voice_2.png');
                }else if(movePosition.toLowerCase() == 'y'){
                    $(this).css({
                        top:randY
                    });
                }else if(movePosition.toLowerCase() == 'both'){
                    $(this).css({
                        top:randY,
                        left:randX
                    });
                }

            });
        }

        hander.mousedown(function(e){
            father.children().css({"zIndex":"0"});
            $this.css({"zIndex":"100"});
            mDown = true;
            X = e.pageX;
            Y = e.pageY;
            positionX = $this.position().left;
            positionY = $this.position().top;
            return false;
        });

        $(document).mouseup(function(e){
            mDown = false;
        });

        $(document).mousemove(function(e){
            xPage = e.pageX;//--
            moveX = positionX+xPage-X;

            yPage = e.pageY;//--
            moveY = positionY+yPage-Y;
            function thisXMove(){ //x轴移动
                if(mDown == true){
                    $this.css({"left":moveX});
                    $(bgDragGroovePath).css({"left": -(faWidth - thisWidth -moveX) });
                    var volume = 1*(moveX/80)
                    if( volume<0.33 ){
                        $(replaceImgPath).attr('src', 'images/video/voice_1.png');
                    }else if(volume>0.66){
                        $(replaceImgPath).attr('src', 'images/video/voice_3.png');
                    }else{
                        $(replaceImgPath).attr('src', 'images/video/voice_2.png');
                    }
                    opt.videoId.volume(volume);
                }else{
                    return;
                }
                if(moveX < 0){
                    $this.css({"left":"0"});
                    opt.videoId.volume(0);
                    $(bgDragGroovePath).css({"left": -(faWidth - thisWidth) });
                    $(replaceImgPath).attr('src', 'images/video/mute.png');
                }
                if(moveX > (faWidth- 8)){
                    $this.css({"left": '72px'});
                    $(bgDragGroovePath).css({"left": 0 });
                    $(replaceImgPath).attr('src', 'images/video/voice_3.png');
                    opt.videoId.volume(1);
                }
                return moveX;
            }

            function thisYMove(){ //y轴移动
                if(mDown == true){
                    $this.css({"top":moveY});
                    if( opt.videoId != undefined ){
                        if(moveY<(faHeight - thisHeight)&&moveY>0){
                            // console.log(faHeight- thisHeight,moveY,faHeight - thisHeight - moveY);
                            $('#'+opt.videoId)[0].volume = (faHeight - thisHeight - moveY)*(1/(faHeight - thisHeight)) ;
                            $(bgDragGroovePath).css({'height':faHeight - moveY+'px','top': moveY+'px'});
                        }
                    }
                }else{
                    return;
                }
                if(moveY <= 0){
                    $this.css({"top":"0"});
                    if( opt.videoId != undefined ){
                        $('#'+opt.videoId)[0].volume = 1 ;
                        $(bgDragGroovePath).css({'height':faHeight +'px','top':'0'});
                    }
                }
                if(moveY > (faHeight-thisHeight)){
                    $this.css({"top":faHeight-thisHeight});
                    if( opt.videoId != undefined ){
                        $('#'+opt.videoId)[0].volume = 0 ;
                        $(bgDragGroovePath).css({'height':thisHeight+'px','top':faHeight-thisHeight+'px'});
                    }
                }
                return moveY;
            }

            function thisAllMove(){ //全部移动
                if(mDown == true){
                    $this.css({"left":moveX,"top":moveY});
                }else{
                    return;
                }
                if(moveX < 0){
                    $this.css({"left":"0"});
                }
                if(moveX > (faWidth-thisWidth)){
                    $this.css({"left":faWidth-thisWidth});
                }

                if(moveY < 0){
                    $this.css({"top":"0"});
                }
                if(moveY > (faHeight-thisHeight)){
                    $this.css({"top":faHeight-thisHeight});
                }
            }
            if(movePosition.toLowerCase() == "x"){
                thisXMove();
            }else if(movePosition.toLowerCase() == "y"){
                thisYMove();
            }else if(movePosition.toLowerCase() == 'both'){
                thisAllMove();
            }
        });
    }
});