var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var bunnies = {}
var carrots = {}
var width = 800
var height = 600
var margin = 100
var bunnyHeight = 128
var carrotHeight = 64
var carrotNextId = 0

io.on('connection', function (socket) {
  console.log('connection', socket.id)
  for (var bunnyId in bunnies) {
    socket.emit('update_position', bunnies[bunnyId])
  }
  show_carrots(socket)
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    socket.broadcast.emit('player_disconnected', socket.id)
    delete bunnies[socket.id]
  })
  socket.on('update_position', function (pos) {
    bunnies[socket.id] = pos
    for (var carrotId in carrots) {
      var carrot = carrots[carrotId]
      var distance = {
        x: Math.abs(carrot.x - pos.x),
        y: Math.abs(carrot.y - pos.y)
      }
      distance = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
      if(distance < carrotHeight) {
        console.log('carrot collision ' + carrot.x + ' ' + carrot.y)
        socket.emit('carrot_eaten', carrot)
        socket.broadcast.emit('carrot_eaten', carrot)
        console.log(carrot)
        delete carrots[carrotId]
      }
    }
    pos.id = socket.id
    socket.broadcast.emit('update_position', pos)
  })
})

function show_carrots (socket) {
  for (var carrotId in carrots) {
    socket.emit('update_carrot', carrots[carrotId])
  }
}

function spawn_carrots () {
  var plusTen = carrotNextId + 10
  var i
  for (i = carrotNextId; i < plusTen; ++i) {
    carrots[i] = {
      id: i,
      x: Math.floor(Math.random() * (width - margin * 2)+margin) + 1,
      y: Math.floor(Math.random() * (height - margin * 2)+margin) + 1
    }
  }
  carrotNextId = i
  show_carrots(io.sockets)
}

setInterval(spawn_carrots, 5000);

console.log('server started on port', port)
