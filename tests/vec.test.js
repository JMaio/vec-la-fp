const chai = require('chai');
const expect = chai.expect;
const {compose} = require('ramda');
const {vec} = require('../dist/vec.module.js');

describe('Vec-la', function() {
  it('should add two vectors', () => {
    const v1 = [1,2];
    const v2 = [3,4];
    expect(vec.add(v1, v2)).to.deep.equal([4, 6]);
  });

  it('should subtract two vectors', () => {
    const v1 = [1,2];
    const v2 = [3,4];
    expect(vec.sub(v1, v2)).to.deep.equal([-2, -2]);
  });

  it('should get the magnitude of a vector', () => {
    const v1 = [3,4];
    expect(vec.mag(v1)).to.equal(5);
  });

  it('should normalise a vector', () => {
    const v1 = [3,4];
    expect(vec.norm(v1)).to.deep.equal([3/5, 4/5]);
  });

  it('should scale a vector', () => {
    const v1 = [3,4];
    const sc = 10;
    expect(vec.scale(sc, v1)).to.deep.equal([30, 40]);
  });

  it('should get the normal of a vector', () => {
    const v1 = [0, 1];
    expect(vec.normal(v1)).to.deep.equal([-1, 0]);
  });

  it('should get bet points along a direction vector', () => {
    const v1 = [10, 8];
    const v2 = [12, 20];
    const res1 = vec.towards(0.25, v1, v2);

    expect(res1).to.deep.equal([10.5, 11]);
  });

  it('should apply a matrix transformation to a vector', () => {
    const v1 = [3,4];
    const m = [
      10, 0, 10,
      0, 10, 10,
      0, 0, 1
    ];

    expect(vec.transform(m, v1)).to.deep.equal([40, 50]);
  });

  it('should compose two matrices', () => {
    const m1 = [
      1, 0, 10,
      0, 1, 10,
      0, 0, 1
    ];
    const m2 = [
      10, 0, -5,
      0, 10, -5,
      0, 0, 1
    ];
    const m3 = vec.mCompose(m1, m2);
    expect(m3).to.deep.equal([
      10, 0, 5,
      0, 10, 5,
      0, 0, 1
    ]);
  });

  it('should rotate a vector', () => {
    const v1 = [2, 0];
    const angle = Math.PI/2;
    const result = vec.rotate(angle, v1);

    // Remove float point error
    const exactResult = result.map(c => parseFloat(c.toFixed(8)));

    expect(exactResult).to.deep.equal([0, 2]);
  });

  it('should rotate a vector around another vector', () => {
    const v1 = [2, 0];
    const v2 = [4, 0];
    const angle = Math.PI/2;
    const result = vec.rotatePointAround(angle, v1, v2);

    // Remove float point error
    const exactResult = result.map(c => parseFloat(c.toFixed(8)));

    expect(exactResult).to.deep.equal([2, 2]);
  });

  it('should get the middle point of two vectors', () => {
    const v1 = [0, 0];
    const v2 = [10, 0];
    expect(vec.midpoint(v1, v2)).to.deep.equal([5, 0]);
  });

  it('should get the distance between two vectors', () => {
    const v1 = [10, 20];
    const v2 = [40, 60];

    expect(vec.dist(v1, v2)).to.deep.equal(50);
  });

  it('should get the fast distance between two vectors', () => {
    const v1 = [10, 20];
    const v2 = [40, 60];

    expect(vec.fastDist(v1, v2)).to.deep.equal(Math.pow(50, 2));
  });

  it('should compute the determinate of a matrix', () => {
    const m = [
      10, 0, 0,
      0, 5, 0,
      0, 0, 1
    ];
    const m2 = [
      1, 2, 0,
      0, 1, 0,
      0, 0, 1
    ];

    // Use a non-trivial matrix
    const m3 = vec.mCompose(m, m2);

    expect(vec.det(m3)).to.equal(50);
  });

  it('should compute the dot produce of two vectors', () => {
    const v1 = [1, 2];
    const v2 = [4, 5];

    expect(vec.dot(v1, v2)).to.equal(14);
  });

  it('should build a transformation matrix from a composition', () => {
    const expected = [
      0.6852067391745144, -3.1594448443658307, 10,
      2.36214618279032, -0.7948996233041755, 20,
      0, 0, 1
    ];

    const M = compose(
      vec.mTranslate([10, 20]),
      vec.mShear([0.2, 0.3]),
      vec.mScale([3.2, 2.3]),
      vec.mRotate(1.5)
    )(vec.mId);

    expect(M).to.deep.equal(expected);
  })
});
