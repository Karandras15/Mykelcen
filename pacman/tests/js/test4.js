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

	var Pacman = function() {
		this.radius = 15;
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
		context.arc(player.x+15,player.y+15,15,0.25*Math.PI,0.75*Math.PI,true);
		context.stroke();
		context.fillStyle="yellow";
		context.fill();  	         
    }
  
	// OJO, esto hace a pacman una variable global	
	player = new Pacman();



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

 test('Testeando pos. inicial', function(assert) {  

	     	assert.pixelEqual( canvas, player.x+10, player.y+10, 255, 255,0,255,"Passed!"); 
});

	
test('Movimiento hacia derecha OK', function(assert) {

  	var done = assert.async();
	inputStates.right = true;
  	setTimeout(function() {
			// console.log(player.x);
 		   assert.ok(player.x > 110 && player.x < w, "Passed!");

			inputStates.right = false;
			inputStates.down = true;
    		   done();
			test2();
  }, 1000);

});


var test2 = function(){
test('Movimiento hacia abajo OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.y);
   		        assert.ok(player.y > 110 && player.y < h, "Passed!");
			inputStates.down = false;
			inputStates.left = true;
    		   done();
			test3();
  }, 1000);

});
};

var test3 = function(){
test('Movimiento hacia izquierda OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.x);
   		        assert.ok(player.x == 0 , "Passed!");
			inputStates.left = false;
			inputStates.up = true;
    		   done();
		test4();
  }, 1000);

}); };



var test4 = function(){
test('Movimiento hacia arriba OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.y);
   		        assert.ok(player.y < 10 , "Passed!");
			inputStates.up = false;
    		   done();
  }, 1000);

}); };


