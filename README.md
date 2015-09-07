daisygraph
---

visualize nested cumulative data

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

