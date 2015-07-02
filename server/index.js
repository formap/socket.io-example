var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var players = {}
var pickups = {}
var mapDimensions = {width: 800, height: 600}
var Physics = require('../utility/Physics.js')
var physics = new Physics()

console.log(Physics)
console.log(physics)

//generating pickups
for (var i = 0; i < 3; ++i) {
  pickups[i] = {
    pos: {
      x: Math.random()*mapDimensions.width, 
      y: Math.random()*mapDimensions.height
    },
    radium: 8
  }
}

io.on('connection', function (socket) {
  console.log('connection', socket.id)
  socket.emit('get_pickups', {pickups: pickups})  //emitting pickups
  socket.emit('get_players', {players: players})  //emitting other players
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    socket.broadcast.emit('delete_player', socket.id)
    delete players[socket.id]
  })
  socket.on('update_position', function (params) {
    params.id = socket.id
    players[params.id] = {pos: params.pos, model: params.model, radium:25}
    for (pickupId in pickups) {
      var collide = physics.objectsCollide(
        {pos: players[params.id].pos, radium: players[params.id].radium},
        {pos: pickups[pickupId].pos, radium: pickups[pickupId].radium}
      )
      if (collide) {
        io.sockets.emit('pickup_collected', pickupId)
        delete pickups[pickupId]
      }
    }
    socket.broadcast.emit('update_position', params)

  })
})

console.log('server started on port', port)
