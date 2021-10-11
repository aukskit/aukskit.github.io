'use strict';

// 
class Animator {

	constructor(id, startValue, endValue, totalTime, easingType, updateFunction) {
		this.id = id
		this.startTime = 0;
		this.currentTime = 0;
		this.startValue = startValue;
		this.endValue = endValue;
		this.totalTime = totalTime;
		this.easingType = easingType;
		this.updateFunction = updateFunction;
		this.currentValue = startValue;
	}

	start() {
		this.startTime = performance.now()	// get micro sec order time
	}

	update() {
		this.currentValue = this.getProgress();
		this.updateFunction();
	}

	// 進捗算出
	// e: easingType
	// t: currentTime
	// b: startValue
	// c: endValue
	// d: totalTime
	getProgress() {
		let progress = 0;

		this.currentTime = performance.now() - this.startTime

		if (this.currentTime < 0) return this.startValue;
		if (this.currentTime > this.totalTime) return this.endValue;

		switch (this.easingType) {
		case 'linear':
			progress = (this.endValue - this.startValue) * this.currentTime / this.totalTime + this.startValue;
			break;
		case 'easeInSine':
			progress = -this.endValue * Math.cos(this.currentTime / this.totalTime * Math.PI/2) + this.endValue + this.startValue;
			break;
		default:
			break;
		}
		return progress;
	}

	isDone() {
		if ( this.currentTime > this.totalTime) {
			return true
		} else {
			return false
		}		
	}
}

class Updater {
	
	constructor() {
		this.targets = [];
	}

	add(target) {
		if( this.targets.find(element => element.id == target.id)) {
			// do nothing
		} else {
			this.targets.push(target);
		}
	}

	remove(target) {
		this.targets = this.targets.filter(element => element != target)
	}

	start() {
		this.targets.forEach(element => element.start());
		window.requestAnimationFrame(this.update.bind(this));
	}

	update() {
		window.requestAnimationFrame(this.update.bind(this));
		this.targets.forEach(element => {
			if(element.isDone()){
				this.remove(element);
			} else {
				element.update();
			}
		});
	}

	getValue(id) {
		let target = this.targets.find(element => element.id == id);
		if( target != undefined) {
			return target.getProgress();
		} else {
			return undefined;
		}
	}
}