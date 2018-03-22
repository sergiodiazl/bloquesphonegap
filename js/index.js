/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyderecha ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);    
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
var canvas=document.getElementById("myCanvas");
var bIzquierda=document.getElementById("izquierda");
var bDerecha=document.getElementById("derecha");
var bPausa=document.getElementById("pausa");
bPausa.addEventListener('touchstart',tocarPausa,false);
bIzquierda.addEventListener('touchstart',moverIzquierda,false);
bDerecha.addEventListener('touchstart',moverDerecha,false);
bIzquierda.addEventListener('touchend',pararIzquierda,false);
bDerecha.addEventListener('touchend',pararDerecha,false);
var ctx = canvas.getContext("2d");
var pelotaRadius=3;
//to move

var x=canvas.width/2;
var y=canvas.height-30;
var dx=2;
var dy=-2;
var paletaHeight=4;
var paletaWidth=55;
var paletaX=(canvas.width-paletaWidth)/2;
var derechaPressed= false;
var izquierdaPressed=false;
var bloquefilas = 5;
var bloqueColumnas = 7;
var bloqueWidth = 30;
var bloqueHeight = 5;
var bloquePadding = 5;
var bloqueOffsetTop = 20;
var bloqueOffsetizquierda = 30;
var puntaje =0;
var vidas = 3;
var pausaPressed=false;

var bloques = [];
for(c=0; c<bloqueColumnas; c++) {
    bloques[c] = [];
    for(r=0; r<bloquefilas; r++) {
         bloques[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function moverIzquierda(e){izquierdaPressed=true;}
function moverDerecha(e){derechaPressed=true;}
function pararIzquierda(e){izquierdaPressed=false;}
function pararDerecha(e){derechaPressed=false;}
function tocarPausa(e){
    if(pausaPressed==true){
        pausaPressed=false;
        requestAnimationFrame(dibujar);
    }else {
        pausaPressed=true
    }
}

function dibujarpelota(){
    ctx.beginPath();
    ctx.arc(x,y,pelotaRadius,0,2*Math.PI);
    ctx.fillstyle="#0033FF";
    ctx.fillStroke="#0033FF";
    ctx.Stroke="10"
    ctx.fill();
    ctx.closePath();
    }

function dibujarpaleta(){
    ctx.beginPath();
    ctx.rect(paletaX,canvas.height-paletaHeight,paletaWidth,paletaHeight);
    ctx.fillstyle="#0095DD";
    ctx.fill();
    ctx.closePath();
    }
function dibujarbloques() {
    for(c=0; c<bloqueColumnas; c++) {
        for(r=0; r<bloquefilas; r++) {
            if(bloques[c][r].status == 1) {
                var bloqueX = (c*(bloqueWidth+bloquePadding))+bloqueOffsetizquierda;
                var bloqueY = (r*(bloqueHeight+bloquePadding))+bloqueOffsetTop;
                bloques[c][r].x = bloqueX;
                bloques[c][r].y = bloqueY;
                ctx.beginPath();
                ctx.rect(bloqueX, bloqueY, bloqueWidth, bloqueHeight);
                ctx.fillStyle = "#00c000";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function dibujarpuntaje() {
    ctx.font = "15px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Puntos: "+puntaje, 8, 20);
}
function dibujarvidas() {
    ctx.font = "15px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Vidas: "+vidas, canvas.width-65, 20);
}
function collisionDetection() {
    for(c=0; c<bloqueColumnas; c++) {
        for(r=0; r<bloquefilas; r++) {
            var b = bloques[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+bloqueWidth && y > b.y && y < b.y+bloqueHeight) {
                    dy = -dy;
                    b.status = 0;
                    puntaje++;
                     if(puntaje == bloquefilas*bloqueColumnas) {
                        navigator.notification.confirm("Ganaste",botonesFin,"Perdiste",["salir","jugar de nuevo"]);
              
                    }

                }
            }
        }
    }
}


function dibujar(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    dibujarbloques();
    dibujarpelota();
    dibujarpaleta();
    dibujarpuntaje();
    dibujarvidas();
    collisionDetection();
 if(x + dx > canvas.width-pelotaRadius || x + dx < pelotaRadius) {dx = -dx;}

 if(y + dy < pelotaRadius) {dy = -dy;}

    else if(y + dy > canvas.height-pelotaRadius) {
        if(x > paletaX && x < paletaX + paletaWidth) {
             if(y= y-paletaHeight){
            dy = -dy  ;
             }
        }
        else {
            vidas--;
            if(!vidas) {
                navigator.notification.confirm("Se acabaron las vidas",botonesFin,"Perdiste",["salir","jugar de nuevo"]);
                //document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paletaX = (canvas.width-paletaWidth)/2;
            }
        }
    }
    if(derechaPressed && paletaX<canvas.width-paletaWidth){paletaX+=7;}

    else if(izquierdaPressed && paletaX>0 ){paletaX-=7;}
         
    x=x+dx;
    y=y+dy;
    if(pausaPressed==false){requestAnimationFrame(dibujar);}
  
    }
function botonesFin(buttonIndex){
    switch(buttonIndex){
        case 2:
        document.location.reload();
        break;
        case 1:
        salir();
        break;
        default:
        document.location.reload();
        break;
    }
    }    
function salir(){
    navigator.app.exitApp();
}
function reiniciar(){document.location.reload();}
dibujar();