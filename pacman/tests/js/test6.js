// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};


	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
		if (this.map[row]==null) {
			this.map[row]=[];
		}
		this.map[row][col]=newValue;
	};

	this.getMapTile = function(row, col){
		if (this.map[row]==null) {
			return null;
		}
		return this.map[row][col];
	};

	this.printMap = function(){
		// tu código aquí
	};

	this.loadLevel = function(){
		var data=$.ajax({url:'res/levels/1.txt',async:false}).responseText;
			var list=data.split('\n');
			var linea=0;
			
			while(list[linea][0]!='#'){
				linea++;
			}
			var line=list[linea].split(' ');
			if (line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}
			else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			
			linea++;
			while(list[linea][0]!='#'){
				linea++;
			}
			var line=list[linea].split(' ');
			if (line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}
			else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			
			linea++;
			while(list[linea][0]!='#'){
				linea++;
			}
			
			linea++;
			var i=0;
			var j=0;
			while(list[linea][0]!='#'){
				var line=list[linea].split(' ');
				j=0;
				while(line[j]){
					this.setMapTile(i,j,line[j]);
					j++;
				}
				i++;
				linea++;
			}
		
	};

         this.drawMap = function(){

	    	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;

    		var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3
			};
			var fila=0;
			var columna=0;
			while(this.getMapTile(fila,0)){
				columna=0;
				while(this.getMapTile(fila,columna)){
					var numElemento=this.getMapTile(fila,columna);
					ctx.beginPath();
					ctx.moveTo(columna*TILE_WIDTH,fila*TILE_HEIGHT)
					if(numElemento>=100 && numElemento<200){
						ctx.fillStyle='blue';
						ctx.fillRect(columna*TILE_WIDTH,fila*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					else if(numElemento==3){
						ctx.fillStyle='red';
						ctx.arc(columna*TILE_WIDTH+(TILE_WIDTH/2),fila*TILE_HEIGHT+(TILE_HEIGHT/2),4,0,2*Math.PI,true);
						ctx.fill();
					}
					else if(numElemento==2){
						ctx.fillStyle='white';
						ctx.arc(columna*TILE_WIDTH+(TILE_WIDTH/2),fila*TILE_HEIGHT+(TILE_HEIGHT/2),3,0,2*Math.PI,true);
						ctx.fill();
					}
					else if(numElemento==12){
						//Al parecer si no lo pones en negro la casa de los fantasmas no es negra, esto deberia de cambiarse al testearse
						ctx.fillStyle='black';
						ctx.fillRect(columna*TILE_WIDTH,fila*TILE_HEIGHT,TILE_WIDTH,TILE_HEIGHT);
					}
					columna++;
					ctx.closePath();
				}
				fila++;
			}
		 
	};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {

		if(player.x + player.velX > w-30 || player.x + player.velX < 0){
			player.velX = 0;
		}else if(player.y + player.velY > h-30 || player.y +player.velY < 0){
			player.velY = 0;
		}
		
		if(player.velX < 0){
			player.x = player.x + player.velX;
		}else if (player.velX > 0){
			player.x = player.x + player.velX;
		}else if(player.velY < 0){
			player.y = player.y + player.velY;
		}else if(player.velY > 0){
			player.y = player.y + player.velY;
		} 
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
         var lienzo = document.getElementById("canvas"); 
		var context= lienzo.getContext("2d");
		context.beginPath();
		context.arc(player.x+15,player.y+15,player.radius,0.25*Math.PI,0.75*Math.PI,true);
		context.stroke();
		context.fillStyle="yellow";
		context.fill();
  
    };

	var player = new Pacman();

	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	// thisLevel global para poder realizar las pruebas unitarias
	thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};

	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	var checkInputs = function(){
		if(inputStates.left == true){
			player.velX = 0 - player.speed;
			player.velY = 0;
		}else if(inputStates.right == true){
			player.velX = player.speed;
			player.velY = 0;
		}else if(inputStates.up == true){
			player.velY = 0 - player.speed;
			player.velX = 0;
		}else if(inputStates.down == true){
			player.velY = player.speed;
			player.velX = 0;
		}
	
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	player.move();
 
	player.draw();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

   var addListeners = function(evento){
		if(evento.keyCode == 37){
			inputStates.left = true;
			inputStates.right = false;
			inputStates.down = false;
			inputStates.up = false;
		}else if(evento.keyCode == 38){
			inputStates.up = true;
			inputStates.left = false;
			inputStates.right = false;
			inputStates.down = false;
		}else if(evento.keyCode == 39){
			inputStates.right = true;
			inputStates.left = false;
			inputStates.up = false;
			inputStates.down = false;
		}else if(evento.keyCode == 40){
			inputStates.down = true;
			inputStates.left = false;
			inputStates.up = false;
			inputStates.right = false;
		}
   };


    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
        document.onkeydown = addListeners;
		

	player.x = 0;
	player.y = 0; 
	player.velY = 0;
	player.velX = player.speed;
 
        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};



  var game = new GF();
  game.start();

test('Mapa correctamente dibujado en pantalla', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {


	     	   assert.pixelEqual( canvas,  35,35, 0, 0, 255, 255,"esquina superior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 250,35, 0, 0, 0, 0,"puerta superior negra");
	     	   assert.pixelEqual( canvas, 465,35, 0, 0, 255, 255,"esquina superior derecha azul");
	     	   assert.pixelEqual( canvas, 58,58, 255, 255, 255,255,"primera pi'ldora esquina superior izquierda blanca");
	     	   assert.pixelEqual( canvas, 58,82, 255, 0,0,255,"pi'ldora de poder esquina superior izquierda roja");
	     	   assert.pixelEqual( canvas, 442,82, 255, 0,0,255,"pi'ldora de poder esquina superior derecha roja");

	     	   assert.pixelEqual( canvas, 35,300, 0, 0,0,0 ,"puerta lateral izquierda negra");
	     	   assert.pixelEqual( canvas, 252,300, 0, 0,0, 255,"centro de casa de los fantasmas negro");
	     	   assert.pixelEqual( canvas, 482, 300, 0, 0,0, 0,"puerta lateral derecha negra");
		
		   assert.pixelEqual( canvas, 12, 585, 0, 0,255,255,"esquina inferior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 60, 538, 0, 0,255,255,"cuadrado interior esquina inferior izquierda azul");
	     	   assert.pixelEqual( canvas, 250,538, 255, 255,255,255,"pi'ldora central lateral inferior blanca");
	     	   assert.pixelEqual( canvas, 442,538, 0, 0,255,255,"cuadrado interior esquina inferior derecha azul");
		   assert.pixelEqual( canvas, 488,582, 0, 0,255,255,"esquina inferior derecha azul"); 

    		   done();
  }, 1000);

});

