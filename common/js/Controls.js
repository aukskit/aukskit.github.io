'use strict';

// Abstraction over common controls for user interaction with a 3D scene
class Controls {

  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.picker = null;

    this.dragging = false;
    this.picking = false;
    this.ctrl = false;

    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.button = 0;
    this.key = 0;

    this.dloc = 0;
    this.dstep = 0;
    this.motionFactor = 10;
    this.keyIncrement = 5;

    canvas.onmousedown = event => this.onMouseDown(event);
    canvas.onmouseup = event => this.onMouseUp(event);
    canvas.onmousemove = event => this.onMouseMove(event);
    canvas.onmousewheel = event => this.onMouseWheel(event);
    window.onkeydown = event => this.onKeyDown(event);
    window.onkeyup = event => this.onKeyUp(event);

    canvas.ontouchstart = event => this.onTouchStart(event);
    canvas.ontouchmove = event => this.onTouchMove(event);
    canvas.ontouchend = event => this.onTouchEnd(event);
  }

  // Sets picker for picking objects
  setPicker(picker) {
    this.picker = picker;
  }

  // Returns 3D coordinates
  get2DCoords(event) {
    let top = 0,
      left = 0,
      canvas = this.canvas;

    while (canvas && canvas.tagName !== 'BODY') {
      top += canvas.offsetTop;
      left += canvas.offsetLeft;
      canvas = canvas.offsetParent;
    }

    left += window.pageXOffset;
    top -= window.pageYOffset;

    return {
      x: event.clientX - left,
      y: this.canvas.height - (event.clientY - top)
    };
  }

  onMouseUp(event) {
    this.dragging = false;

    if (!event.shiftKey && this.picker) {
      this.picking = false;
      this.picker.stop();
    }
  }

  onMouseDown(event) {
    console.log("onMouseDown");
    this.dragging = true;

    this.x = event.clientX;
    this.y = event.clientY;
    this.button = event.button;

    this.dstep = Math.max(this.camera.position[0], this.camera.position[1], this.camera.position[2]) / 100;

    if (!this.picker) return;

    const coordinates = this.get2DCoords(event);
    this.picking = this.picker.find(coordinates);

    if (!this.picking) this.picker.stop();
  }

  onMouseMove(event) {
    this.lastX = this.x;
    this.lastY = this.y;

    this.x = event.clientX;
    this.y = event.clientY;

    if (!this.dragging) return;

    this.ctrl = event.ctrlKey;
    this.alt = event.altKey;

    const dx = this.x - this.lastX;
    const dy = this.y - this.lastY;

    if (this.picking && this.picker.moveCallback) {
      this.picker.moveCallback(dx, dy);
      return;
    }

    if (!this.button) {
      this.alt
        ? this.dolly(dy)
        : this.rotate(dx, dy);
    }
  }

  onTouchEnd(event) {
    console.log("touch end");
    this.dragging = false;

    if (!event.shiftKey && this.picker) {
      this.picking = false;
      this.picker.stop();
    }
  }

  onTouchStart(event) {
    console.log("touch start");
    // Disable Display Scroll
    event.preventDefault();
    this.dragging = true;

    var touchObject = event.changedTouches[0] ;
    this.x = touchObject.pageX;
    this.y = touchObject.pageY;
    this.button = event.button;

    this.dstep = Math.max(this.camera.position[0], this.camera.position[1], this.camera.position[2]) / 100;

    if (!this.picker) return;

    const coordinates = this.get2DCoordsForTouch(event);
    this.picking = this.picker.find(coordinates);

    if (!this.picking) this.picker.stop();

  }

  onTouchMove(event) {
    // Disable Display Scroll
    event.preventDefault();
    this.lastX = this.x;
    this.lastY = this.y;

    var touchObject = event.changedTouches[0] ;

    this.x = touchObject.pageX;
    this.y = touchObject.pageY;


    if (!this.dragging) return;

    this.ctrl = event.ctrlKey;
    this.alt = event.altKey;

    const dx = parseInt(this.x - this.lastX);
    const dy = parseInt(this.y - this.lastY);

    console.log(dx, dy);

    if (this.picking && this.picker.moveCallback) {
      this.picker.moveCallback(dx, dy);
      return;
    }

    if (!this.button) {
      this.rotate(dx, dy);
    }
  }

  // 
  get2DCoordsForTouch(event) {
    var touchObject = event.changedTouches[0] ;

    let top = 0,
      left = 0,
      canvas = this.canvas;

    while (canvas && canvas.tagName !== 'BODY') {
      top += canvas.offsetTop;
      left += canvas.offsetLeft;
      canvas = canvas.offsetParent;
    }

    left += window.pageXOffset;
    top -= window.pageYOffset;

    return {
      x: touchObject.pageX  - left,
      y: this.canvas.height - (touchObject.pageY - top)
    };
  }

  onKeyDown(event) {
    this.key = event.keyCode;
    this.ctrl = event.ctrlKey;

    if (this.ctrl) return;

    switch (this.key) {
      case 37:
        return this.camera.changeAzimuth(-this.keyIncrement);
      case 38:
        return this.camera.changeElevation(this.keyIncrement);
      case 39:
        return this.camera.changeAzimuth(this.keyIncrement);
      case 40:
        return this.camera.changeElevation(-this.keyIncrement);
    }
  }

  onKeyUp(event) {
    if (event.keyCode === 17) {
      this.ctrl = false;
    }
  }

  onMouseWheel(event) {
    if( event.wheelDelta > 0) {
      this.dloc += 10;
    } else {
      this.dloc -= 10;
    }
    this.camera.dolly(this.dloc);
  }

  dolly(value) {
    if (value > 0) {
      this.dloc += this.dstep;
    }
    else {
      this.dloc -= this.dstep;
    }

    this.camera.dolly(this.dloc);
  }

  rotate(dx, dy) {
    const { width, height } = this.canvas;

    const deltaAzimuth = -20 / width;
    const deltaElevation = -20 / height;

    const azimuth = dx * deltaAzimuth * this.motionFactor;
    const elevation = dy * deltaElevation * this.motionFactor;

    this.camera.changeAzimuth(azimuth);
    this.camera.changeElevation(elevation);
  }

}