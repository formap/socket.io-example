//////movement vars
var debug = false;
var KeyboardJS = require('./Keyboard.js')
var keyboard = new KeyboardJS(debug)

//////player stuff
var Player = require('./player.js')
var player = new Player( 'player.png', 0.1, 5)

//var speed = 0.1;
//var maxSpeed = 5;
//var speedXY = {x:0, y:0};

var speedRed = 0.05;

//////server vars
var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

//////pixiejs stuff
var renderer = new PIXI.WebGLRenderer(800, 600);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

//var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
//var bunny = new PIXI.Sprite(bunnyTexture);

//global.bunny = bunny REPLACED
global.player = player
var otherPlayers = {}
//bunny.position.x = Math.random() * 800
//bunny.position.y = Math.random() * 600
//bunny.anchor.set(0.5, 0.5)
//stage.addChild(bunny);

player.sprite.position.x = Math.random() * 800
player.sprite.position.y = Math.random() * 600
stage.addChild(player.sprite);

Play();

function Play() {
	requestAnimationFrame(Play);	
	var isMoving = updateSpeed()	
	if(isMoving){
		reduceSpeed();
		socket.emit('update_position', player.sprite.position);
		animate();
	}	
	renderer.render(stage);	
}
function updateSpeed(){
		
		if (keyboard.char('D')){
			player.speed.x  += player.acceleration;
			if(player.speed.x > player.maxSpeed) player.speed.x = player.maxSpeed;
		}
		if (keyboard.char('A')){
			player.speed.x  -= player.acceleration;
			if(player.speed.x < -player.maxSpeed) player.speed.x = -player.maxSpeed;
		}
		if (keyboard.char('W')){
			player.speed.y  -= player.acceleration;
			if(player.speed.y > player.maxSpeed) player.speed.y = player.maxSpeed;
		}
		if (keyboard.char('S')){
			player.speed.y  += player.acceleration;
			if(player.speed.y < -player.maxSpeed) player.speed.y = -player.maxSpeed;
		}	
		return (player.speed.x != 0 || player.speed.y != 0);
	}

function animate() {
    player.sprite.position.x  += player.speed.x;
	player.sprite.position.y  += player.speed.y;	
}
function reduceSpeed() {
		if(player.speed.x > 0){
			player.speed.x -= speedRed;
			if(player.speed.x < 0) player.speed.x = 0;
		}
		else if(player.speed.x < 0){
			player.speed.x += speedRed;
			if(player.speed.x > 0) player.speed.x = 0;
		}
		if(player.speed.y > 0){
			player.speed.y -= speedRed;
			if(player.speed.y < 0) player.speed.y = 0;
		}
		else if(player.speed.y < 0){
			player.speed.y += speedRed;
			if(player.speed.y > 0) player.speed.y = 0;
		}
	}

socket.on('update_position', function (pos) {
  var otherPlayer = otherPlayers[pos.id]
  if (!otherPlayer) {
    otherPlayer = new Player('player.png')
    stage.addChild(otherPlayer.sprite)
    otherPlayers[pos.id] = otherPlayer
  }
  otherPlayer.sprite.position.x = pos.x
  otherPlayer.sprite.position.y = pos.y
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('update_position', player.sprite.position)
})
// npm install --save browserify
//
// npm run <script-name>
// npm run build
//
// node index.js
// http-server . <-p port>
