;(function() {
  var inspect = function (thing) { console.log(thing); return thing }
  var html = function () { return "<p> Hello World </p>" }
  var render = function (target, string) { target.innerHTML = string }
  

  var clone = function (obj) {
    var res = {}
    for (var k in obj) if (obj.hasOwnProperty(k)) res[k] = obj[k]
    return res
  }

  // f can be a function or a value (a constant function, if you will)
  var update = function (obj, prop, f) {
    var c = clone(obj)
    c[prop] = (typeof f === 'function') ? f(c[prop]) : f
    return c
  }

  var ratios = function (tree) {
    var t = tree, u = update
    return (t.children) ? u(t, 'children', function (cs) { 
      return cs.map(function (c) { return u(ratios(c), 'ratio', c.value/t.value) })
    }) : u(t, 'ratio', 1)
  }

  var main_loop = function () {
    var rs = ratios({ name: 'thing', value: 10, children: [ { name: 'a', value: 5 }, { name: 'b', value: 5 } ] })
    render(document.querySelector('#target'), JSON.stringify(rs))
    // we don't need animation yet
    // requestAnimationFrame(main_loop)
  }

  main_loop()
})()
