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

  var daisygraph = function (root, radius, parent_length, start_angle) {
    var root_arc = { 
      start_angle: (start_angle || 0), 
           length: (root.ratio || 1) * (parent_length || 360),
           radius: (radius || 1)
    }

    var child_arcs = root.children ? root.children.reduce(function (m, c) {
      var sub_dg = daisygraph(c, radius + 1, root_arc.length, m.angle)
      var child_arc = sub_dg[0]
      return { arcs: m.arcs.concat(sub_dg), angle: m.angle + child_arc.length }
    }, { angle: root_arc.start_angle, arcs: [] }).arcs : []

    return [root_arc].concat(child_arcs)
  }

  var main_loop = function () {
    var rs = ratios({ 
      name: 'thing', 
      value: 10, 
      children: [ 
        { name: 'a', value: 5 },
        { 
          name: 'b', 
          value: 5,
          children: [ 
            { name: 'x', value: 2 },
            { name: 'y', value: 3 } 
          ] 
        } 
      ] 
    })
    var dg = daisygraph(rs, 1, 360, 0)
    render(document.querySelector('#target'), JSON.stringify(dg))
    // we don't need animation yet
    // requestAnimationFrame(main_loop)
  }

  function assert_equal(a, b) { } // TODO: a deep equal + diff function

  var test_ratios = function () {
    var rs = ratios({ name: 'thing', value: 10, children: [ { name: 'a', value: 5 }, { name: 'b', value: 5 } ] })
    var rs_expected = {"name":"thing","value":10,"children":[{"name":"a","value":5,"ratio":0.5},{"name":"b","value":5,"ratio":0.5}]}
    assert_equal(rs, rs_expected)
  }

  var test_daisygraph = function () {
    var root_rs = {"name":"thing","value":10,"children":[{"name":"a","value":5,"ratio":0.5},{"name":"b","value":5,"ratio":0.5}]}
    var dg = daisygraph(rs, 360, 0, 1)
    var dg_expected = {"arcs":[{"angle":0,"length":180,"radius":1},{"angle":180,"length":180,"radius":1}],"curr_angle":360}
    assert_equal(dg, dg_expected)
  }

  main_loop()
})()
