'use strict';

// Visualize a sphere on the screen
class Sphere {

  constructor(radious = 10, N_theta = 10, N_phi = 10, k = 1) {
    this.alias = 'sphere';

    this.position = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.diffuse = [1, 0.5, 0.5, 1];
    this.pickingColor = [0.5, 0.5, 0.5, 1];
    this.radious = radious;
    this.N_theta = N_theta;
    this.N_phi = N_phi;
    this.k = k;
    this.vertices = [];
    this.indices = [];
    this.wireframe = false;
    this.visible = true;

    // build sphere
    [this.vertices, this.indices] = this.build(this.radious, this.N_theta, this.N_phi);

    // stretch vertex of sphere
    this.vertices = this.changeScaleOfVertices(this.vertices, this.indices, this.k);
  }
  /**
  * build the sphere vertices and indices
  * @param radious {number} Radious of sphere
  * @param N_theta {number} Number of divisions of theta
  * @param N_phi {number} Number of divisions of phi
  */
  build(radious, N_theta, N_phi) {
    let v = [];
    let i = [];
    let theta_current, theta_next, phi_current, phi_next; 
    let Ax, Ay, Az, Bx, By, Bz, Cx, Cy, Cz;
    let idx = 0;
    
    for (let theta = 0; theta < N_theta; theta++) {
      theta_current = theta / N_theta * Math.PI;
      theta_next = (theta+1) / N_theta * Math.PI;
      for (let phi = 0; phi < N_phi; phi++) {
        phi_current = phi / N_phi * 2 * Math.PI;
        phi_next = (phi + 1) / N_phi * 2 * Math.PI;
        if( theta !== 0) {
          Ax = radious * Math.sin(theta_current) * Math.cos(phi_current);
          Ay = radious * Math.sin(theta_current) * Math.sin(phi_current);
          Az = radious * Math.cos(theta_current);
          v.push(Ax, Ay, Az);
          i.push(idx++);

          Bx = radious * Math.sin(theta_next) * Math.cos(phi_next);
          By = radious * Math.sin(theta_next) * Math.sin(phi_next);
          Bz = radious * Math.cos(theta_next);
          v.push(Bx, By, Bz);
          i.push(idx++);

          Cx = radious * Math.sin(theta_current) * Math.cos(phi_next);
          Cy = radious * Math.sin(theta_current) * Math.sin(phi_next);
          Cz = radious * Math.cos(theta_current);
          v.push(Cx, Cy, Cz);
          i.push(idx++);
        }
        if( theta !== N_theta - 1) {
          Ax = radious * Math.sin(theta_current) * Math.cos(phi_current);
          Ay = radious * Math.sin(theta_current) * Math.sin(phi_current);
          Az = radious * Math.cos(theta_current);
          v.push(Ax, Ay, Az);
          i.push(idx++);

          Bx = radious * Math.sin(theta_next) * Math.cos(phi_current);
          By = radious * Math.sin(theta_next) * Math.sin(phi_current);
          Bz = radious * Math.cos(theta_next);
          v.push(Bx, By, Bz);
          i.push(idx++);

          Cx = radious * Math.sin(theta_next) * Math.cos(phi_next);
          Cy = radious * Math.sin(theta_next) * Math.sin(phi_next);
          Cz = radious * Math.cos(theta_next);
          v.push(Cx, Cy, Cz);
          i.push(idx++);
        }
      }
    }
    return [v, i]
  }
  /**
  * Stretch/Shrink the size of vertex based on center inward 
  * @param vertices {vec3} list of vertices
  * @param indices {vec3} list of indices
  * @param k {number} scale factor
  */
  changeScaleOfVertices(vertices, indices, k) {
    let _vertices = [...vertices];
    for(let idx = 0; idx < indices.length; idx+=3) {
      let Ax = vertices[3*indices[idx]];
      let Ay = vertices[3*indices[idx]+1];
      let Az = vertices[3*indices[idx]+2];
      let Bx = vertices[3*indices[idx+1]];
      let By = vertices[3*indices[idx+1]+1];
      let Bz = vertices[3*indices[idx+1]+2];
      let Cx = vertices[3*indices[idx+2]];
      let Cy = vertices[3*indices[idx+2]+1];
      let Cz = vertices[3*indices[idx+2]+2];

      let a = myutils.calcNorm(Bx, By, Bz, Cx, Cy, Cz);
      let b = myutils.calcNorm(Cx, Cy, Cz, Ax, Ay, Az);
      let c = myutils.calcNorm(Ax, Ay, Az, Bx, By, Bz);

      let Ix = (a * Ax + b * Bx + c * Cx) / (a+b+c);
      let Iy = (a * Ay + b * By + c * Cy) / (a+b+c);
      let Iz = (a * Az + b * Bz + c * Cz) / (a+b+c);

      _vertices[3*indices[idx]]      = k * Ax + (1-k) * Ix;
      _vertices[3*indices[idx]+1]    = k * Ay + (1-k) * Iy;
      _vertices[3*indices[idx]+2]    = k * Az + (1-k) * Iz;
      _vertices[3*indices[idx+1]]    = k * Bx + (1-k) * Ix;
      _vertices[3*indices[idx+1]+1]  = k * By + (1-k) * Iy;
      _vertices[3*indices[idx+1]+2]  = k * Bz + (1-k) * Iz;
      _vertices[3*indices[idx+2]]    = k * Cx + (1-k) * Ix;
      _vertices[3*indices[idx+2]+1]  = k * Cy + (1-k) * Iy;
      _vertices[3*indices[idx+2]+2]  = k * Cz + (1-k) * Iz;
    }
    return _vertices
  }

  /**
  * Convert degree to radian
  */
  deg2rad(degree) {
    return degree / 180 * Math.PI;
  }

  /**
  * Calculate the distance between vector1 and vector2
  * @param v1 {vec3} vector1
  * @param v2 {vec3} vector2
  * @return {number} the distance
  */
  calcNorm(v1, v2) {
    let ret = vec3.create();
    vec3.subtract(ret, v1, v2);
    return vec3.length(ret);
  }

  /**
  * rotate vector by using quaternion
  * @param a {vec3} the vector to transform
  * @param u {vec3} the axis vector of rotation
  * @param theta {number} rotate angle[degree]
  */
  rotate(a, u, theta) {
    let n = vec3.create();
    let ret = vec3.create();

    // normalize u
    vec3.normalize(n, u);

    // Convert theta unit from degree to radian
    theta = theta / 180 * Math.PI;

    var q = new quat.fromValues(n[0] * Math.sin(theta/2), n[1] * Math.sin(theta/2), n[2] * Math.sin(theta/2), Math.cos(theta/2));
    vec3.transformQuat(ret, a, q);
    return ret;
  }
}