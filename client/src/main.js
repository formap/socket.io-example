// Homework:
// -control de teclat + moviment sincronitzat
// -envia dades als nous usuaris
// -detectar desconexions
// modularitzar bunny model

//npm run build
//node .\index.js (altre consola)
//http-server . -p 8080

var KeyboardJS = require('./Keyboard.js')

var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

var renderer = new PIXI.WebGLRenderer(800, 600)
var keyboard = new KeyboardJS(false, function () {})

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view)

// You need to create a root container that will hold the scene you want to draw.
global.stage = new PIXI.Container()

// This creates a texture from a 'bunny.png' image.
var bunnyTexture = PIXI.Texture.fromImage('bunny.png')
var bunny = new PIXI.Sprite(bunnyTexture)
global.bunny = bunny
var bunnyColorArray = [0x0000FF, 0x00FF00, 0xFF0000, 0xFFFFFF]
bunny.position.color = bunnyColorArray[Math.trunc(Math.random() * bunnyColorArray.length)]
bunny.tint = bunny.position.color
global.otherBunnies = {}

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)

// Add the bunny to the scene we are building.
stage.addChild(bunny)

// kick off the animation loop (defined below)
animate()

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate)

    var oldPos = bunny.position.clone()

    handleInput()

    if (oldPos.x != bunny.position.x || oldPos.y != bunny.position.y) {
      socket.emit('update_position', bunny.position)
    }

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage)
}

function handleInput() {
  if (keyboard.char('W')) bunny.position.y -= 2.0
  else if (keyboard.char('S')) bunny.position.y += 2.0

  if (keyboard.char('A')) bunny.position.x -= 2.0
  else if (keyboard.char('D')) bunny.position.x += 2.0
}

socket.on('update_position', function (pos) {
  //pos {x, y, id}
  var sprite = otherBunnies[pos.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    otherBunnies[pos.id] = sprite
    sprite.anchor.set(0.5, 0.5)
    sprite.tint = pos.color
  }
  sprite.position.x = pos.x
  sprite.position.y = pos.y
  sprite.position.color = pos.color
})

socket.on('inform_disconnection', function (id) {
  var sprite = otherBunnies[id]
  if (sprite) stage.removeChild(sprite)
  delete otherBunnies[id]
})

socket.on('connect', function () {
  socket.emit('update_position', bunny.position)
})
