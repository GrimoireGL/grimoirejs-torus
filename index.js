(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector3 = require('grimoirejs-math').default.Vector3;

var _require$default$Geom = require('grimoirejs-fundamental').default.Geometry,
    Geometry = _require$default$Geom.Geometry,
    GeometryFactory = _require$default$Geom.GeometryFactory;

var Torus = function () {
  function Torus(row, column, irad, orad) {
    _classCallCheck(this, Torus);

    this.row = row;
    this.column = column;
    this.irad = irad;
    this.orad = orad;
    this.offset = 0;
    this.topology = 3;
    this.positions = [];
    this.indices = [];
    this.normals = [];
    this.texCoord = [];
    this.count = 0;
    this.debug = false;
    this.layout = {
      POSITION: {
        size: 3,
        stride: 32
      },
      NORMAL: {
        size: 3,
        stride: 32,
        offset: 12
      },
      TEXCOORD: {
        size: 2,
        stride: 32,
        offset: 24
      }
    };
  }

  _createClass(Torus, [{
    key: 'debugInit',
    value: function debugInit() {}
  }, {
    key: 'generate',
    value: function generate(debug) {
      if (debug) {
        this.debug = true;
        this.debugInit();
      }
      this.geo();
      this.vertices = this.interleave();
      this.wireframeIndices = this.wireframe();
      this.count = this.positions.length / this.topology;
      if (this.debug) {
        this.validate();
      }
    }
  }, {
    key: 'interleave',
    value: function interleave() {
      var vertices = [];
      for (var i = 0; i <= this.positions.length / 3; i++) {
        vertices.push.apply(vertices, _toConsumableArray(this.positions.slice(i * 3, (i + 1) * 3).concat(this.normals.slice(i * 3, (i + 1) * 3)).concat(this.texCoord.slice(i * 2, (i + 1) * 2))));
      }
      return vertices;
    }
  }, {
    key: 'wireframe',
    value: function wireframe() {
      var indices = [];
      var ic = new Array(3);
      for (var i = 0; i <= this.indices.length - 1; i++) {
        ic[i % 3] = this.indices[i];
        if (i % 3 === 2) {
          var a = ic[0],
              b = ic[1],
              c = ic[2];
          indices.push(a, b, b, c, c, a);
        }
      }
      return indices;
    }
  }, {
    key: 'geo',
    value: function geo() {
      for (var i = 0; i <= this.row; i++) {
        var r = Math.PI * 2 / this.row * i;
        var rr = Math.cos(r);
        var ry = Math.sin(r);
        for (var ii = 0; ii <= this.column; ii++) {
          var tr = Math.PI * 2 / this.column * ii;
          var tx = (rr * this.irad + this.orad) * Math.cos(tr);
          var ty = ry * this.irad;
          var tz = (rr * this.irad + this.orad) * Math.sin(tr);
          var rx = rr * Math.cos(tr);
          var rz = rr * Math.sin(tr);
          this.positions.push(tx, ty, tz);
          this.normals.push(rx, ry, rz);
          this.texCoord.push(1, 1);
        }
      }
      for (var i_ = 0; i_ < this.row; i_++) {
        for (var ii_ = 0; ii_ < this.column; ii_++) {
          var _r = (this.column + 1) * i_ + ii_;
          this.indices.push(_r, _r + this.column + 1, _r + 1);
          this.indices.push(_r + this.column + 1, _r + this.column + 2, _r + 1);
        }
      }
    }
  }, {
    key: 'coordToIndex',
    value: function coordToIndex(offset, x, y, up) {
      return offset + x * (Math.abs(this.div.dotWith(up)) + 1) + y;
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _this = this;

      if (this.positions.length % 3 !== 0) {
        console.error('position length(' + this.positions.length + ') is not a multiple of 3.');
      }
      if (this.normals.length % 3 !== 0) {
        console.error('normal length(' + this.normals.length + ') is not a multiple of 3.');
      }
      if (this.indices.length % this.topology !== 0) {
        console.error('index length(' + this.indices.length + ') is not a multiple of topology(' + this.topology + ').');
      }
      if (this.texCoord.length % 2 !== 0) {
        console.error('texCoord length(' + this.texCoord.length + ') is not a multiple of 2.');
      }
      if (this.positions.length !== this.normals.length) {
        console.error('normal length is not match to position length. normal: ' + this.normals.length + ', position: ' + this.positions.length);
      }
      if (this.positions.length / 3 !== this.texCoord.length / 2) {
        console.error('texCoord pair length is not match to position pair length. texCoord: ' + this.texCoord.length / 2 + ', position: ' + this.positions.length / 3);
      }
      this.indices.forEach(function (v, idx) {
        if (isNaN(parseInt(v)) || parseInt(v) !== v) {
          console.error('index(' + v + ') is not a integer. in: index[' + idx + '] (' + Math.ceil(idx / _this.topology) + ')');
        }
        if (v > _this.positions.length / 3) {
          console.error('index(' + v + ') is out of range. in: index[' + idx + '] (' + Math.ceil(idx / _this.topology) + ')');
        }
      });
      this.positions.forEach(function (v, idx) {
        if (isNaN(parseFloat(v))) {
          console.error('position(' + v + ') is not a number. in: position[' + idx + '] (' + Math.ceil(idx / 3) + ')');
        }
        if (v > 1.0 || v < -1.0) {
          console.warn('position(' + v + ') is out of unit space(-1 < q < 1). in: position[' + idx + '] (' + Math.ceil(idx / 3) + ')');
        }
      });
      Array.from({ length: this.normals.length / 3 }, function (v, i) {
        return _this.normals.slice(i * 3, i * 3 + 3);
      }).forEach(function (v, idx) {
        var n = new Vector3(v);
        if (Math.abs(n.magnitude - 1) > 0.001) {
          console.warn('normal(' + v.toString() + ') is not normalized(' + n.magnitude + '). in: normal[' + idx * 3 + '..' + (idx * 3 + 3) + '] (' + idx + ')');
        }
      });
      this.texCoord.forEach(function (v, idx) {
        if (isNaN(parseFloat(v))) {
          console.error('texCoord(' + v + ') is not a number. in: texCoord[' + idx + '] (' + Math.ceil(idx / 2) + ')');
        }
        if (v > 1.0 || v < 0) {
          console.warn('texCoord(' + v + ') is out of unit space(0 < q < 1). in: texCoord[' + idx + '] (' + Math.ceil(idx / 2) + ')');
        }
      });
    }
  }]);

  return Torus;
}();

GeometryFactory.addType('torus', {
  row: {
    converter: 'Number',
    default: 32
  },
  column: {
    converter: 'Number',
    default: 32
  },
  irad: {
    converter: 'Number',
    default: 0.5
  },
  orad: {
    converter: 'Number',
    default: 1.0
  }
}, function (gl, attrs) {
  var g = new Torus(attrs.row, attrs.column, attrs.irad, attrs.orad);
  g.generate();
  var geometry = new Geometry(gl);
  geometry.addAttributes(g.interleave(), g.layout);
  geometry.addIndex('default', g.index);
  geometry.addIndex('wireframe', g.wireframe(), WebGLRenderingContext.LINES);
  return geometry;
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
