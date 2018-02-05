var img;
var wid;
var hgt;


var nw=300;
var nh=300;

function loadImages(){
    var textbox = document.getElementById("filename");
    var filename = textbox.value;
    var canvas = document.getElementById("canvas");
    img = new Image();
    img.src = filename;

    img.onload = function(){
        wid = img.naturalWidth;
        hgt = img.naturalHeight;
        canvas.width = wid;
        canvas.height = hgt;

        ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0,wid,hgt);
        imgWidth = wid;
        imgHeight = hgt;
    }
}

function zoomMore(ctx){
    ctx.fillStyle="#fff"; 
    ctx.fillRect(0,0,nw,nh);
    console.log(nw + " " + nh);
    nw = nw+10;
    nh = nh+10;
    ctx.drawImage(img,0,0,nw,nh);  
}

function zoomMinus(){
    ctx.fillStyle="#fff"; 
    ctx.fillRect(0,0,300,300);
    console.log(nw + " " + nh);
    nw = nw-10;
    nh = nh-10;
    ctx.drawImage(img,0,0,nw,nh);
}

var theta = 0;
function rotate(){
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    var outputData = new Array();
    var wid = imageData.width;
    var hgt = imageData.height;
    var sz = wid + wid*hgt*4;
    for(var i=0;i<sz;i++){
        outputData[i] = 255;
    }
    theta = (Math.PI/2);
    for(var x= 0;x<wid;x++){
        for(var y=0;y<hgt;y++){
            var i = getIndex(x  ,y  ,imageData);
            var xp = Math.round( (x-wid)*Math.cos(theta) + (y-hgt)*Math.sin(theta) );
            var yp = Math.round(-(x-wid)*Math.sin(theta) + (y-hgt)*Math.cos(theta) );
            var j = getIndex(xp ,yp ,imageData);
            if( j != -1 ){
                outputData[j] = imageData.data[i];
                outputData[j+1] = imageData.data[i+1];
                outputData[j+2] = imageData.data[i+2];
            }
        }
    }
    for(var i=0;i<sz;i++){
        imageData.data[i] = outputData[i];
    }
    ctx.putImageData(imageData,0,0);

}

function greyScale(ctx){
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    var wid = imageData.width;
    var hgt = imageData.height;
    for(var x= 0;x<wid;x++){
        for(var y=0;y<hgt;y++){
            var index = (x+y*imageData.width)*4;
            var grey  = Math.round( (imageData.data[index+0]+imageData.data[index+1]+imageData.data[index+2]/3));
            imageData.data[index+0] = imageData.data[index+1] = imageData.data[index+2] = grey;
        }
    }
    ctx.putImageData(imageData,0,0);
}

function generateNoise(ctx){
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);

    var outputData = new Array();

    var wid = imageData.width;
    var hgt = imageData.height;
    var sz = wid + wid*hgt*4;
    for(var i=0;i<sz;i++){
        outputData[i] = imageData.data[i];
    }
    var Num = 1000;
    var pos = [];
    for(var i=0;i<Num;i++){
        var px = Math.floor(Math.random()*wid);
        var py = Math.floor(Math.random()*hgt);
        var index = (px+py*wid)*4;
        outputData[index]=0;
        outputData[index+1]=0;
        outputData[index+2]=0;
        pos.push(index+0);
        pos.push(index+1);
        pos.push(index+2);
    }

    for(var i=0;i<sz;i++){
        if(outputData[i]==0){
            imageData.data[i] = outputData[i];    
        }        
    }
    console.log(imageData);
    ctx.putImageData(imageData,0,0);
}

function getIndex(x,y,imageData){
    var wid = imageData.width;
    var hgt = imageData.height;
    var sz = wid + wid*hgt*4;
    var p = (x+y*imageData.width)*4;
    if(p<0 || p>sz){
        return -1;
    }
    return p;
}
function cleanNoise(ctx){
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    var outputData = new Array();
    var ind = new Array();
    var wid = imageData.width;
    var hgt = imageData.height;
    var sz = wid + wid*hgt*4;

    var r = 0;
    var g = 0;
    var b = 0;
    var ct = 0;

    for(var x= 0;x<wid;x++){
        for(var y=0;y<hgt;y++){      
            ind[0] = getIndex(x  ,y  ,imageData);
            ind[1] = getIndex(x+1,y  ,imageData);
            ind[2] = getIndex(x+1,y+1,imageData);
            ind[3] = getIndex(x+1,y-1,imageData);
            ind[4] = getIndex(x  ,y-1,imageData);
            ind[5] = getIndex(x  ,y+1,imageData);
            ind[6] = getIndex(x-1,y  ,imageData);
            ind[7] = getIndex(x-1,y+1,imageData);
            ind[8] = getIndex(x-1,y-1,imageData);
            ct = 0;
            var vr=[];
            var vg=[];
            var vb=[];
            for(var i=0;i<9;i++){
                if( ind[i] != -1 ){
                  vr.push(imageData.data[ind[i]  ]);
                  vg.push(imageData.data[ind[i]+1]);
                  vb.push(imageData.data[ind[i]+2]);
                  ind[i] = 0;
                }else{
                  ind[i] = 0;
                }
            }
            vr=vr.sort((a, b) => a - b);
            vg=vg.sort((a, b) => a - b);
            vb=vb.sort((a, b) => a - b);

            // a.sort()  works lexicographically 
            var pos = getIndex(x  ,y  ,imageData);
            imageData.data[ pos ]  = vr[Math.floor(vr.length/2)];//Math.round(r/ct);
            imageData.data[ pos+1] = vg[Math.floor(vg.length/2)];//Math.round(g/ct);
            imageData.data[ pos+2] = vb[Math.floor(vb.length/2)];//Math.round(b/ct);
            vr = []; vg = [];vb = [];
            //console.log( imageData.data[ pos ] );
        }
    }

  ctx.putImageData(imageData,0,0);
}
function doConvolution(ctx){
    var kernel = new Array();
    for(var cell = 0;cell<9;cell++){
    kernel[cell] = parseInt(document.getElementById("cell"+cell).value);
    }
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    //greyScale(imageData);
    convolution3x3(imageData, kernel)
    ctx.putImageData(imageData,0,0);
}

function convolution3x3(imageData,kernel){
    var outputData  = new Array();
    var sz = imageData.data.length;
    for(var i=0;i<sz;i++){
        outputData[i] = imageData.width;
    }
    var wid = imageData.width;
    var hgt = imageData.height;
    for(var x=0;x<wid-1;x++){
    for(var y=0;y<hgt-1;y++){
        var weightedSum = 0;
        for(var xx=-1;xx<=1;xx++){
            for(var yy=-1;yy<=1;yy++){
                var index = (x+xx+(y+yy)*wid)*4;
                var grey  = imageData.data[index+0];
                var kernelCellIndex = (xx+1+(yy+1)*3);
                weightedSum += grey*kernel[kernelCellIndex];
            }
        }
        var index = (x+y*wid)*4;
        var outputGrey = weightedSum;
        outputData[index] = outputGrey;
        outputData[index+1] = outputGrey;
        outputData[index+2] = outputGrey;
    }
    }
    for(var i=0;i<sz;i++){
        imageData.data[i] = outputData[i];
    }
}


function dilatation(ctx){
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    var outputData = new Array;
    var ind = new Array();
    var wid = imageData.width;
    var hgt = imageData.height;
    var sz  = wid*hgt;
    for(var x=0;x<wid;x++){
        for(var y=0;y<hgt;y++){
            var c = getIndex(x, y, imageData);
            if(imageData.data[c+0] == 0 && imageData.data[c+1] == 0 && imageData.data[c+2] == 0){

                // simplify
                for(var dx=-1;dx<=1;dx++){                    
                    var p = getIndex(x+dx, y, imageData);
                    if(imageData.data[p+0] == 255 && imageData.data[p+1] == 255 && imageData.data[p+2] == 255){
                        imageData.data[p+0]=0;
                        imageData.data[p+1]=0;
                        imageData.data[p+2]=0;
                    }                    
                }

                for(var dy=-1;dy<=1;dy++){
                   var p = getIndex(x, y+dy, imageData);
                   if(imageData.data[p+0] == 255 && imageData.data[p+1] == 255 && imageData.data[p+2] == 255){
                        imageData.data[p+0]=0;
                        imageData.data[p+1]=0;
                        imageData.data[p+2]=0;
                    }
                }    


            }                                
        }
    }
    ctx.putImageData(imageData,0,0);
    //return imageData;
}

function erosion(ctx){
    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    var outputData = new Array;
    var ind = new Array();
    var wid = imageData.width;
    var hgt = imageData.height;
    var sz  = wid*hgt;
    for(var x=0;x<wid;x++){
        for(var y=0;y<hgt;y++){
            var c = getIndex(x, y, imageData);
            if(imageData.data[c+0] == 0 && imageData.data[c+1] == 0 && imageData.data[c+2] == 0){
                var abort = 0;
                for(var dx=-1;dx<=1 && !abort;dx++){                    
                    var p = getIndex(x+dx, y, imageData);
                    if(imageData.data[p+0] == 255 && imageData.data[p+1] == 255 && imageData.data[p+2] == 255){
                        imageData.data[c+0]=255;
                        imageData.data[c+1]=255;
                        imageData.data[c+2]=255;
                        abort = 1;
                    }                    
                }

                for(var dy=-1;dy<=1 && !abort;dy++){
                    var p = getIndex(x, y+dy, imageData);
                    if(imageData.data[p+0] == 255 && imageData.data[p+1] == 255 && imageData.data[p+2] == 255){
                        imageData.data[c+0]=255;
                        imageData.data[c+1]=255;
                        imageData.data[c+2]=255;
                        abort = 1;
                    }
                    
                }                
            }                                
        }
    }
    ctx.putImageData(imageData,0,0);
    //return imageData;
}

function equalization (ctx) {
    // greyscale

    var imageData = ctx.getImageData(0,0,imgWidth,imgHeight);
    var wid = imageData.width;
    var hgt = imageData.height;
    for(var x= 0;x<wid;x++){
        for(var y=0;y<hgt;y++){
            var index = (x+y*imageData.width)*4;
            var grey  = Math.round( (imageData.data[index+0]+imageData.data[index+1]+imageData.data[index+2]/3));
            imageData.data[index+0] = imageData.data[index+1] = imageData.data[index+2] = grey;
        }
    }

    var pixels = imageData.data;
    //myCanvas.width =300;
    //myCanvas.height = 300;
    var w = imageData.width;
    var h = imageData.height;             
    var newImageData = imageData;

    var countR = new Array(),
        countG = new Array(),
        countB = new Array();
    for (var i = 0; i < 256; i++) {
        countR[i] = 0;
        countG[i] = 0;
        countB[i] = 0;
    }
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var a = ((y*w)+x)*4;
            countR[pixels[a]]++;
            countG[pixels[a+1]]++;
            countB[pixels[a+2]]++;
        }
    }
    var minR = 256,
        minG = 256,
        minB = 256;
    for (var i = 1; i < 256; i++) {
        countR[i] += countR[i-1];
        countG[i] += countG[i-1];
        countB[i] += countB[i-1];
        
        minR = ((countR[i] != 0) && (countR[i] < minR)) ? countR[i] : minR;
        minG = ((countG[i] != 0) && (countG[i] < minG)) ? countG[i] : minG;
        minB = ((countB[i] != 0) && (countB[i] < minB)) ? countB[i] : minB;
    }
    for (var i = 0; i < 256; i++) {
        countR[i] = ((countR[i]-minR)/((w*h)-minR))*255;
        countG[i] = ((countG[i]-minG)/((w*h)-minG))*255;
        countB[i] = ((countB[i]-minB)/((w*h)-minB))*255;
    }
    
  
    var d1 = [],
        d1pron = [],
        d2 = [],
        d2pron = [],
        d3 = [],
        d3pron = [];
        var options = {
        series: {stack: 0,
                 lines: {show: false, steps: false },
                 bars: {show: true, barWidth: 0.9, align: 'center',},}
    };
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var a = ((y*w)+x)*4;
            newImageData.data[a] = countR[pixels[a]];
            newImageData.data[a+1] = countG[pixels[a+1]];
            newImageData.data[a+2] = countB[pixels[a+2]];
            newImageData.data[a+3] = pixels[a+3];
            //d1.push([a, pixels[a]]);
            //d1pron.push([a, newImageData.data[a]]);
            //d2.push([a, pixels[a+1]]);
            //d2pron.push([a, newImageData.data[a+1]]);
            //d3.push([a, pixels[a+2]]);
            //d3pron.push([a, newImageData.data[a+2]]);
        }
    }
        //$.plot($("#placeholder"), [ d1, d2, d3 ], options);
        //$.plot($("#placeholder2"), [ d1pron, d2pron, d3pron ], options);

    ctx.putImageData(imageData,0,0);
    //return newImageData;
}