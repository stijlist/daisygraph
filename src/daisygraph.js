;(function() {
  var utils = (function () {
    var inspect = function (thing) { console.log(thing); return thing }

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

    var identity = function (x) { return x }

    var every = function (arr, pred) {
      pred = pred || identity

      return arr.map(pred).reduce(function (acc, x) { return acc && x })
    }

    var zip = function (xs, ys) {
      var shorter_longer = xs.length < ys.length ? [xs,ys] : [ys,xs]
      var shorter = shorter_longer[0], longer = shorter_longer[1]

      var result = []
      for (var i=0; i<=shorter.length; i++)
        result.push([shorter[i], longer[i]])
        
      return result
    }

    var equal = function (a, b, meta, verbose) { 
      if (a === b) return true
      if (typeof a !== typeof b) return false

      if (Array.isArray(a) && Array.isArray(b)) { 
        return a.length === b.length && utils.every(
          zip(a, b).map(function (pair) { return equal(pair[0], pair[1]) })
        )
      } else if (typeof a === 'object') {
        return utils.every(
          Object.keys(a).map(function (k) { return equal(a[k], b[k], k) })
        )
      } else {
        if (verbose) {
          if (meta) console.log('comparing', meta)
          console.log('value A in comparison', a)
          console.log('value B in comparison', b)
          console.log('comparison fell through and returned False')
        }
        return false
      }
    }

    return {
      inspect: inspect,
      clone: clone,
      update: update,
      identity: identity,
      every: every,
      zip: zip,
      equal: equal
    }
  })()

  var dom = {
    render: function (target, string) { target.innerHTML = string },
    SVG: function (el, paths) {
      el.textContent = paths
    },
  }
  
  var state = { 
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
    }

  var ratios = function (tree) {
    var t = tree, u = utils.update
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

  // var path = '<path fill="none" stroke="#333333" stroke-width="3" d="M65,10 a50,25 0 1,0 50,25" />'
  var path = '<rect width="200" height="100" fill="#BBC42A" />'

  var main = function () {
    var rs = ratios(state)
    var dg = daisygraph(rs)
    dom.render(document.querySelector('#target'), JSON.stringify(dg))
    dom.SVG(document.querySelector('svg'), path)
    // we don't need animation yet
    // requestAnimationFrame(main)
  }

  var tests = (function () {
    var test_equal = function () {
      console.log('sanity check of equals function, expecting three `true` responses')
      console.log(utils.equal([1, 2], [1, 2]))
      console.log(utils.equal({ a: 1, b: 2 },{ a: 1, b: 2 }))
      console.log(utils.equal('a', 'a'))

      console.log('sanity check of utils.equals function, expecting three `false` responses')
      console.log(utils.equal([1, 1], [1]))
      console.log(utils.equal(1, '1'))
      console.log(utils.equal({ '1': 1, '2': 2 }, {}))
    }

    var test_ratios = function () {
      var rs = ratios({ name: 'thing', value: 10, children: [ { name: 'a', value: 5 }, { name: 'b', value: 5 } ] })
      var rs_expected = {"name":"thing","value":10,"children":[{"name":"a","value":5,"ratio":0.5},{"name":"b","value":5,"ratio":0.5}]}
      return utils.equal(rs, rs_expected, false, true)
    }

    var test_daisygraph = function () {
      var root_rs = 
        {"name":"thing","value":10,"children":[{"name":"a","value":5,"ratio":0.5},{"name":"b","value":5,"ratio":0.5}]}
      var dg = daisygraph(root_rs)
      var dg_expected = [{ start_angle: 0, length: 360, radius: 1 }, { start_angle: 0, length: 180, radius: 2 }, { start_angle: 180, length: 180, radius: 2 }]
      return utils.equal(dg, dg_expected, false, true)
    }

    // console.log('testing equals function', test_equal())
    console.log('test ratios', test_ratios())
    console.log('test daisygraph', test_daisygraph())
  })

  tests()
  main()
})()
