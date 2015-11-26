daisygraph
---

an implementation of sunburst charts, for visualizing nested cumulative data

(another implementation: http://bl.ocks.org/mbostock/4063423)

usage:

    cat | daisygraph --json
    { 
      "name": ".",
      "children": 
        [
          {
            "name": "README.md"
            "value": 55,
          },
          {
            "name": "src",
            "children":
            [
              {
                "name": "daisygraph.js",
                "value": 185,
              }
            ]
          }
        ]
    }
    ^D
    <svg>
      <!-- daisygraph svg here -->
    </svg>

