// Homework:
// control de teclat + moviment sincronitzat
// envia dades als nous usuaris
// detectar desconexions
// modularitzar bunny model

//npm run build
//node .\index.js (altre consola)
//http-server . -p 8080

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
bunny.myColor = bunnyColorArray[Math.trunc(Math.random() * 3)]
bunny.tint = bunny.myColor
global.otherBunnies = {}

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.scale.x = 0.1
bunny.scale.y = 0.1
bunny.anchor.set(0.5, 0.5)

// Add the bunny to the scene we are building.
stage.addChild(bunny)

// kick off the animation loop (defined below)
animate()

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate)

    handleInput()

    socket.emit('update_position', bunny.position, bunny.myColor)

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage)
}

function handleInput() {
  if (keyboard.char('W')) bunny.position.y -= 1.0
  else if (keyboard.char('S')) bunny.position.y += 1.0

  if (keyboard.char('A')) bunny.position.x -= 1.0
  else if (keyboard.char('D')) bunny.position.x += 1.0
}

socket.on('update_position', function (pos, color) {
  var sprite = otherBunnies[pos.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    otherBunnies[pos.id] = sprite
    sprite.anchor.set(0.5, 0.5)
    sprite.myColor = color
    sprite.tint = color
  }
  sprite.position.x = pos.x
  sprite.position.y = pos.y
  sprite.scale.x = 0.1
  sprite.scale.y = 0.1
})

socket.on('inform_disconnection', function (id) {
  console.log(id + ' just got rekt')
  stage.removeChild(otherBunnies[id])
  otherBunnies[id] = null
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('update_position', bunny.position, bunny.myColor)
})

