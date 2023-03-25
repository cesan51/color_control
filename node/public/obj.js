class Obj{
    pixeles = [];

    //posicion
    xMinima = 0;
    xMaxima = 0;
    yMinima = 0;
    yMaxima = 0;

    grados = 0;

    constructor(x, y){
        this.agregarPixel(x, y);
        this.xMinima = x;
        this.xMaxima = x;
        this.yMinima = y;
        this.yMaxima = y;
    }

    agregarPixel(x, y) {
        this.pixeles.push( {x: x, y: y} );

        if (x < this.xMinima){
                this.xMinima = x;
        }

        if (x > this.xMaxima){
                this.xMaxima = x;
        }

        if (y < this.yMinima){
                this.yMinima = y;
        }

        if (x > this.yMaxima){
                this.yMaxima = y;
        }

        //modo pro

    }

    estaCerca(x, y){

        //Revisar si esta dentro del rectangulo
		if (x >= this.xMinima && x <= this.xMaxima &&
			y >= this.yMinima && y <= this.yMaxima) {

			return true;
		}

		//Tomar la distancia en X y en Y hacia los ejes mas cercanos.
		//Sumamos esas distancias, y comparamos si es menor a algun numero (e.g. 50)
		var distX = 0;
		var distY = 0;

		if (x < this.xMinima) {
			distX = this.xMinima - x;
		}
		if (x > this.xMaxima) {
			distX = x - this.xMaxima;
		}
		if (y < this.yMinima) {
			distY = this.yMinima - y;
		}
		if (y > this.yMaxima) {
			distY = y - this.yMaxima;
		}

		var distancia = distX + distY;

		return distancia < 50;


        /*
        var menorDistancia = -1;
        for (var p=0; p < this.pixeles.length; p++){
            var distancia = Math.sqrt(
                Math.pow(this.pixeles[p].x-x, 2) + 
                Math.pow(this.pixeles[p].y-y, 2)
               
    
            );
            //itera en todos los pixeles del objeto y revisa cual esta mas cerca

            if (menorDistancia == -1 || distancia < menorDistancia) {  
            menorDistancia = distancia;       
            }
        }

        if (menorDistancia <= 50){
            return true;
        }
        return true;
        */

    }  

    dibujar(ctx){
        ctx.strokeStyle="#f00";
        ctx.lineWidth = 4;
        ctx.beginPath();
        var x = this.xMinima;
        var y = this.yMinima;
        var width = this.xMaxima - this.xMinima;
        var height = this.yMaxima - this.yMinima;

        ctx.rect(x, y, width, height);
        ctx.stroke();

        //Dibujar   

        var centroX = x + (width/2);
		var centroY = y + (height/2);

		ctx.beginPath();
		ctx.fillStyle="#00f";
		ctx.arc(centroX, centroY, 5, 0, 2*Math.PI);
		ctx.fill();

		var sumaYIzq = 0;
		var cuentaYIzq = 0;
		var sumaYDer = 0;
		var cuentaYDer = 0;

		for (var p=0; p < this.pixeles.length; p++) {
			if (this.pixeles[p].x <= (x + (width*.1))) {
				sumaYIzq += this.pixeles[p].y;
				cuentaYIzq++;
			} else if (this.pixeles[p].x >= (x + (width*.9))) {
				sumaYDer += this.pixeles[p].y;
				cuentaYDer++;
			}
		}

		ctx.beginPath();
		ctx.fillStyle="#00f";
		ctx.arc(this.xMinima, (sumaYIzq/cuentaYIzq), 5, 0, 2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle="#00f";
		ctx.arc(this.xMaxima, (sumaYDer/cuentaYDer), 5, 0, 2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.strokeStyle = "#0f0";
		ctx.moveTo(this.xMinima, (sumaYIzq/cuentaYIzq));
		ctx.lineTo(this.xMaxima, (sumaYDer/cuentaYDer));
		ctx.stroke();

		var diffY = (sumaYDer/cuentaYDer) - (sumaYIzq/cuentaYIzq);
		var diffX = this.xMaxima - this.xMinima;

		var radianes = Math.atan( diffY / diffX );
		var grados = radianes * (180/Math.PI);
		grados = Math.round(grados);
		//console.log(grados);

		this.grados = grados;
    }
    
}