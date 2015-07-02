
//constructor
function Physics() {}

/*
* Collitions by radium. If the sum of both radiums is less than the distance between their centers then they collided.
* Otherwise they dont
*	obj structure: {
*		pos :{x,y},
*		radium
*	}
*/
Physics.prototype.objectsCollide = function (obj1, obj2) {
	var sumRadius = obj1.radium + obj2.radium;
	var d = Math.sqrt(Math.pow(obj1.pos.x - obj2.pos.x, 2) + Math.pow(obj1.pos.y - obj2.pos.y, 2)); //distance between both ojects
	if (sumRadius > d) return true
	else return false
}

module.exports = Physics
