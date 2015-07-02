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

// Managing players
var bunnyTexture = PIXI.Texture.fromImage('img/bunny.png');
var bunny = new PIXI.Sprite(bunnyTexture);
bunny.model = new Bunny(Math.random()*0xFFFFFF + 0xFF000000);
bunny.tint = bunny.model.color
global.bunny = bunny
var otherBunnies = {}

// Managing pickups
var pickupTexture = PIXI.Texture.fromImage('img/coin.png')
var pickups = {}

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)

// Add the bunny to the scene we are building.
stage.addChild(bunny);

console.log(KeyboardJS)
//keyboard utility
var keyboard = new KeyboardJS(true); //true for debug feedback

// kick off the animation loop (defined below)
animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    var moving = false
    //keyboard movement
    if (keyboard.char('W')) {
      bunny.position.y -= 5;
      moving = true
    }
    if (keyboard.char('S')) {
      bunny.position.y += 5
      moving = true
    }
    if (keyboard.char('A')) {
      bunny.position.x -= 5;
      moving = true
    }
    if (keyboard.char('D')) {
      bunny.position.x += 5;
      moving = true
    }
    if (moving) socket.emit('update_position', {pos: bunny.position, model: bunny.model})

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

/*socket management*/


//connection socket management
socket.on('connect', function () {
  console.log('connected')
  console.log(socket.id)
  socket.emit('update_position', {pos: bunny.position, model: bunny.model})
})

//getting pickups socket
socket.on('get_pickups', function (params) {
  console.log('getting pickups')
  for (var pickupId in params.pickups) {
    console.log('key ' + pickupId + ' pickup params ' + params.pickups[pickupId])
    var sprite = new PIXI.Sprite(pickupTexture)
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(0.5,0.5)
    sprite.position.x = params.pickups[pickupId].pos.x
    sprite.position.y = params.pickups[pickupId].pos.y
    pickups[pickupId] = sprite
    stage.addChild(sprite)
  }
})

//getting players socket
socket.on('get_players', function (params) {
  console.log('getting players')
  var keys = Object.keys(params.players)
  var i = 0
  for (var playerId in params.players) {
    console.log('key ' + keys[i] + ' player params ' + params.players[playerId])
    var sprite = new PIXI.Sprite(bunnyTexture)
    sprite.anchor.set(0.5, 0.5)
    sprite.model = params.players[playerId].model
    sprite.tint = sprite.model.color
    sprite.position.x = params.players[playerId].pos.x
    sprite.position.y = params.players[playerId].pos.y
    otherBunnies[keys[i]] = sprite
    stage.addChild(sprite)
  }
})

//updating position socket
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

//other players leaving the game
socket.on('delete_player', function (id) {
  console.log('client with socket id ' + id + ' has disconected in client with socket id ' + socket.id)
  stage.removeChild(otherBunnies[id])
  delete otherBunnies[id];
})
