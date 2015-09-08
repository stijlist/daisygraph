;(function() {
  var inspect = function (thing) { console.log(thing); return thing }
  var html = function () { return "<p> Hello World </p>" }
  var render = function (target, renderer) { target.innerHTML = renderer() }
  var main_loop = function () {
    render(document.querySelector('#target'), html)
    requestAnimationFrame(main_loop)
  }
  main_loop()
})()
