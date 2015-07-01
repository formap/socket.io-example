var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)
var Bunny = require('../shared/Bunny.js')
var KeyboardJS = require('../utility/Keyboard.js')

// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.WebGLRenderer(800, 600);

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// This creates a texture from a 'bunny.png' image.
var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
var bunny = new PIXI.Sprite(bunnyTexture);
bunny.model = new Bunny(Math.random()*0xFFFFFF + 0xFF000000);
bunny.tint = bunny.model.color
global.bunny = bunny
var otherBunnies = {}

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)

// Add the bunny to the scene we are building.
stage.addChild(bunny);

// kick off the animation loop (defined below)
animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);
    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

socket.on('update_position', function (params) {
  var sprite = otherBunnies[params.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    otherBunnies[params.id] = sprite
    sprite.anchor.set(0.5, 0.5)
    sprite.model = params.model;
    sprite.tint = sprite.model.color
  }
  sprite.position.x = params.pos.x
  sprite.position.y = params.pos.y
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('new_player', {model: bunny.model})
  //socket.emit('update_position', {pos: bunny.position, model: bunny.model})
})

socket.on('disconnection', function (id) {
  stage.removeChild(otherBunnies[id])
  delete otherBunnies[id];  
})
// npm install --save browserify
//
// npm run <script-name>
// npm run buildi
//
// node index.js
// http-server . <-p port>
