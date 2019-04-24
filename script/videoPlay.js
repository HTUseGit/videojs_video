/*
              ┏┓      ┏┓
            ┏┛┻━━━┛┻┓
            ┃       ☃      ┃
            ┃  ┳┛  ┗┳  ┃
            ┃      ┻      ┃
            ┗━┓     ┏-━┛
                ┃     ┗━━┓
                ┃  神兽保佑 ┣┓
                ┃　永无BUG！┏┛
                ┗┓┓┏━-┳┓┏┛
                  ┃┫┫   ┃┫┫
                  ┗┻┛   ┗┻┛

 */


// function getUrlParams(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null)
//         return unescape(r[2]);
//     return null;
// }

// var videoUrl = getUrlParams('url');
var videoUrl = 'video/h265.mp4'
// 播放器的格式化
var myPlayer = videojs('my-video', {
    bigPlayButton: true,
    controlBar: {
        playToggle: true,
        volumePanel: false,
        currentTimeDisplay: false,
        timeDivider: false,
        durationDisplay: false,
        progressControl: true,
        liveDisplay: false,
        remainingTimeDisplay: false,
        customControlSpacer: false,
        playbackRateMenuButton: false,
        chaptersButton: false,
        descriptionsButton: false,
        subsCapsButton: false,
        audioTrackButton: false,
        fullscreenToggle: true
    },
    sources: [{
        src: videoUrl,
        type: "video/mp4"
    }]
});
$(".vjs-control-bar").append('<button class="vjs-control-video-currentTime"><span id="time1">00:00:00</span><span> / </span><span id="time2">00:00:00</span></button>');
$(".vjs-control-bar").append('<div class="live_volume f_left"><div class="live_volume_box f_left"><img src="images/video/v_volume.png" alt=""></div><div class="drag f_left"><div class="bgDragGroove"></div><div class="dragGroove"><img class="dragLump" src="images/video/drag.png"></div></div></div>');
videojs("my-video").ready(function () {
    var myPlayer = this;
    myPlayer.play();
    //点击进度条，更新时间
    myPlayer.on('progress', function () {
        var initSecondTime = myPlayer.currentTime();
        // timeFormat(initSecondTime).then(function (data) {
        //     $('#time1').html(data)
        // })
        $('#time1').html(format(initSecondTime))
    });
    myPlayer.on("ended", function () {
        clearInterval(durationTime)
    });
    myPlayer.on("pause", function () {
        $('.video-js .vjs-big-play-button').css('display', 'block')
    });
    myPlayer.on("play", function () {
        document.getElementById('my-video_html5_api').muted = false;
        $('.video-js .vjs-big-play-button').css('display', 'none')
    });
});


var t = setInterval(function () {
    if (myPlayer.currentTime() > 0) {
        clearInterval(t);
        // timeFormat(parseInt(myPlayer.duration())).then(function (data) {
        //     $('#time2').html(data)
        // });
        $('#time2').html(format(myPlayer.duration()));
        setInterval(durationTime, 20);
    }
}, 10);


function durationTime() {
    var time = myPlayer.currentTime();
    // timeFormat(time).then(function (data) {
    //     $('#time1').html(data)
    // })
    $('#time1').html(format(time));
}

// 将数字格式化00:00:00的样式
// function timeFormat(time) {
//     var deferred = $.Deferred();
//     if (parseInt(time % 60) >= 10) {
//         if (parseInt(time / 60 % 60) >= 10) {
//             return deferred.resolve('0' + parseInt(time / 60 / 60 % 60) + ':' + parseInt(time / 60 % 60) + ':' + parseInt(time % 60))
//         } else {
//             return deferred.resolve('0' + parseInt(time / 60 / 60 % 60) + ':0' + parseInt(time / 60 % 60) + ':' + parseInt(time % 60))
//         }
//     } else {
//         if (parseInt(time / 60 % 60) >= 10) {
//             return deferred.resolve('0' + parseInt(time / 60 / 60 % 60) + ':' + parseInt(time / 60 % 60) + ':0' + parseInt(time % 60))
//         } else {
//             return deferred.resolve('0' + parseInt(time / 60 / 60 % 60) + ':0' + parseInt(time / 60 % 60) + ':0' + parseInt(time % 60))
//         }
//     }
//     return deferred
// }
// 将数字格式化00:00:00的样式
function format(interval) {
    interval = interval | 0
    const hour = _pad(interval / 3600 | 0)
    const minute = _pad(interval / 60 % 60 | 0)
    const second = _pad(interval % 60)
    return `${hour}:${minute}:${second}`
}

function _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
        num = '0' + num
        len++
    }
    return num
}

var volume ,length ; //用于记录当前音量大小
$('.live_volume_box').toggle(function () {
    volume = myPlayer.volume();
    length = volume * 72 + 4;
    $('.live_volume>.drag>.dragGroove>.dragLump').css({'left': 0});
    $('.live_volume>.drag>.bgDragGroove').css({'left': '-72px'});
    $('.live_volume>.live_volume_box>img').attr('src', 'images/video/mute.png');
    myPlayer.volume(0);
}, function () {
    volumeCtrl(length)
})
//音量
$('.live_volume>.drag>.dragGroove>.dragLump').dragging({
    move: 'x',
    randomPosition: true,
    videoId: myPlayer,
    bgDragGroovePath: '.live_volume>.drag>.bgDragGroove', //拖动的背景块的路径
    replaceImgPath: '.live_volume>.live_volume_box>img' //拖动块相对应的图标的路径
});
$('.live_volume>.drag').click(function (e) {
    document.getElementById('my-video_html5_api').muted = false;
    var VolumeClickPosition = e.pageX - $(this).offset().left;
    volumeCtrl(VolumeClickPosition)
});

// 音量控制的公共部分的函数
function volumeCtrl(volumePosition) {
    if (volumePosition > 72) {
        $('.live_volume>.drag>.dragGroove>.dragLump').css({'left': '72px'});
        $('.live_volume>.drag>.bgDragGroove').css({'left': 0});
        $('.live_volume>.live_volume_box>img').attr('src', 'images/video/voice_3.png');
        myPlayer.volume(1);
    } else if (volumePosition < 8) {
        $('.live_volume>.drag>.dragGroove>.dragLump').css({'left': 0});
        $('.live_volume>.drag>.bgDragGroove').css({'left': '-72px'});
        $('.live_volume>.live_volume_box>img').attr('src', 'images/video/mute.png');
        myPlayer.volume(0);
    } else {
        let volume = 1 * (volumePosition - 4) / 72;
        $('.live_volume>.drag>.dragGroove>.dragLump').css({'left': (volumePosition - 4) + 'px'});
        $('.live_volume>.drag>.bgDragGroove').css({'left': -(76 - volumePosition) + 'px'});
        $('.live_volume>.live_volume_box>img').attr('src', '../images/video/volume.png');
        if (volume <= 0.33) {
            $('.live_volume>.live_volume_box>img').attr('src', 'images/video/voice_1.png');
        } else if (volume > 0.66) {
            $('.live_volume>.live_volume_box>img').attr('src', 'images/video/voice_3.png');
        } else {
            $('.live_volume>.live_volume_box>img').attr('src', 'images/video/voice_2.png');
        }
        myPlayer.volume(volume);
    }
}