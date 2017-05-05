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
			}else if(line[line.length-2]=='lvlheight'){
				this.lvlHeight=line[line.length-1];
			}
			linea++;
			while(list[linea][0]!='#'){
				linea++;
			}
			var line=list[linea].split(' ');
			if(line[line.length-2]=='lvlwidth') {
				this.lvlWidth=line[line.length-1];
			}else if(line[line.length-2]=='lvlheight'){
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
					if (this.getMapTile(i,j)==4){
						player.homeX=j*thisGame.TILE_WIDTH;
						player.homeY=i*thisGame.TILE_HEIGHT;
					}if (this.getMapTile(i,j) == 3 || this.getMapTile(i,j)== 2){
						this.pellets ++;
					}
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
					ctx.beginPath();
					ctx.moveTo(columna*TILE_WIDTH,fila*TILE_HEIGHT)
					var numElemento=this.getMapTile(fila,columna);
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


		this.isWall = function(row, col) {
			if (this.getMapTile(row,col)>=100 && this.getMapTile(row,col)<=199) {
				return true;
			}
			else{
				return false;
			}
		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
				var sigx=possiblePlayerX+thisGame.TILE_WIDTH;
				var sigy=possiblePlayerY+thisGame.TILE_HEIGHT;
				for (var j = col-1; j <=col+1; j++) {
					for (var i = row-1; i <=row+1; i++) {
						if (this.isWall(i,j)) {
							posx=j*thisGame.TILE_WIDTH;
							posy=i*thisGame.TILE_HEIGHT;
							pos2x=j*thisGame.TILE_WIDTH+thisGame.TILE_WIDTH;
							pos2y=i*thisGame.TILE_HEIGHT+thisGame.TILE_HEIGHT;
	       					var x_overlap = Math.max(0, Math.min(sigx, pos2x) - Math.max(possiblePlayerX, posx));
	       					var y_overlap = Math.max(0, Math.min(sigy, pos2y) - Math.max(possiblePlayerY, posy));
	  						overlapArea = x_overlap * y_overlap;
							if(overlapArea>0){
								return true;
							}
						}
					}
				}
				return false;
		};

		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};
			var posx=Math.floor(playerX/thisGame.TILE_WIDTH);
			var posy=Math.floor(playerY/thisGame.TILE_HEIGHT);
			if (posx==col && posy==row) {
				if (this.getMapTile(row,col)== 2 || this.getMapTile(row,col)== 3) {
					this.pellets--;
					this.setMapTile(row,col,"0");
				}
			}
		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {
		
		var siguentex=this.x+this.velX;
	    var siguientey=this.y+this.velY;
	    var fila=Math.floor(siguientey/thisGame.TILE_HEIGHT);
	    var columna=Math.floor(siguentex/thisGame.TILE_WIDTH);
		if(player.x + player.velX > w-20 || player.x + player.velX < 0){
			player.velX = 0;
		}
		if(player.y + player.velY > h-20 || player.y + player.velY < 0){
			player.velY = 0;
		}
		if (thisLevel.checkIfHitWall(siguentex,siguientey,fila,columna)) {
		    player.velX = 0;
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
		thisLevel.checkIfHitSomething(this.x, this.y, fila, columna);


	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {

	   var lienzo = document.getElementById("canvas"); 
		var context= lienzo.getContext("2d");
		context.beginPath();
		context.arc(player.x+player.radius,player.y+player.radius,player.radius,player.angle2*Math.PI,player.angle1*Math.PI,true);
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
 
	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

 
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

    var reset = function(){
		player.velX=player.speed;
	    player.velY=0;
		player.x=player.homeX;
		player.y=player.homeY;
    };

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
        document.onkeydown = addListeners;

	reset();

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


  var numPellets = thisLevel.pellets;

test('Comiendo pi`ldoras', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		assert.ok( numPellets - 2 == thisLevel.pellets  , "Pacman comienza movi'endose hacia el este. Al parar, habra' comido dos pi'ldoras" );
    		   done();
  }, 1000);

});

