const {Vector3} = require('grimoirejs-math').default;
const {
  Geometry,
  GeometryFactory,
} = require('grimoirejs-fundamental').default.Geometry;

class Torus {
  constructor(row, column, irad, orad) {
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
      },
    };
  }

  debugInit() {
  }

  generate(debug) {
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

  interleave() {
    let vertices = [];
    for (let i = 0; i <= this.positions.length / 3; i++) {
      vertices.push(...this.positions.slice(i * 3, (i + 1) * 3).concat(this.normals.slice(i * 3, (i + 1) * 3)).concat(this.texCoord.slice(i * 2, (i + 1) * 2)));
    }
    return vertices;
  }

  wireframe() {
    let indices = [];
    const ic = new Array(3);
    for (let i = 0; i <= this.indices.length - 1; i++) {
      ic[i % 3] = this.indices[i];
      if (i % 3 === 2) {
        const a = ic[0], b = ic[1], c = ic[2];
        indices.push(a, b, b, c, c, a);
      }
    }
    return indices;
  }

  geo() {
    for(let i = 0; i <= this.row; i++){
      const r = Math.PI * 2 / this.row * i;
      const rr = Math.cos(r);
      const ry = Math.sin(r);
      for(let ii = 0; ii <= this.column; ii++){
        const tr = Math.PI * 2 / this.column * ii;
        const tx = (rr * this.irad + this.orad) * Math.cos(tr);
        const ty = ry * this.irad;
        const tz = (rr * this.irad + this.orad) * Math.sin(tr);
        const rx = rr * Math.cos(tr);
        const rz = rr * Math.sin(tr);
        this.positions.push(tx, ty, tz);
        this.normals.push(rx, ry, rz);
        this.texCoord.push(1, 1);
      }
    }
    for(let i_ = 0; i_ < this.row; i_++){
      for(let ii_ = 0; ii_ < this.column; ii_++){
        const r = (this.column + 1) * i_ + ii_;
        this.indices.push(r, r + this.column + 1, r + 1);
        this.indices.push(r + this.column + 1, r + this.column + 2, r + 1);
      }
    }
  }

  coordToIndex(offset, x, y, up) {
    return offset + x * (Math.abs(this.div.dotWith(up)) + 1) + y;
  }

  validate() {
    if (this.positions.length % 3 !== 0) {
      console.error(`position length(${this.positions.length}) is not a multiple of 3.`);
    }
    if (this.normals.length % 3 !== 0) {
      console.error(`normal length(${this.normals.length}) is not a multiple of 3.`);
    }
    if (this.indices.length % this.topology !== 0) {
      console.error(`index length(${this.indices.length}) is not a multiple of topology(${this.topology}).`);
    }
    if (this.texCoord.length % 2 !== 0) {
      console.error(`texCoord length(${this.texCoord.length}) is not a multiple of 2.`);
    }
    if (this.positions.length !== this.normals.length) {
      console.error(`normal length is not match to position length. normal: ${this.normals.length}, position: ${this.positions.length}`);
    }
    if (this.positions.length / 3 !== this.texCoord.length / 2) {
      console.error(`texCoord pair length is not match to position pair length. texCoord: ${this.texCoord.length / 2}, position: ${this.positions.length / 3}`);
    }
    this.indices.forEach((v, idx) => {
      if (isNaN(parseInt(v)) || parseInt(v) !== v) {
        console.error(`index(${v}) is not a integer. in: index[${idx}] (${Math.ceil(idx / this.topology)})`);
      }
      if (v > this.positions.length / 3) {
        console.error(`index(${v}) is out of range. in: index[${idx}] (${Math.ceil(idx / this.topology)})`);
      }
    });
    this.positions.forEach((v, idx) => {
      if (isNaN(parseFloat(v))) {
        console.error(`position(${v}) is not a number. in: position[${idx}] (${Math.ceil(idx / 3)})`);
      }
      if (v > 1.0 || v < -1.0) {
        console.warn(`position(${v}) is out of unit space(-1 < q < 1). in: position[${idx}] (${Math.ceil(idx / 3)})`);
      }
    });
    Array.from({length: this.normals.length / 3}, (v, i) => {
      return this.normals.slice(i * 3, i * 3 + 3);
    }).forEach((v, idx) => {
      const n = new Vector3(v);
      if (Math.abs(n.magnitude - 1) > 0.001) {
        console.warn(`normal(${v.toString()}) is not normalized(${n.magnitude}). in: normal[${idx * 3}..${idx * 3 + 3}] (${idx})`);
      }
    });
    this.texCoord.forEach((v, idx) => {
      if (isNaN(parseFloat(v))) {
        console.error(`texCoord(${v}) is not a number. in: texCoord[${idx}] (${Math.ceil(idx / 2)})`);
      }
      if (v > 1.0 || v < 0) {
        console.warn(`texCoord(${v}) is out of unit space(0 < q < 1). in: texCoord[${idx}] (${Math.ceil(idx / 2)})`);
      }
    });
  }
}

GeometryFactory.addType('torus', {
  row: {
    converter: 'Number',
    default: 32,
  },
  column: {
    converter: 'Number',
    default: 32,
  },
  irad: {
    converter: 'Number',
    default: 0.5,
  },
  orad: {
    converter: 'Number',
    default: 1.0,
  },
}, (gl, attrs) => {
  const g = new Torus(attrs.row, attrs.column, attrs.irad, attrs.orad);
  g.generate();
  const geometry = new Geometry(gl);
  geometry.addAttributes(g.interleave(), g.layout);
  geometry.addIndex('default', g.index);
  geometry.addIndex('wireframe', g.wireframe(), WebGLRenderingContext.LINES);
  return geometry;
});
