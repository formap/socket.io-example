function Player(textureName, acceleration, maxSpeed){
	var playerTexture = PIXI.Texture.fromImage(textureName);
	this.sprite = new PIXI.Sprite(playerTexture);
	this.sprite.anchor.set(0.5, 0.5);
	this.acceleration = acceleration;
	this.maxSpeed = maxSpeed;
	this.speed = {x: 0, y: 0};
}
module.exports = Player;