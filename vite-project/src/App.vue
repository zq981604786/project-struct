<template>
  <div>
    <div id="container"></div>
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
          // graph.on('click', (ev) => {
          //   const shape = ev.target;
          //   const item = ev.item;
          // });

          graph.on('node:mouseenter', function (evt) {
            const node = evt.item;
            const model = node.getModel();
            model.oriLabel = model.label;
            if (model.quote && model.quote.length > 0) {
              var label = model.quote.join('\n')
              graph.updateItem(node, {
                label,
                labelCfg: {
                  style: {
                    fill: '#003a8c',
                  },
                },
              });
            }
          });

          graph.on('node:mouseleave', function (evt) {
            const node = evt.item;
            const model = node.getModel();
            graph.updateItem(node, {
              label: model.oriLabel,
              labelCfg: {
                style: {
                  fill: '#555',
                },
              },
            });
          });

          // graph.on('edge:mouseenter', function (evt) {
          //   const edge = evt.item;
          //   const model = edge.getModel();
          //   model.oriLabel = model.label;
          //   graph.updateItem(edge, {
          //     label: 'after been hovered',
          //     labelCfg: {
          //       style: {
          //         fill: '#003a8c',
          //       },
          //     },
          //   });
          // });

          // graph.on('edge:mouseleave', function (evt) {
          //   const edge = evt.item;
          //   graph.setItemState(edge, 'hover', false);
          //   graph.updateItem(edge, {
          //     label: 'label before \n been hovered',
          //     labelCfg: {
          //       style: {
          //         fill: '#555',
          //       },
          //     },
          //   });
          // });

          graph.node(function (node) {
            let position = 'right';
            let rotate = 0;
            if (!node.children) {
              position = 'bottom';
              rotate = Math.PI / 2;
            }
            return {
              label: node.label,
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
              const keyShape = group.addShape('rect', {
                attrs: {
                  x: 10,
                  y: -12,
                  fill: '#fff',
                  stroke: null,
                },
              });
              let isLeaf = false;
              if (cfg.collapsed) {
                group.addShape('marker', {
                  attrs: {
                    symbol: 'triangle',
                    x: 4,
                    y: -2,
                    r: 4,
                    fill: '#666',
                  },
                  name: 'marker-shape',
                });
              } else if (cfg.children && cfg.children.length > 0) {
                group.addShape('marker', {
                  attrs: {
                    symbol: 'triangle-down',
                    x: 4,
                    y: -2,
                    r: 4,
                    fill: '#666',
                  },
                  name: 'marker-shape',
                });
              } else {
                isLeaf = true;
              }
              const shape = group.addShape('text', {
                attrs: {
                  x: 15,
                  y: 4,
                  text: cfg.name,
                  fill: '#666',
                  fontSize: 16,
                  textAlign: 'left',
                  fontFamily:
                    typeof window !== 'undefined'
                      ? window.getComputedStyle(document.body, null).getPropertyValue('font-family') ||
                      'Arial, sans-serif'
                      : 'Arial, sans-serif',
                },
                name: 'text-shape',
              });
              const bbox = shape.getBBox();
              let backRectW = bbox.width;
              let backRectX = keyShape.attr('x');
              if (!isLeaf) {
                backRectW += 8;
                backRectX -= 15;
              }
              keyShape.attr({
                width: backRectW,
                height: bbox.height + 4,
                x: backRectX,
              });
              return keyShape;
            },
          });
          G6.registerEdge(
            'step-line',
            {
              getControlPoints: function getControlPoints (cfg) {
                const startPoint = cfg.startPoint;
                const endPoint = cfg.endPoint;
                return [
                  startPoint,
                  {
                    x: startPoint.x,
                    y: endPoint.y,
                  },
                  endPoint,
                ];
              },
            },
            'polyline',
          );
          const minimap = new G6.Minimap({
            size: [200, 200],
            className: 'minimap',
            type: 'modelRect',
          });
          const container = document.getElementById('container');
          const width = container.scrollWidth;
          const height = container.scrollHeight || 800;
          const graph = new G6.TreeGraph({
            container: 'container',
            width,
            height,
            linkCenter: true,
            modes: {
              default: [
                {
                  type: 'collapse-expand',
                  animate: false,
                  onChange: function onChange (item, collapsed) {
                    const data = item.get('model');
                    data.collapsed = collapsed;
                    console.log(data)
                    return true;
                  }
                },
                'drag-canvas',
                'zoom-canvas',
                {
                  type: 'tooltip',
                  formatText (model) {
                    if (!model || !model.quote || model.quote === 0) {
                      return
                    }
                    var label = model.quote
                    let str = label.map(r => {
                      if (r !== ',') {
                        return `<p">${r}</p>`
                      }
                    })
                    str = str.join('\n')
                    return `<div>
                    ${str}
                    </div>`
                  },
                  offset: 10,
                },
              ],
            },
            defaultEdge: {
              style: {
                stroke: '#A3B1BF',
              },
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
              },
            },
            plugins: [minimap],
          });

          graph.node((node) => {
            return {
              type: 'file-node',
              label: node.name,
            };
          });
          graph.edge(() => {
            return {
              type: 'step-line',
            };
          });
          // graph.on('node:mouseenter', function (evt) {
          //   const node = evt.item;
          //   const model = node.getModel();
          //   if (model.quote && model.quote.length > 0) {
          //     var label = model.quote.join('\n')
          //     // console.log(label)
          //     graph.updateItem(node, {
          //       label,
          //       labelCfg: {
          //         style: {
          //           fill: '#003a8c',
          //         },
          //       },
          //     });
          //   }
          // });

          // graph.on('node:mouseleave', function (evt) {
          //   const node = evt.item;
          //   const model = node.getModel();
          //   graph.updateItem(node, {
          //     label: model.oriLabel,
          //     labelCfg: {
          //       style: {
          //         fill: '#555',
          //       },
          //     },
          //   });
          // });

          graph.data(data);
          graph.render();
          graph.fitView();

          if (typeof window !== 'undefined')
            window.onresize = () => {
              if (!graph || graph.get('destroyed')) return;
              if (!container || !container.scrollWidth || !container.scrollHeight) return;
              graph.changeSize(container.scrollWidth, container.scrollHeight);
            };
        })
    },
  }
};
</script>

<style>
.g6-tooltip {
  padding: 10px 6px;
  color: #444;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e2e2;
  border-radius: 4px;
}
</style>