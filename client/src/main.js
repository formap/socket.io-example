var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)
var Bunny = require('../../shared/Bunny.js')
var KeyboardJS = require('../../utility/Keyboard.js')

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

socket.on('connect', function () {
  console.log('connected')
  console.log(socket.id)
  socket.emit('update_position', {pos: bunny.position, model: bunny.model})
})

socket.on('get_players', function (params) {
  console.log(params)
  var keys = Object.keys(params.players)
  var i = 0
  if (params.players !== {}) {
    for (i=0;i<keys.length;++i) {
      console.log('key ' + keys[i] + ' player params ' + params.players[keys[i]])
      var sprite = new PIXI.Sprite(bunnyTexture)
      sprite.anchor.set(0.5, 0.5)
      sprite.model = params.players[keys[i]].model
      sprite.tint = sprite.model.color
      sprite.position.x = params.players[keys[i]].pos.x
      sprite.position.y = params.players[keys[i]].pos.y
      otherBunnies[keys[i]] = sprite
      stage.addChild(sprite)
    }
  }
})

socket.on('update_position', function (params) {
  var sprite = otherBunnies[params.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    console.log('adding bunny to otherBunnies with id ' + params.id)
    otherBunnies[params.id] = sprite
    sprite.anchor.set(0.5, 0.5)
    sprite.model = params.model;
    sprite.tint = sprite.model.color
  }
  sprite.position.x = params.pos.x
  sprite.position.y = params.pos.y
})

socket.on('delete_player', function (id) {
  console.log('client with socket id ' + id + ' has disconected in client with socket id ' + socket.id)
  console.log(otherBunnies[id])
  stage.removeChild(otherBunnies[id])
  delete otherBunnies[id];
})
