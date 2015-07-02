var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

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
global.bunny = bunny
var otherBunnies = {}

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)

// Add the bunny to the scene we are building.
stage.addChild(bunny);

var keyboard = new KeyboardJS()

// kick off the animation loop (defined below)
animate();

function animate() {
  // start the timer for the next animation loop
  requestAnimationFrame(animate)

  if (keyboard.char('W') || keyboard.keys[38]) {
      console.log("pressed w")
      bunny.position.y -= 5
      socket.emit('update_position', bunny.position)
  } else if(keyboard.char('D') || keyboard.keys[39]) {
      bunny.position.x += 5
      socket.emit('update_position', bunny.position)
  } else if(keyboard.char('S') || keyboard.keys[40]) {
      bunny.position.y += 5
      socket.emit('update_position', bunny.position)
  } else if(keyboard.char('A') || keyboard.keys[37]) {
      bunny.position.x -= 5
      socket.emit('update_position', bunny.position)
  }

  // this is the main render call that makes pixi draw your container and its children.
  renderer.render(stage)
}

socket.on('player_disconnected', function (id) {
  stage.removeChild(otherBunnies[id])
  delete otherBunnies[id]
})

socket.on('update_position', function (pos) {
  var sprite = otherBunnies[pos.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    otherBunnies[pos.id] = sprite
    sprite.anchor.set(0.5, 0.5)
  }
  sprite.position.x = pos.x
  sprite.position.y = pos.y
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('update_position', bunny.position)
})
