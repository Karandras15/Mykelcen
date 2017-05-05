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
    inputStates = {left:false,right:true,down:false,up:false,space:false};

    const TILE_WIDTH=24, TILE_HEIGHT=24;
    var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost


	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;

	this.draw = function(){
		 
	var lienzo = document.getElementById("canvas"); 
	if(this.state!=Ghost.SPECTACLES){
		
		var context= lienzo.getContext("2d");
		context.beginPath();
		context.moveTo(this.x,this.y+thisGame.TILE_HEIGHT);
		if (this.state==Ghost.NORMAL) {
			context.fillStyle=ghostcolor[this.id];
			}
		else if(this.state==Ghost.VULNERABLE && thisGame.ghostTimer<=100 && thisGame.ghostTimer%10==0){
				context.fillStyle=ghostcolor[5];
			}
		else if(this.state==Ghost.VULNERABLE){
				context.fillStyle=ghostcolor[4];
			}
		context.fillRect(this.x+2,this.y+11,TILE_WIDTH-4,TILE_HEIGHT-13);
		context.arc(this.x+12,this.y+12,10,0,2*Math.PI,true);
		context.fill();
		context.closePath();
		context.fill();
		
		}
		context.beginPath();
		context.fillStyle="white";
		context.arc(this.x+8,this.y+6,4,0,Math.PI*2,false);
		context.arc(this.x+18,this.y+6,4,0,Math.PI*2,false);
		context.fill();
		context.beginPath();
		context.fillStyle="black";
		context.arc(this.x+8,this.y+6,2,0,Math.PI*2,false);
		context.arc(this.x+18,this.y+6,2,0,Math.PI*2,false);
		context.fill();
		context.beginPath();														   									 				   																						

	}; // draw

	    	this.move = function() {
				if (this.x%thisGame.TILE_WIDTH==0 && this.y%thisGame.TILE_HEIGHT==0) {
	    			var columna=Math.floor(this.x/thisGame.TILE_WIDTH);
	    			var fila=Math.floor(this.y/thisGame.TILE_HEIGHT);
	    			var mov=[];
	    			if (thisLevel.isWall(fila+1,columna) == false && this.velY>=0 && thisLevel.getMapTile(fila+1,columna)!=20 && thisLevel.getMapTile(fila+1,columna)!=21) {
	    				mov.push([1,0]);
	    			}
	    			if (thisLevel.isWall(fila-1,columna) == false && this.velY<=0 && thisLevel.getMapTile(fila-1,columna)!=20 && thisLevel.getMapTile(fila-1,columna)!=21) {
	    				mov.push([-1,0]);
	    			}
	    			if (thisLevel.isWall(fila,columna+1) == false && this.velX>=0 && thisLevel.getMapTile(fila,columna+1)!=20 && thisLevel.getMapTile(fila,columna+1)!=21) {
	    				mov.push([0,1]);
	    			}
	    			if (thisLevel.isWall(fila,columna-1) == false && this.velX<=0 && thisLevel.getMapTile(fila,columna-1)!=20 && thisLevel.getMapTile(fila,columna-1)!=21) {
	    				mov.push([0,-1]);
	    			}
	    			if (mov.length==0) {
	    				this.velX=-this.velX;
	    				this.velY=-this.velY;
	    			}
	    			else{
	    				var rand=Math.floor(Math.random()*mov.length);
	    				this.velX=mov[rand][1];
	    				this.velY=mov[rand][0];
	    				this.x+=this.velX;
	    				this.y+=this.velY;
	    			}
	    		}
	    		else{
	    			this.x+=this.velX;
	    			this.y+=this.velY;
	    		}
			};

	}; // fin clase Ghost

	 // static variables
	  Ghost.NORMAL = 1;
	  Ghost.VULNERABLE = 2;
	  Ghost.SPECTACLES = 3;

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
					if (this.getMapTile(i,j)==10) {
						var fantasma=ghosts[0];
						fantasma.homeX=j*thisGame.TILE_WIDTH;
						fantasma.homeY=i*thisGame.TILE_HEIGHT;
					}
					if (this.getMapTile(i,j)==11) {
						var fantasma=ghosts[1];
						fantasma.homeX=j*thisGame.TILE_WIDTH;
						fantasma.homeY=i*thisGame.TILE_HEIGHT;
					}
					if (this.getMapTile(i,j)==12) {
						var fantasma=ghosts[2];
						fantasma.homeX=j*thisGame.TILE_WIDTH;
						fantasma.homeY=i*thisGame.TILE_HEIGHT;
					}
					if (this.getMapTile(i,j)==13) {
						var fantasma=ghosts[3];
						fantasma.homeX=j*thisGame.TILE_WIDTH;
						fantasma.homeY=i*thisGame.TILE_HEIGHT;
					}
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

		 this.powerPelletBlinkTimer++;
		if(this.powerPelletBlinkTimer==60){
			this.powerPelletBlinkTimer=0;
		}
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

		this.checkIfHit = function(playerX, playerY, x, y, holgura){
		
			var holguraX=Math.abs(playerX-x);
			var holguraY=Math.abs(playerY-y);
			if(holguraX<holgura && holguraY<holgura){
				return true;
			}
			else{
				return false;
			}															 																								  												
		};


		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};
			if(playerX >= 459 && playerY == 288 && row == 12 &&col >= 19) {
				player.x = 24;
			}
			if(playerX <= 21 && playerY == 288 && row == 12 &&col <= 1) {
				player.x = 456;
			}
			if(playerX == 240 && playerY <= 21 && row <= 1 &&col <= 10) {
				player.y = 552;
			}

			if(playerX == 240 && playerY >= 555 && row >= 23 &&col <= 10) {
				player.y = 24;
			}
			var posx=Math.floor(playerX/thisGame.TILE_WIDTH);
			var posy=Math.floor(playerY/thisGame.TILE_HEIGHT);
			if (this.getMapTile(row,col)==tileID['pellet']) {
					this.pellets--;
					this.setMapTile(row,col,"0");
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
				    }
				}
				if (this.getMapTile(row,col)==tileID['pellet-power']) {
					this.pellets--;
					this.setMapTile(row,col,"0");
					thisGame.ghostTimer=360;
					if(thisLevel.pellets==0){
				    	console.log("GAME OVER");
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
		for (var i = 0; i <numGhosts; i++) {
			if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,thisGame.TILE_WIDTH/2)){
				console.log("Te han comido");
			}
		}
		

	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
        var lienzo = document.getElementById("canvas"); 
		var context= lienzo.getContext("2d");
		
		context.fillStyle='yellow';
        context.beginPath();
		context.moveTo(player.x+TILE_WIDTH/2,player.y+TILE_HEIGHT/2);
		if (inputStates.right == true) {
        	context.arc(player.x+TILE_WIDTH/2,player.y+TILE_HEIGHT/2,player.radius,Math.PI*player.angle2,(Math.PI*player.angle1),true);
        }
        else if (inputStates.left == true) {
        	context.arc(player.x+TILE_WIDTH/2,player.y+TILE_HEIGHT/2,player.radius,Math.PI*player.angle2-((180*Math.PI)/180),(Math.PI*player.angle1)-((180*Math.PI)/180),true);
        }
        else if (inputStates.up == true) {
        	context.arc(player.x+TILE_WIDTH/2,player.y+TILE_HEIGHT/2,player.radius,Math.PI*player.angle2-((90*Math.PI)/180),(Math.PI*player.angle1)-((90*Math.PI)/180),true);
        }
        else if (inputStates.down == true) {
        	context.arc(player.x+TILE_WIDTH/2,player.y+TILE_HEIGHT/2,player.radius,Math.PI*player.angle2+((90*Math.PI)/180),(Math.PI*player.angle1)+((90*Math.PI)/180),true);
        }
        context.closePath();
        context.fill();		
    };

	var player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0
	};

	var thisLevel = new Level(canvas.getContext("2d"));
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


    var updateTimers = function(){
	 if (thisGame.ghostTimer==0) {
        	estado=Ghost.NORMAL;
        }
        if(thisGame.ghostTimer>0){
        	estado=Ghost.VULNERABLE;
        	thisGame.ghostTimer--;
        }
        for (var i = 0; i < numGhosts; i++) {
        	if (ghosts[i].state !=Ghost.SPECTACLES) {
        		ghosts[i].state=estado;
        	}
        }
    };

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();

	for (var i = 0; i <numGhosts; i++) {
	    	ghosts[i].move();
	    }

	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	for (var i = 0; i <numGhosts; i++) {
	    	ghosts[i].draw();
	    }


 
	player.draw();

	updateTimers();
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
		for (var i = 0; i < numGhosts; i++) {
			var fantasma=ghosts[i];
			fantasma.x=fantasma.homeX;
			fantasma.y=fantasma.homeY;
			var velocidades= [[-fantasma.speed,0],[fantasma.speed,0],[0,fantasma.speed],[0,-fantasma.speed]];
			var rand=Math.floor(Math.random()*4);
			fantasma.velX=velocidades[rand][0];
			fantasma.velY=velocidades[rand][1];
		}
	// Inicializa los atributos x,y, velX, velY, speed de la clase Ghost de forma conveniente
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
        start: start,
	ghosts: ghosts,
        thisLevel: thisLevel
    };
};



  var game = new GF();
  game.start();


test('Cazando fantasmas', function(assert) {

	// ponemos un power-pellet en 16,14, justo a la derecha de donde sale Pacman
	game.thisLevel.setMapTile(16,14,3);
	// esperamos unos segundos. Se supone que Pacman recoge la píldora de poder y los fantasmas deben ponerse azules

  	var done = assert.async();
  	setTimeout(function() {
		for (var i=0; i < 4; i++){
			assert.ok( game.ghosts[i].state == 2, "Los fantasmas son vulnerables");
		}

	 done();

  }, 3000);

});



test('Cazando fantasmas (ii)', function(assert) {

	// A los 8 segundos, los fantasmas deben volver a su color original 

  	var done = assert.async();
  	setTimeout(function() {
		for (var i=0; i < 4; i++){
			assert.ok( game.ghosts[i].state == 1, "Los fantasmas vuelven a ser normales");
		}

	 done();

  }, 8000);

});

