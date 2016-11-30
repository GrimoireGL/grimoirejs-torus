(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _marked = [torusIndex, torusPosition, torusNormal].map(regeneratorRuntime.mark);

var gf = require('grimoirejs-fundamental').default;

var _require$default = require('grimoirejs-math').default,
    Vector3 = _require$default.Vector3,
    AABB = _require$default.AABB;

var _gf$Geometry = gf.Geometry,
    GeometryFactory = _gf$Geometry.GeometryFactory,
    GeometryBuilder = _gf$Geometry.GeometryBuilder,
    GeometryUtility = _gf$Geometry.GeometryUtility;


function torusIndex(row, column) {
  var i, ii, r;
  return regeneratorRuntime.wrap(function torusIndex$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < row)) {
            _context.next = 13;
            break;
          }

          ii = 0;

        case 3:
          if (!(ii < column)) {
            _context.next = 10;
            break;
          }

          r = (column + 1) * i + ii;
          return _context.delegateYield([r, r + column + 1, r + 1], 't0', 6);

        case 6:
          return _context.delegateYield([r + column + 1, r + column + 2, r + 1], 't1', 7);

        case 7:
          ii++;
          _context.next = 3;
          break;

        case 10:
          i++;
          _context.next = 1;
          break;

        case 13:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

function torusPosition(row, column, irad, orad) {
  var i, r, rr, ry, ii, tr, tx, ty, tz;
  return regeneratorRuntime.wrap(function torusPosition$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i <= row)) {
            _context2.next = 18;
            break;
          }

          r = Math.PI * 2 / row * i;
          rr = Math.cos(r);
          ry = Math.sin(r);
          ii = 0;

        case 6:
          if (!(ii <= column)) {
            _context2.next = 15;
            break;
          }

          tr = Math.PI * 2 / column * ii;
          tx = (rr * irad + orad) * Math.cos(tr);
          ty = ry * irad;
          tz = (rr * irad + orad) * Math.sin(tr);
          return _context2.delegateYield([tx, ty, tz], 't0', 12);

        case 12:
          ii++;
          _context2.next = 6;
          break;

        case 15:
          i++;
          _context2.next = 1;
          break;

        case 18:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[1], this);
}

function torusNormal(row, column) {
  var i, r, rr, ry, ii, tr, rx, rz;
  return regeneratorRuntime.wrap(function torusNormal$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i <= row)) {
            _context3.next = 17;
            break;
          }

          r = Math.PI * 2 / row * i;
          rr = Math.cos(r);
          ry = Math.sin(r);
          ii = 0;

        case 6:
          if (!(ii <= column)) {
            _context3.next = 14;
            break;
          }

          tr = Math.PI * 2 / column * ii;
          rx = rr * Math.cos(tr);
          rz = rr * Math.sin(tr);
          return _context3.delegateYield([rx, ry, rz], 't0', 11);

        case 11:
          ii++;
          _context3.next = 6;
          break;

        case 14:
          i++;
          _context3.next = 1;
          break;

        case 17:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[2], this);
}

function torusSize(row, column) {
  return (row + 1) * (column + 1);
}

function torusAABB(irad, orad) {
  var outerRadius = orad + irad;
  return new AABB([new Vector3(outerRadius, irad, outerRadius), new Vector3(-outerRadius, -irad, -outerRadius)]);
}

GeometryFactory.addType('torus', {
  row: {
    converter: 'Number',
    defaultValue: 32
  },
  column: {
    converter: 'Number',
    defaultValue: 32
  },
  irad: {
    converter: 'Number',
    defaultValue: 0.5
  },
  orad: {
    converter: 'Number',
    defaultValue: 1.0
  }
}, function (gl, attrs) {
  return GeometryBuilder.build(gl, {
    indicies: {
      default: {
        generator: regeneratorRuntime.mark(function generator() {
          return regeneratorRuntime.wrap(function generator$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  return _context4.delegateYield(torusIndex(attrs.row, attrs.column), 't0', 1);

                case 1:
                case 'end':
                  return _context4.stop();
              }
            }
          }, generator, this);
        }),
        topology: WebGLRenderingContext.TRIANGLES
      },
      wireframe: {
        generator: regeneratorRuntime.mark(function generator() {
          return regeneratorRuntime.wrap(function generator$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  return _context5.delegateYield(GeometryUtility.linesFromTriangles(torusIndex(attrs.row, attrs.column)), 't0', 1);

                case 1:
                case 'end':
                  return _context5.stop();
              }
            }
          }, generator, this);
        }),
        topology: WebGLRenderingContext.LINES
      }
    },
    verticies: {
      main: {
        size: {
          position: 3,
          normal: 3,
          texCoord: 2
        },
        count: torusSize(attrs.row, attrs.column),
        getGenerators: function getGenerators() {
          return {
            position: regeneratorRuntime.mark(function position() {
              return regeneratorRuntime.wrap(function position$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      return _context6.delegateYield(torusPosition(attrs.row, attrs.column, attrs.irad, attrs.orad), 't0', 1);

                    case 1:
                    case 'end':
                      return _context6.stop();
                  }
                }
              }, position, this);
            }),
            normal: regeneratorRuntime.mark(function normal() {
              return regeneratorRuntime.wrap(function normal$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      return _context7.delegateYield(torusNormal(attrs.row, attrs.column), 't0', 1);

                    case 1:
                    case 'end':
                      return _context7.stop();
                  }
                }
              }, normal, this);
            }),
            texCoord: regeneratorRuntime.mark(function texCoord() {
              return regeneratorRuntime.wrap(function texCoord$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      if (!true) {
                        _context8.next = 5;
                        break;
                      }

                      _context8.next = 3;
                      return 1;

                    case 3:
                      _context8.next = 0;
                      break;

                    case 5:
                    case 'end':
                      return _context8.stop();
                  }
                }
              }, texCoord, this);
            })
          };
        }
      }
    },
    aabb: torusAABB(attrs.irad, attrs.orad)
  });
});

},{"grimoirejs-fundamental":2,"grimoirejs-math":3}],2:[function(require,module,exports){
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});exports.default=window.GrimoireJS.lib.fundamental;
},{}],3:[function(require,module,exports){
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});exports.default=window.GrimoireJS.lib.math;
},{}]},{},[1])
//# sourceMappingURL=index.js.map
