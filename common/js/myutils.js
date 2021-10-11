'use strict';

// A set of utility functions
const myutils = {

  // resize
  resize() {
    const canvas = document.getElementById('webgl-canvas');
    var d = canvas.ownerDocument;
    var w = d.defaultView;
    var r = canvas.getBoundingClientRect();
    var s = w.getComputedStyle(canvas,"");
    var px = parseFloat(s.paddingLeft);
    var py = parseFloat(s.paddingTop);
    var bx = parseFloat(s.borderLeftWidth);
    var by = parseFloat(s.borderTopWidth);
    var sx = canvas.width / parseFloat(s.width);
    var sy = canvas.height / parseFloat(s.height);

    var body = document.getElementsByTagName('body')[0];
    var margin = body.style.margin;
    
    canvas.width = window.outerWidth - (2 * bx) - 14;
    canvas.height = window.innerHeight - (2 * by);
  },

  // get Circle Vertices & Indices
  getCircle(radious, N, renderingMode='TRIANGLE_FAN') {
    let vertices = [];
    let indices = [];
    let theta, x, y, z=0;
    
    switch( renderingMode) {
      case 'TRIANGLE_STRIP': {
        for (let n = 0; n <= 2 * N; n++) {
          if( n % 2 ) {
            x = 0;
            y = 0;
          } else {
            theta = n / N * Math.PI;
            x = radious * Math.cos(theta);
            y = radious * Math.sin(theta);
          }
          vertices.push(x, y, z);
          indices.push(n);
        }
        break;
      }
      case 'TRIANGLE_FAN': {
        for (let n = 0; n <= N; n++) {
          theta = n / N * 2 * Math.PI;
          x = radious * Math.cos(theta);
          y = radious * Math.sin(theta);
          vertices.push(x, y, z);
          indices.push(n);
        }
        break;
      }
      case 'TRIANGLES': {
        for (let n = 0; n < N; n++) {
          theta = n / N * 2 * Math.PI;
          x = radious * Math.cos(theta);
          y = radious * Math.sin(theta);
          vertices.push(x, y, z);
        }
        for (let m = 2; m < N; m++) {
          indices.push(0, m-1, m);
        }
        break;
      }
    }
    
    return [vertices, indices];
  },
  // get Sphere Vertices & Indices
  getSphere(radious, N, renderingMode='TRIANGLES') {
    let vertices = [];
    let indices = [];
    let theta, phi, x, y, z=0;
    let div = N;
    
    switch( renderingMode) {
      case 'TRIANGLES': {
        for (let t = 0; t <= div; t++) {
          theta = t / div * Math.PI;
          for (let n = 0; n < N; n++) {
            phi = n / N * 2 * Math.PI;
            x = radious * Math.sin(theta) * Math.cos(phi);
            y = radious * Math.sin(theta) * Math.sin(phi);
            z = radious * Math.cos(theta);
            vertices.push(x, y, z);
            // console.log("n:" + n + ", t:" + t + ",x:" + x + ", y:" + y + ",z:" + z);
            if( t === 0 || t === div) {
              break;
            }
          }
        }
        // Top lid
        for (let m = 0; m < N - 1 ; m++) {
          indices.push(0, m+1, m+2);
        }
        indices.push(0, N, 1);

        // Middle
        for (let layer = 0; layer < div - 2; layer++) {
          for (let i = 1; i <= N; i++) {
            let n0 = i + N * layer;
            let n1 = i + N * (layer + 1);
            let n2 = n1 + 1 > N * (layer + 2) ? N * (layer + 1) + 1: n1 + 1;
            indices.push(n0, n1, n2);
            
            let n3 = i + N * layer + 1 > N * (layer + 1) ? N * layer + 1: i + N * layer + 1;
            let n4 = i + N * layer;
            let n5 = i + N * (layer + 1) + 1 > N * (layer + 2) ? N * (layer + 1) + 1: i + N * (layer + 1) + 1;
            indices.push(n3, n4, n5);
          }
        }
        // console.log(vertices.length/3);
        
        // bottom lid
        let end = vertices.length / 3 - 1;
        for (let m = 0; m < N-1 ; m++) {
          indices.push(end, end-m-1, end-m-2);
          // indices.push(end, end-m-2, end-m-1);
        }
        indices.push(end, end-1, end-N);

        // console.log(indices);
      }
    }
    return [vertices, indices];
  },
  // get Sphere Vertices & Indices
  getSphereEasy(radious, N, renderingMode='TRIANGLES') {
    let vertices = [];
    let indices = [];
    let theta, phi, x, y, z=0;
    let div = N;
    
    switch( renderingMode) {
      case 'TRIANGLES': {
        for (let t = 0; t <= div; t++) {
          theta = t / div * Math.PI;
          for (let n = 0; n <= N; n++) {
            phi = n / N * 2 * Math.PI;
            x = radious * Math.sin(theta) * Math.cos(phi);
            y = radious * Math.sin(theta) * Math.sin(phi);
            z = radious * Math.cos(theta);
            vertices.push(x, y, z);
          }
        }
        // Set indices
        for (let layer = 0; layer < div; layer++) {
          for (let i = 0 ; i < N; i++) {
            let n0 = i + (N + 1) * layer;
            let n1 = i + (N + 1) * (layer + 1);
            let n2 = n1 + 1;
            indices.push(n0, n1, n2);
          }
        }
      }
    }
    return [vertices, indices];
  },
  // get Sphere Vertices & Indices
  getSphereUniqueVertex(radious, N_theta, N_phi, renderingMode='TRIANGLES') {
    let vertices = [];
    let indices = [];
    let theta_current, theta_next, phi_current, phi_next; 
    let Ax, Ay, Az, Bx, By, Bz, Cx, Cy, Cz;
    let idx = 0;
    
    switch( renderingMode) {
      case 'TRIANGLES': {
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
              vertices.push(Ax, Ay, Az);
              indices.push(idx++);
  
              Bx = radious * Math.sin(theta_next) * Math.cos(phi_next);
              By = radious * Math.sin(theta_next) * Math.sin(phi_next);
              Bz = radious * Math.cos(theta_next);
              vertices.push(Bx, By, Bz);
              indices.push(idx++);
  
              Cx = radious * Math.sin(theta_current) * Math.cos(phi_next);
              Cy = radious * Math.sin(theta_current) * Math.sin(phi_next);
              Cz = radious * Math.cos(theta_current);
              vertices.push(Cx, Cy, Cz);
              indices.push(idx++);
            }
            if( theta !== N_theta - 1) {
              Ax = radious * Math.sin(theta_current) * Math.cos(phi_current);
              Ay = radious * Math.sin(theta_current) * Math.sin(phi_current);
              Az = radious * Math.cos(theta_current);
              vertices.push(Ax, Ay, Az);
              indices.push(idx++);

              Bx = radious * Math.sin(theta_next) * Math.cos(phi_current);
              By = radious * Math.sin(theta_next) * Math.sin(phi_current);
              Bz = radious * Math.cos(theta_next);
              vertices.push(Bx, By, Bz);
              indices.push(idx++);

              Cx = radious * Math.sin(theta_next) * Math.cos(phi_next);
              Cy = radious * Math.sin(theta_next) * Math.sin(phi_next);
              Cz = radious * Math.cos(theta_next);
              vertices.push(Cx, Cy, Cz);
              indices.push(idx++);
            }
          }
        }
      }
    }
    return [vertices, indices];
  },
  // save() {
  save(filename, vertices, indices) {
    let writeData = {
      vertices,
      indices,
      diffuse : [1.0,0.664,0.0,1.0]
    };

    writeData.vertices = vertices;
    writeData.indices = indices;
  
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(writeData, null, 2)], {
      type: "text/plain"
    }));
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
  convertVertexByCenterGravity(vertices, indices) {
    let _vertices = [...vertices];
    let k = 1.0;
    for(let idx = 0; idx < indices.length; idx+=3) {
      let x0 = vertices[3*indices[idx]];
      let y0 = vertices[3*indices[idx]+1];
      let z0 = vertices[3*indices[idx]+2];
      let x1 = vertices[3*indices[idx+1]];
      let y1 = vertices[3*indices[idx+1]+1];
      let z1 = vertices[3*indices[idx+1]+2];
      let x2 = vertices[3*indices[idx+2]];
      let y2 = vertices[3*indices[idx+2]+1];
      let z2 = vertices[3*indices[idx+2]+2];
      
      _vertices[3*indices[idx]]      = (1+2*k)/3 * x0 + (1-k)/3 * y0 + (1-k)/3 * z0
      _vertices[3*indices[idx]+1]    = (1-k)/3 * x0 + (1+2*k)/3 * y0 + (1-k)/3 * z0
      _vertices[3*indices[idx]+2]    = (1-k)/3 * x0 + (1-k)/3 * y0 + (1+2*k)/3 * z0
      _vertices[3*indices[idx+1]]    = (1+2*k)/3 * x1 + (1-k)/3 * y1 + (1-k)/3 * z1
      _vertices[3*indices[idx+1]+1]  = (1-k)/3 * x1 + (1+2*k)/3 * y1 + (1-k)/3 * z1
      _vertices[3*indices[idx+1]+2]  = (1-k)/3 * x1 + (1-k)/3 * y1 + (1+2*k)/3 * z1
      _vertices[3*indices[idx+2]]    = (1+2*k)/3 * x2 + (1-k)/3 * y2 + (1-k)/3 * z2
      _vertices[3*indices[idx+2]+1]  = (1-k)/3 * x2 + (1+2*k)/3 * y2 + (1-k)/3 * z2
      _vertices[3*indices[idx+2]+2]  = (1-k)/3 * x2 + (1-k)/3 * y2 + (1+2*k)/3 * z2
    }
    
    return [_vertices, indices];
  },
  convertVertexByCenterInward(vertices, indices, k) {
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
    return [_vertices, indices];
  },
  calcNorm(x0, y0, z0, x1, y1, z1) {
    return Math.sqrt(Math.pow(x1-x0, 2) + Math.pow(y1-y0, 2) + Math.pow(z1-z0, 2));
  },
  scaleConvertByCenterGravity(x, y, z, k) {
    let scaleMatrix = mat3.fromValues((1+2*k)/3, (1-k)/3, (1-k)/3, (1-k)/3, (1+2*k)/3, (1-k)/3, (1-k)/3, (1-k)/3, (1+2*k)/3);
    let _x = scaleMatrix[0] * x + scaleMatrix[1] * y + scaleMatrix[2] * z;
    let _y = scaleMatrix[3] * x + scaleMatrix[4] * y + scaleMatrix[5] * z;
    let _z = scaleMatrix[6] * x + scaleMatrix[7] * y + scaleMatrix[8] * z;
    return [_x, _y, _z];
  },
};