function Player (sprite) {
  var playerColorArray = [0x0000FF, 0x00FF00, 0xFF0000, 0xFFFFFF]
  this.sprite = sprite
  this.sprite.position.color = playerColorArray[Math.trunc(Math.random() * playerColorArray.length)]
  this.sprite.tint = this.sprite.position.color
  this.sprite.position.x = Math.random() * 800
  this.sprite.position.y = Math.random() * 600
  this.sprite.anchor.set(0.5, 0.5)
  this.sprite.scale.x = 0.1
  this.sprite.scale.y = 0.1
}

module.exports = Player
