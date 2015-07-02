function KeyboardJS () {
  this.keys = [];
  this.char = function (x) {
    return this.keys[x.charCodeAt(0)];
  }
  var scope = this;
  document.addEventListener("keydown", function (evt) {
    scope.keys[evt.keyCode] = true;
  });
  document.addEventListener("keyup", function (evt) {
    scope.keys[evt.keyCode] = false;
  });
}
