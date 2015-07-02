// Homework:
// Display del username i la puntuacio
// a sota del jugador, que es demani el
// username amb prompt() i amb Text de pixi

// El username s'ha de demanar nomes la primera vegada

//npm run build
//node .\server\index.js (altre consola)
//http-server client -p 8080

var KeyboardJS = require('./Keyboard.js')
var Player = require('./Player.js')

var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

var renderer = new PIXI.WebGLRenderer(800, 600)
var keyboard = new KeyboardJS(false, function () {})

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view)

// You need to create a root container that will hold the scene you want to draw.
global.stage = new PIXI.Container()

// This creates a texture from a 'bunny.png' image.
var playerTexture = PIXI.Texture.fromImage('sanic.png')
var ringTexture = PIXI.Texture.fromImage('ring.png')
var sprite = new PIXI.Sprite(playerTexture)
var player = new Player(sprite)
global.player = player
global.otherPlayers = {}
global.pickUps = {}

// Add the bunny to the scene we are building.
stage.addChild(player.sprite)

// kick off the animation loop (defined below)
animate()

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate)

    var oldPos = player.sprite.position.clone()

    handleInput()

    if (oldPos.x != player.sprite.position.x || oldPos.y != player.sprite.position.y) {
      socket.emit('update_position', player.sprite.position)
    }

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage)
}

function handleInput() {
  var speed = 10.0
  if (keyboard.char('W')) player.sprite.position.y -= speed
  else if (keyboard.char('S')) player.sprite.position.y += speed

  if (keyboard.char('A')) player.sprite.position.x -= speed
  else if (keyboard.char('D')) player.sprite.position.x += speed
}

socket.on('update_position', function (pos) {
  //pos {x, y, id}
  var sprite = otherPlayers[pos.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(playerTexture)
    var player = new Player(sprite)
    stage.addChild(player.sprite)
    otherPlayers[pos.id] = player.sprite
  }
  player.sprite.position.x = pos.x
  player.sprite.position.y = pos.y
  player.sprite.position.color = pos.color
  player.sprite.tint = pos.color
})

socket.on('update_pickUp', function (pu) {
  var sprite = pickUps[pu.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(ringTexture)
    stage.addChild(sprite)
    pickUps[pu.id] = sprite
    sprite.anchor.set(0.5, 0.5)
  }
  sprite.position.x = pu.x
  sprite.position.y = pu.y
})

socket.on('inform_disconnection', function (id) {
  var sprite = otherPlayers[id]
  if (sprite) stage.removeChild(sprite)
  delete otherPlayers[id]
})

socket.on('delete_pickUp', function (id) {
  var sprite = pickUps[id]
  if (sprite) stage.removeChild(sprite)
  delete pickUps[id]
})

socket.on('connect', function () {
  socket.emit('update_position', player.sprite.position)
})
