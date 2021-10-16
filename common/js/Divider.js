'use strict';

// Divide vertices to vertex set
class Divider {

  constructor(object) {
    this.objects = []

    let n = this.getNumberOFVetex(object.vertices);
    for( let i=0; i < n; i++) {
      let o = {...object};
      o.alias = object.alias + '_' + String(i);
      o.pickingColor = this.diffuseColorGenerator(i);
      
      o.indices = object.indices.slice(0, 9);
      let v = object.vertices.slice(9*i, 9*i+9);
      o.position = this.calcInward(v);
      o.vertices = this.translateVertices(v, o.position);
      this.objects.push(o);
    }
  }

  /**
  * Get number of vertex in vertices list
  * @param {number} index
  * @return {list} unique defuse color
  */
  diffuseColorGenerator(index) {
    let colorR = ((index)       % 100) + 50;
    let colorG = (parseInt(index/100  ) % 100) + 50;
    let colorB = (parseInt(index/10000) % 100) + 50;
    return [colorR/255, colorG/255, colorB/255, 1];
  }

  /**
  * Get number of vertex in vertices list
  * @param {list} vertices list of vertices
  * @return {number} n number of vertex
  */
  getNumberOFVetex(vertices) {
    return vertices.length / 9;
  }

  /**
  * Calculate the inward coordinate of the given three points 
  * @param {vec3} vertices list of vertices(3[point]*3[dimention]=9)
  * @return {list} inwart coordinate
  */
  calcInward(vertices) {
    if(vertices.length != 9) {
      throw new Error('Invalid param in calcInward');
    }
    let A = vertices.slice(0,3);
    let B = vertices.slice(3,6);
    let C = vertices.slice(6,9);
    let a = this.calcNorm(B, C);
    let b = this.calcNorm(C, A);
    let c = this.calcNorm(A, B);
    let Ix = (a * A[0] + b * B[0] + c * C[0]) / (a+b+c);
    let Iy = (a * A[1] + b * B[1] + c * C[1]) / (a+b+c);
    let Iz = (a * A[2] + b * B[2] + c * C[2]) / (a+b+c);
    return [Ix, Iy, Iz];
  }

  /**
  * Calculate the distance of the given two points 
  * @param {vec3} p1 coordinate of p1
  * @param {vec3} p2 coordinate of p2
  * @return {number} distance between p1 and p2
  */
  calcNorm(p1, p2) {
    return Math.sqrt(Math.pow(p2[0]-p1[0], 2) + Math.pow(p2[1]-p1[1], 2) + Math.pow(p2[2]-p2[2], 2));
  }

  /**
  * Translates vertices to the given vector direction
  * @param {list} vertices list of vertices(3[point]*3[dimention]=9)
  * @param {list} vec translation vector
  * @return {list} translated vertices
  */
  translateVertices(vertices, vec) {
    for(let i=0; i<vertices.length; i++) {
      vertices[i] -= vec[i%3];
    }
    return vertices;
  }
}