

var video;
var canvas;
var altoCamara = 720;
var anchoCamara = 720;

var amarillo = {r:255, g:255, b:0};
var distanciaAceptableColor = 166;

var sensibilidadGiro = 1.3;



function mostrarCamara(){
    video = document.getElementById("video")
    canvas = document.getElementById("canvas")

 var opciones={
    audio: false,
    video:{
       width: anchoCamara, height: altoCamara 
    }
 };
  if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(opciones)
      .then(function(stream){
          video.srcObject = stream;
          procesarCamara();
        })

       .catch(function(err){
         console.log("error brutal, apaga tu equipo y reinicia tu celular",err);
        })
 }else{
    console.log("no existe la funcion getUserMedia");
 }

}

function procesarCamara() {
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, anchoCamara, altoCamara, 0, 0, canvas.width, canvas.height);
    
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixeles = imgData.data;
    
   // var pixelMasAmarillo = null;
   // var menorDistancia = null;

   /*var sumaX = 0;
   var sumaY = 0;
   var cuenta = 0;*/

    var objs = [];

    for(var p=0; p <pixeles.length; p += 4){
        var rojo = pixeles[p];
        var verde = pixeles[p+1];
        var azul = pixeles[p+2];
        var alpha = pixeles[p+3];

        var distancia = Math.sqrt(
            Math.pow(amarillo.r-rojo, 2) + 
            Math.pow(amarillo.g-verde, 2) + 
            Math.pow(amarillo.b-azul, 2) 

        );

        if (distancia < distanciaAceptableColor){
            //pintar el pixel de rojo
            //pixeles[p] =  255;  //r
            //pixeles[p+1] =  0;  //g
            //pixeles[p+2] =  0;  //b

           // cuenta++;

            var y = Math.floor(p / 4 / canvas.width);
            var x = (p /4) % canvas.width;

            //Agrupacion
            if (objs.length == 0){
                //mi primer obj
                var obj = new Obj(x, y); 
                objs.push(obj);
            }else{
                //revisar si esta cerca, Si sí, me uno a el
                //Si no creo uno nuevo

                var encontrado = false
                for (var pl=0; pl < objs.length; pl++){
                    if (objs[pl].estaCerca(x, y)){
                        objs[pl].agregarPixel(x, y);
                        encontrado = true;  
                        break;
                    }

                }

                if(!encontrado){
                    var obj = new Obj(x, y);
                    objs.push(obj)
                }
            }

          /*  sumaX += x;
            sumaY += y;
            cuenta++;*/

        }else{

        }


       /*
        if(menorDistancia == null || distancia <menorDistancia){
            menorDistancia = distancia;

            var y = Math.floor(p / 4 / canvas.width);
            var x = (p /4) % canvas.width;

            pixelMasAmarillo = {x: x, y: y };
        }*/

    }
    ctx.putImageData(imgData, 0, 0);

    objs = unirObjs(objs);

    var masGrande = null;
    var mayorTamano = -1;

    for (var pl=0; pl <objs.length; pl++){
        var width = objs[pl].xMaxima - objs[pl].xMinima;
        var height = objs[pl].yMaxima - objs[pl].yMinima;
        var area = width = height;

        if (area <1500){
            if(masGrande === null || area > mayorTamano){
                masGrande = objs[pl];
                mayorTamano = area;
            }

            //objs[pl].dibujar(ctx);
        }    
    }

    if (masGrande !== null){
        masGrande.dibujar(ctx);

        document.getElementById("info").innerHTML = masGrande.grados;
		var base = 270;
		var nuevosGrados = base + (masGrande.grados*-1) * sensibilidadGiro;
		document.getElementById("carrito")
		    .style.transform="rotate(" + nuevosGrados + "deg)";


        var ancho = masGrande.xMaxima - masGrande.xMinima;
            
        enviarMovimiento(masGrande.grados, masGrande.yMinima, ancho);    
    }

    //console.log(objs.length);

   /* if(cuenta > 0){
        ctx.fillStyle="#00f";
        ctx.beginPath();
        ctx.arc(sumaX/cuenta, sumaY/cuenta, 10, 0, 2*Math.PI);
        ctx.fill();

    }*/
    
    setTimeout(procesarCamara, 20);
    
}

/**
 * Esta funcion tiene como objetivo recibir un arreglo de objetos "Platanete" que pueden tener
 * intersecciones entre ellos (rectangulos dentro de otros rectangulos, o con cualquier interseccion)
 *
 * Regresa un arreglo en donde, si encontro intersecciones, une esos objetos.
 *
 * Es decir puede regresar el mismo arreglo, o uno con menos objetos (pero mas grandes)
 *
 * La verdad no tiene que ser recursivo pero asi se me ocurrio en el momento HOH
 */
function unirObjs(objs) {
	var salir = false;

	//Comparamos todos contra todos
	for (var p1=0; p1 < objs.length; p1++)  {
		for (var p2=0; p2 < objs.length; p2++) {

			if (p1 == p2) continue; //Si es el mismo, no lo consideres, y ya

			var obj1 = objs[p1];
			var obj2 = objs[p2];

			//Intersectan?
			var intersectan = obj1.xMinima < obj2.xMaxima &&
				obj1.xMaxima > obj2.xMinima &&
			    obj1.yMinima < obj2.yMaxima && 
			    obj1.yMaxima > obj2.yMinima;

		    if (intersectan) {
		    	//Sip... pasar los pixeles del p2 al p1
		    	for (var p=0; p < obj2.pixeles.length; p++) {
		    		obj1.agregarPixel(
		    			obj2.pixeles[p].x,
		    			obj2.pixeles[p].y
	    			);
		    	}
		    	//borrar el p2
		    	objs.splice(p2, 1);
		    	salir = true;
		    	break;
		    }

		}

		if (salir) {
			break;
		}
	}

	//Si encontre una interseccion, reprocesemos todo de nuevo
	//con el arreglo modificado
	if (salir) {
		return unirObjs(objs);
	} else {
		//Ya no hubo intersecciones, salir
		return objs;
	}
}

var lastUrl = null;

function enviarMovimiento(grados, yMinima, ancho){
    var movimiento = "0";

    if(grados >= 15){
        movimiento = "-1";
    }else if(grados <= -18){
        movimiento = "1";

    }

    var saltar = "0";
    if (yMinima <= 30){
        saltar = "1"
    }

    var acelerar = "0";
    //console.log(ancho)
    if (ancho >= 200){
        acelerar = "1";
    }
   

    var url = "http://localhost:3000/?movimiento=" + movimiento + "&saltar=" + saltar + "&acelerar=" + acelerar;


    if (lastUrl === null || url !== lastUrl ){
        lastUrl = url;

        $.get(url, function (response) {
            console.log(response);
        });
    }
    
}
