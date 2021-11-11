<template>
  <div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
export default {
  data () {
    return {
      tree: {
        "id": "Modeling Methods",
        "label": "2",
        "children": [
          {
            "id": "Classification",
            "children": [
              {
                "id": "Logistic regression"
              },
              {
                "id": "Linear discriminant analysis"
              },
              {
                "id": "Rules"
              },
              {
                "id": "Decision trees"
              },
              {
                "id": "Naive Bayes"
              },
              {
                "id": "K nearest neighbor"
              },
              {
                "id": "Probabilistic neural network"
              },
              {
                "id": "Support vector machine"
              }
            ]
          },
          {
            "id": "Consensus",
            "children": [
              {
                "id": "Models diversity",
                "children": [
                  {
                    "id": "Different initializations"
                  },
                  {
                    "id": "Different parameter choices"
                  },
                  {
                    "id": "Different architectures"
                  },
                  {
                    "id": "Different modeling methods"
                  },
                  {
                    "id": "Different training sets"
                  },
                  {
                    "id": "Different feature sets"
                  }
                ]
              },
              {
                "id": "Methods",
                "children": [
                  {
                    "id": "Classifier selection"
                  },
                  {
                    "id": "Classifier fusion"
                  }
                ]
              },
              {
                "id": "Common",
                "children": [
                  {
                    "id": "Bagging"
                  },
                  {
                    "id": "Boosting"
                  },
                  {
                    "id": "AdaBoost"
                  }
                ]
              }
            ]
          },
          {
            "id": "Regression",
            "children": [
              {
                "id": "Multiple linear regression"
              },
              {
                "id": "Partial least squares"
              },
              {
                "id": "Multi-layer feedforward neural network"
              },
              {
                "id": "General regression neural network"
              },
              {
                "id": "Support vector regression"
              }
            ]
          }
        ]
      }
    };
  },
  mounted () {
    this.test1()
  },
  methods: {
    test () {
      fetch('http://127.0.0.1:3001/2')
        .then((res) => res.json())
        .then((data) => {
          const container = document.getElementById('modelRect');
          const width = container.scrollWidth;
          const height = container.scrollHeight || 700;
          const minimap = new G6.Minimap({
            size: [200, 200],
            className: 'minimap',
            type: 'modelRect',
          });
          const graph = new G6.TreeGraph({
            container: 'modelRect',
            width,
            height,
            linkCenter: true,
            modes: {
              default: [
                {
                  type: 'collapse-expand',
                  onChange: function onChange (item, collapsed) {
                    const data = item.getModel();
                    data.collapsed = collapsed;
                    return true;
                  },
                },
                'drag-canvas',
                'zoom-canvas',
              ],
            },
            defaultNode: {
              size: 26,
              anchorPoints: [
                [0, 0.5],
                [1, 0.5],
              ],
            },
            defaultEdge: {
              type: 'cubic-vertical',
            },
            layout: {
              type: 'compactBox',
              direction: 'V',
              getId: function getId (d) {
                return d.id;
              },
              getHeight: function getHeight () {
                return 60;
              },
              getWidth: function getWidth () {
                return 170;
              },
              getVGap: function getVGap () {
                return 80;
              },
              getHGap: function getHGap () {
                return 50;
              },
            },
            plugins: [minimap],
          });
          graph.on('click', (ev) => {
            const shape = ev.target;
            const item = ev.item;
            if (item) {
              console.log("1", item._cfg.model.quote);
            }
            // if (item) {
            //   const type = item.getType();
            // }
          });

          graph.node(function (node) {
            let position = 'right';
            let rotate = 0;
            if (!node.children) {
              position = 'bottom';
              rotate = Math.PI / 2;
            }
            return {
              label: node.id,
              labelCfg: {
                position,
                offset: 5,
                style: {
                  rotate,
                  textAlign: 'start',
                },
              },
            };
          });

          graph.data(data);
          graph.render();
          graph.fitView();

          if (typeof window !== 'undefined')
            window.onresize = () => {
              if (!graph || graph.get('destroyed')) return;
              if (!container || !container.scrollWidth || !container.scrollHeight) return;
              graph.changeSize(container.scrollWidth, container.scrollHeight);
            };
        });
    },
    test1 () {
      fetch('http://127.0.0.1:3001/2')
        .then((res) => res.json())
        .then((data) => {
          G6.registerNode('file-node', {
            draw: function draw (cfg, group) {
              var keyShape = group.addShape('rect', {
                attrs: {
                  x: cfg.x - 4,
                  y: cfg.y - 12,
                  fill: '#fff',
                  stroke: null
                }
              });
              var marker = void 0;
              if (cfg.collapsed) {
                marker = group.addShape('marker', {
                  attrs: {
                    symbol: 'triangle',
                    x: cfg.x + 4,
                    y: cfg.y - 2,
                    r: 4,
                    fill: '#666'
                  }
                });
              } else if (cfg.children && cfg.children.length > 0) {
                marker = group.addShape('marker', {
                  attrs: {
                    symbol: 'triangle-down',
                    x: cfg.x + 4,
                    y: cfg.y - 2,
                    r: 4,
                    fill: '#666'
                  }
                });
              }
              var shape = group.addShape('text', {
                attrs: {
                  x: cfg.x + 15,
                  y: cfg.y + 4,
                  text: cfg.name,
                  fill: '#666',
                  fontSize: 16,
                  textAlign: 'left'
                }
              });
              var bbox = shape.getBBox();
              keyShape.attr({
                width: bbox.width + 20,
                height: bbox.height + 4
              });
              return keyShape;
            }
          });
          G6.registerEdge('step-line', {
            getControlPoints: function getControlPoints (cfg) {
              var startPoint = cfg.startPoint;
              var endPoint = cfg.endPoint;
              return [{
                x: startPoint.x,
                y: endPoint.y
              }];
            }
          }, 'polyline');

          var graph = new G6.TreeGraph({
            container: 'mountNode',
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: 2,
            linkCenter: true,
            modes: {
              default: [{
                type: 'collapse-expand',
                animate: false,
                onChange: function onChange (item, collapsed) {
                  var data = item.get('model');
                  data.collapsed = collapsed;
                  return true;
                }
              }, 'drag-canvas', 'zoom-canvas']
            },
            defaultEdge: {
              style: {
                stroke: '#A3B1BF'
              }
            },
            layout: {
              type: 'indented',
              isHorizontal: true,
              direction: 'LR',
              indent: 30,
              getHeight: function getHeight () {
                return 16;
              },
              getWidth: function getWidth () {
                return 16;
              }
            }
          });


          graph.node(function (node) {
            return {
              shape: 'file-node',
              label: node.name
            };
          });

          graph.edge(function (edge) {
            return {
              shape: 'step-line'
            };
          });

          graph.data(data);
          graph.render();
          graph.fitView();
        }
        }
  }
};
</script>
<style  scoped>
</style>