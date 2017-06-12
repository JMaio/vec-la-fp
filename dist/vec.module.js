"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Adds two vectors
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Vector}
 */
var vAdd = function vAdd(v, v2) {
  return [v[0] + v2[0], v[1] + v2[1]];
};

/**
 * Subtracts one vector from another
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Vector}
 */
var vSub = function vSub(v, v2) {
  return [v[0] - v2[0], v[1] - v2[1]];
};

/**
 * Gets the magnitude of a vector
 * @param {Vector} v
 * @returns {Number}
 */
var vMag = function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};

/**
 * Gets a normalised vector 
 * @param {Vector} v
 * @returns {Vector}
 */
var vNorm = function vNorm(v) {
  var mag = vMag(v);
  return [v[0] / mag, v[1] / mag];
};

/**
 * Gets a scaled vector
 * @param {Vector} v
 * @param {Number} sc
 * @returns {Vector}
 */
var vScale = function vScale(v, sc) {
  return [v[0] * sc, v[1] * sc];
};

/**
 * Creates an 2x3 Matrix
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @returns {Matrix}
 */
var vCreateMatrix = function vCreateMatrix() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  return [a, c, tx, b, d, ty, 0, 0, 1];
};

/**
 * Applys a matrix transformation to a vector
 * @param {Vector} v
 * @param {Matrix} m
 * @returns {Vector}
 */
var vTransform = function vTransform(v, m) {
  return [v[0] * m[0] + v[1] * m[1] + m[2], v[0] * m[3] + v[1] * m[4] + m[5]];
};

/**
 * Compose two tranformations
 * @param {Matrix} m
 * @param {Matrix} m2
 * @returns {Matrix}
 */
var vComposeTransform = function vComposeTransform(m, m2) {
  return [m[0] * m2[0] + m[1] * m2[3] + m[2] * m2[6], m[0] * m2[1] + m[1] * m2[4] + m[2] * m2[7], m[0] * m2[2] + m[1] * m2[5] + m[2] * m2[8], m[3] * m2[0] + m[4] * m2[3] + m[5] * m2[6], m[3] * m2[1] + m[4] * m2[4] + m[5] * m2[7], m[3] * m2[2] + m[4] * m2[5] + m[5] * m2[8], m[6] * m2[0] + m[7] * m2[3] + m[8] * m2[6], m[6] * m2[1] + m[7] * m2[4] + m[8] * m2[7], m[6] * m2[2] + m[7] * m2[5] + m[8] * m2[8]];
};

/**
 * Rotates a vector around the origin. Shorthand for a rotation matrix
 * @param {Vector} v
 * @param {Number} a
 * @returns {Vector}
 */
var vRotate = function vRotate(v, a) {
  return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
};

/**
 * Rotates a vector around a given point.
 * @param {Vector} v
 * @param {Vector} cp
 * @param {Number} a
 * @returns {Vector}
 */
var vRotatePointAround = function vRotatePointAround(v, cp, a) {
  var v2 = vSub(v, cp);
  return vAdd(cp, [v2[0] * Math.cos(a) - v2[1] * Math.sin(a), v2[0] * Math.sin(a) + v2[1] * Math.cos(a)]);
};

/**
 * Gets the equidistant point between two vectors
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Vector}
 */
var vMidpoint = function vMidpoint(v, v2) {
  return vScale(vAdd(v, v2), 0.5);
};

/**
 * Dot product of two vectors
 * @param {Vector} v
 * @param {Vector} v2
 * @returns {Number}
 */
var vDot = function vDot(v, v2) {
  return v[0] * v2[0] + v[1] * v2[1];
};

/** 
 * Determinate of a matrix
 * @param {Matrix} m
 * @returns {Number}
 */
var vDet = function vDet(m) {
  return m[0] * m[4] - m[3] * m[1];
};

/**
 * Returns a builder object for easily composing matrices. Exposes
 * useful helper functions for general matrix operations:
 * translate, scale, rotate, shear
 * as a generic add function that accepts a matrix.
 * Calling done returns the matrix.
 * @param {Matrix} m
 */
var vMatrixBuilder = function vMatrixBuilder() {
  var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return {
    _m: m || [1, 0, 0, 0, 1, 0, 0, 0, 1],
    add: function add(m) {
      this._m = vComposeTransform(m, this._m);
      return this;
    },
    translate: function translate(x, y) {
      this._m = vComposeTransform([1, 0, x, 0, 1, y, 0, 0, 1], this._m);
      return this;
    },
    rotate: function rotate(a) {
      this._m = vComposeTransform([Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1], this._m);
      return this;
    },
    scale: function scale(x, y) {
      this._m = vComposeTransform([x, 0, 0, 0, y, 0, 0, 0, 1], this._m);
      return this;
    },
    shear: function shear(x, y) {
      this._m = vComposeTransform([1, x, 0, y, 1, 0, 0, 0, 1], this._m);
      return this;
    },
    clone: function clone() {
      return _extends({}, this);
    },
    done: function done() {
      return this._m;
    }
  };
};

/* start exports */
exports.add = vAdd;
exports.sub = vSub;
exports.norm = vNorm;
exports.mag = vMag;
exports.scale = vScale;
exports.transform = vTransform;
exports.composeTransform = vComposeTransform;
exports.matrixBuilder = vMatrixBuilder;
exports.createMatrix = vCreateMatrix;
exports.rotate = vRotate;
exports.rotatePointAround = vRotatePointAround;
exports.midpoint = vMidpoint;
exports.dot = vDot;
exports.det = vDet;
/* end exports */