// General Variables

var CANVASW = 300;
var CANVASH = 300;

var canvas = document.getElementById("canvas");
	canvas.width  = CANVASW; 
	canvas.height = CANVASH; 
	canvas.style.border = "2px solid #000";
	canvas.style.background = "rgb(255,255,255)";
	canvas.style.position = "relative"; 
	canvas.style.top = '0px'; 
	canvas.style.left = '0px';
	ctx = canvas.getContext("2d");

var textbox = document.getElementById("filename");
var filename = textbox.value;
var canvas = document.getElementById("canvas");
var img = new Image();


var img_wid;// = img.naturalWidth;
var img_hgt;// = img.naturalHeight;

var can_wid = CANVASW; 
var can_hgt = CANVASH;

// Greyscale
// Noise Generator
// Clean Noise

function loadImages(){  
    img.src = filename;  // Analise after
    img.onload = function(){
    	console.log("hola");
        img_wid = img.naturalWidth;
        img_hgt = img.naturalHeight;
        //canvas.width = wid;
        //canvas.height = hgt;
        ctx.drawImage(img,0,0,img_wid,img_hgt);
    }
}


function zoomMore(ctx){
    ctx.fillStyle="#fff"; 
    ctx.fillRect(0,0,can_wid,can_hgt);
    img_wid = img_wid+10;
    img_hgt = img_hgt+10;
    ctx.drawImage(img,0,0,img_wid,img_hgt);  
}
function zoomMinus(){
    ctx.fillStyle="#fff"; 
    ctx.fillRect(0,0,can_wid,can_hgt);
    img_wid = img_wid-10;
    img_hgt = img_hgt-10;
    ctx.drawImage(img,0,0,img_wid,img_hgt);
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

var theta = 0;
function rotate(ctx){
    var imageData = ctx.getImageData(0,0,300,300);
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

function grayScale(ctx){
    var imageData = ctx.getImageData(0,0,img_wid,img_hgt);
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
