function getCanvasDC()// возврат конекста
{
  return document.getElementById("myCanvas").getContext("2d");
}


function write(str)
{
  document.getElementById("vvod").innerHTML +="<br>"+ str;
}


function drawCell(x,y,h,w,off,filler)//рисование ячейки
{
  x+=off;
  y+=off;
  h-=off*2;
  w-=off*2;
  // cxt.strokeStyle = "white";
  // cxt.lineWidth = "10";
  cxt.fillStyle = filler;
  cxt.fillRect(x,y,h,w);
  //  cxt.rect(x,y,h,w);
  cxt.stroke();
}


function clearArray(ar,max)//очистка массива
{
  for(i=0;i<max;i++)ar[i] = 0;
}

function drawCell2(x,y,color)
{
  drawCell(x*30,y*30,30,30,1,color);
}


function drawPole(ar)// рисование поля
{ 
  cxt.globalAlpha = 1;
  cxt.fillStyle = "#fff";
  cxt.fillRect(0,0,300,450);
  cxt.stroke();
  //очистка
  
  var color;
  for(i=0; i<15; i++)
  {
    if(delLines.length!=0)
    {
      cxt.globalAlpha = 1;
      for(var ss in delLines)if(delLines[ss] == i){cxt.globalAlpha = alpha;}
    }
    for(j=0; j<10; j++) 
    {
      color = mColor[ar[i*10+j]] 
      drawCell2(j,i,color);
    }
  }
}


function getCoord(co,max)//вычисление координат из индекса
{
  ret_y = Math.floor(co/max);      
  ret_x = co-ret_y*max;
  return {x:ret_x,y:ret_y};
}

function getInd(x,y,max)//вычисление индекса из координат
{
  return y*max+x;
}


function isAddFig(ar,fi,x,y)//проверка не выходит ли за границы
{
  for(i=0;i<16;i++)
  {
    if(fi[i]==0)continue;
    vr_x = x+getCoord(i,4).x;
    vr_y = y+getCoord(i,4).y;
    if(vr_x<0 || vr_x>9 || vr_y<0 || vr_y>14 )return false;
    if(ar[getInd(vr_x,vr_y,10)]!=0)return false;
  }
  return true;  
}


function addFig(ar,fon,fi,x,y)//добавление фигуры к фону
{
  if(!isAddFig(fon,fi,x,y))return false;//проверка не выходит ли за границы
  
  for(i=0;i<16;i++)//собственно добавление
  {
    if(fi[i]==0)continue;
    var vr_x = x+getCoord(i,4).x;
    var vr_y = y+getCoord(i,4).y;
    ar[vr_y*10+vr_x] = fi[i];
  }
  return true;
}
    
    
function rotFig(fig,n)//поворот фигуры n раз
{
  var ret = new Array(16);
  for(i=0;i<16;i++) ret[i] = fig[i];

//--------уменьшение прямоугольника поворота
  max = 4;
  do
  { 
    var i;
    old_max = max;
    for(i=0;i<max;i++)
    {
      if(fig[getInd(max-1,i,4)]!=0 || fig[getInd(i,max-1,4)]!=0)break;
    }
    if(i==max)max-=1;
  }while(old_max != max);


  for(raz = 0; raz<n; raz++)//поворот N раз
  {
  for(j=0;j<max;j++)
  for(i=0;i<max;i++)
    ret[getInd(max-1-j,i,4)] = fig[getInd(i,j,4)];
  //******************
  if(!isAddFig(pole,ret,x_fig,y_fig))
    if(isAddFig(pole,ret,x_fig+1,y_fig))x_fig+=1;
    else  if(isAddFig(pole,ret,x_fig-1,y_fig))x_fig-=1;
    else  return fig  //если после поворота выйдет за границы
  //------------------
  for(i=0;i<16;i++) fig[i]  = ret[i];
  }
  return ret;
}


function copyArr(ar1, ar2, max)
{
  for(i=0;i<max;i++)ar1[i] = ar2[i];
}

function draw()
{
  copyArr(DPole,pole,150);

//тень
  var y_shadow = findFloor()+1;
  if(y_fig!=y_shadow)
  addFig(DPole,pole,getShadow(),x_fig,y_shadow);
//

  addFig(DPole,pole,figura,x_fig,y_fig);  
  drawPole(DPole);      
}


function findLine(ar)
{
  delLines.length = 0;

  for(i=0; i<15; i++)
    for(j=0; j<10; j++)
      if(ar[getInd(j,i,10)]==0)break;
      else if(j==9)delLines.push(i);

delLines.sort();
}

function clearLine(ar,line)
{
  for(var k = 0 ; k<line.length; k++)
    {
     var lines = line[k];

      for(i=lines; i>0; i--)
      for(j=0; j<10; j++)
        ar[getInd(j,i,10)]=ar[getInd(j,i-1,10)];
    }
}

function rnd(begin,end)
{
  var interval = end - begin;
  var ret = Math.random()*interval+begin;
  
  return Math.round(ret);
}


function nextFig()
{
x_fig = 4;
y_fig = 0;    

figura = rotFig(fig[rnd(0,6)], rnd(1,3));

currentColor = rnd(1,7);

for(var i = 0; i<16; i++)
  if(figura[i]!=0)figura[i] = currentColor;

}


function onAddFig(s)
{
  switch(s)
  {
    case 1:
      if(addFig(DPole,pole,figura,x_fig-1,y_fig))x_fig-=1;
      break;
    case 2:
      if(addFig(DPole,pole,figura,x_fig+1,y_fig))x_fig+=1;
      break;
    case 3://-------------------------------------------------------
      if(addFig(DPole,pole,figura,x_fig,y_fig+1))
      {
        y_fig+=1;
      }
      else
      {
        if(y_fig==0)
        {
          clearInterval(ti);
          write("Game Over");

          audioElement.src = "7uphaha.mp3"
          audioElement.loop = false;
          audioElement.play();
        }
        
        findLine(DPole)
        if(delLines.length>0)
        {
          clearInterval(ti);
          kol = 10;
          delTimer = window.setInterval('delAnima()',50);
        }
else
{
          copyArr(pole,DPole,150);
        nextFig();

}        
      }
      break;
    case 4:
      if(addFig(DPole,pole,figura,x_fig,y_fig-1))y_fig-=1;
      break;
  }
}

function probel()
{
    y_fig = findFloor();
    onAddFig(3);
    draw();
    onAddFig(3);
    
    audioEl.play();
}

function rrot()
{
figura = rotFig(figura,1);
}


function pressKey(evt)//функция отклика на клавиатуру
{
  evt =(evt)? evt: event;
  switch (evt.keyCode)
  {
    case 38:
    rrot();
    break;
    
    case 40:
    onAddFig(3);
    
    break;
    
    case 37:
    onAddFig(1);
    break;
    
    case 39:
    onAddFig(2);
    break;
    
    case 32:
    probel();
    break;
    
    
    default:
  
  }
  draw();
}

function go()//отклит на таймер
{
  onAddFig(3)
  draw();
}

function findFloor()
{
  var floor = y_fig;
  
  while(isAddFig(pole,figura,x_fig,floor))
  {
    floor+=1;
  }
  floor-=2;  

  return floor;
}


function getShadow()
{
var fig = new Array(16);
for(var i = 0 ; i<16; i++)
  fig[i] = (figura[i]!=0 ? 8 : 0); 

return fig;
}



var cxt = getCanvasDC();
var pole = new Array(150); //поле

clearArray(pole,150);

var DPole = new Array(150);//поле что будет выводится
clearArray(DPole,150)


var delLines = new Array();

fig = [ [0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0],  // S
      [1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0],  // Z
      [1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0],  // J
      [1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0],  // L
      [1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0],  // T
      [1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0],  // O
      [0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0] ];  // I
            
mColor = ["#fff", //eee
          "#f00",
          "#f60",
          "#fc0",
          "#0c3",
          "#09f",
          "#009",
          "#66c",
          "#bbb",
          "rgba(255,0,0,1)"];      

var currentColor = 0;

var x_fig = 3;
var y_fig = 0;

figura = fig[6];


//-----------
for(var i=0; i<40; i++)
pole[i+110] = 5;
pole[110] = 0;
pole[120] = 0;
pole[130] = 0;
pole[140] = 0;
//------------

drawPole(DPole);

document.onkeydown = pressKey;

var audioElement = document.createElement('audio');
audioElement.setAttribute('src','main-back.mp3.mp3');
audioElement.loop = true;
audioElement.preload = 'auto';
audioElement.load();

audioElement.play();

var audioEl = document.createElement('audio');
audioEl.setAttribute('src','down.mp3');


var ti = window.setInterval('go()',1000);
window.onload = ti;


function include(url){
  var script = document.createElement('script');
  script.setAttribute('type','text/javascript');
  script.setAttribute('src',url);
  document.getElementsByTagName('head').item(0).appendChild(script);
}
  
var delTimer;
var delLines = new Array();

var kol = 10;

var alpha = 1;


function delAnima()
{
  alpha = kol/10;
    
  kol-=1;
  drawPole(DPole);

  if(kol==0){

  alpha = 1;

    
    clearInterval(delTimer);
    clearLine(DPole,delLines);
    delLines.length =  0;
     ti = window.setInterval('go()',1000);
     drawPole(DPole);

	copyArr(pole,DPole,150);
	nextFig();
     
  } 
    
}
    
    
function bindReady(handler){
    var called = false
    function ready() { // (1)
        if (called) return
        called = true
        handler()
    }
    if ( document.addEventListener ) {
        document.addEventListener( "DOMContentLoaded", function(){
            ready()
        }, false )
    } else if ( document.attachEvent ) {
        if ( document.documentElement.doScroll && window == window.top ) {
            function tryScroll(){
                if (called) return
                if (!document.body) return
                try {
                    document.documentElement.doScroll("left")
                    ready()
                } catch(e) {
                    setTimeout(tryScroll, 0)
                }
            }
            tryScroll()
        }
        document.attachEvent("onreadystatechange", function(){
            if ( document.readyState === "complete" ) {
                ready()
            }
        })
    }
    // (4)
    if (window.addEventListener)
        window.addEventListener('load', ready, false)
    else if (window.attachEvent)
        window.attachEvent('onload', ready)
}


function ffr()
{
  write('START');
}


bindReady(ffr);
