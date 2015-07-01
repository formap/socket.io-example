/*
* Keyboard utility, from https://github.com/dasilvacontin/KeyboardJS/blob/master/Keyboard.js
*	prevent is omitted. prevent treat the default behavior of a key interactig with the browser (tab, arrow keys, etc)
*/
function KeyboardJS (debug) {
  this.keys = [];
  this.char = function(x) { return this.keys[x.charCodeAt(0)];}
  this.debug = debug;
  var scope = this;
  document.addEventListener("keydown", function (evt) {
  	//pressing always the key because default pauses after first keydown
  	scope.keys[evt.keyCode] = true;
  	if (scope.debug) console.log('-- keyIsDown ASCII('+evt.keyCode+') CHAR('+String.fromCharCode(evt.keyCode)+')');
  });
  document.addEventListener("keyup", function (evt) {
  	//unpressing key
  	scope.keys[evt.keyCode] = false;
  	if (scope.debug) console.log('-- keyIsUp ASCII('+evt.keyCode+') CHAR('+String.fromCharCode(evt.keyCode)+')');
  });
  if (scope.debug) console.log("keyboardJS inited", "keyboardJS");
}