// 参考：https://mementoo.info/archives/1617

// どっと絵変換
var dotFilter = function(src, dst, width, height, xCnt, yCnt) {
    var xDelta = parseInt(width / xCnt);
    var yDelta = parseInt(width / yCnt);
    for (var i = 0; i < xCnt; i++) {
        for (var j = 0; j < yCnt; j++) {
            var aveR = 0;
            var aveG = 0;
            var aveB = 0;
            var cnt = 0;

            // 平均値計算
            for (var k = 0; k < xDelta; k++) {
                for (var l = 0; l < yDelta; l++) {
                    var x = i * xDelta + k;
                    var y = j * yDelta + l;
                    var idx = (x + y * width) * 4;

                    var r = src[idx];
                    var g = src[idx+1];
                    var b = src[idx+2];

                    aveR += r;
                    aveG += g;
                    aveB += b;
                    cnt++;
                }
            }

            aveR /= cnt;
            aveG /= cnt;
            aveB /= cnt;

            //console.log(cnt);
            
            // 割り当て
            for (var k = 0; k < xDelta; k++) {
                for (var l = 0; l < yDelta; l++) {
                    var x = i * xDelta + k;
                    var y = j * yDelta + l;
                    var idx = (x + y * width) * 4;

                    // 順にRGBA
                    // dst[idx] = 100;
                    // dst[idx + 1] = 100;
                    // dst[idx + 2] = 100;
                    dst[idx] = aveR;
                    dst[idx + 1] = aveG;
                    dst[idx + 2] = aveB;
                    dst[idx + 3] = 255;
                }
            }
        
        }
    }
};

 
window.addEventListener("DOMContentLoaded", function(){
    //ファイルオープンの際のイベント
    var ofd = document.getElementById("selectfile");
    ofd.addEventListener("change", function(evt) {
        var img = null;
        var canvas_i = document.createElement("canvas");
        var canvas = document.createElement("canvas");
        //var canvas = document.getElementById('canvas');
 
        var file = evt.target.files;
        var reader = new FileReader();
 
        //dataURL形式でファイルを読み込む
        reader.readAsDataURL(file[0]);
 
        //ファイルの読込が終了した時の処理
        reader.onload = function(){
            img = new Image();
            img.onload = function(){
                var textboxX = document.getElementById("input_x");
                var xCnt = textboxX.value;
                var textboxY = document.getElementById("input_y");
                var yCnt = textboxY.value;
                console.log(xCnt);
                console.log(yCnt);

                // inputを描画
                var context_i= canvas_i.getContext('2d');
                var width_i = img.width;
                var height_i = img.height;
                canvas_i.width = width_i;
                canvas_i.height = height_i;
                context_i.drawImage(img, 0, 0);
                var dataurl_i = canvas_i.toDataURL();
                document.getElementById("input").innerHTML = "<img src='" + dataurl_i + "'>";

                //キャンバスに画像をセット
                var context = canvas.getContext('2d');
                var width = img.width;
                var height = img.height;
                canvas.width = width;
                canvas.height = height;
                context.drawImage(img, 0, 0);
 
                //フィルター処理
                var srcData = context.getImageData(0, 0, width, height);
                var dstData = context.createImageData(width, height);
                var src = srcData.data;
                var dst = dstData.data;

                dotFilter(src, dst, width, height,xCnt, yCnt);
                context.putImageData(dstData, 0, 0);
 
                //画像タグに代入して表示
                var dataurl = canvas.toDataURL();
                document.getElementById("output").innerHTML = "<img src='" + dataurl + "'>";
            }
            img.src = reader.result;
        }
    }, false);
});