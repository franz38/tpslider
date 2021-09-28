
// slider position manager
class Pmanager{

	static phiToAbs(phi, slider){
		// console.log(phi)
		if (slider instanceof LoopSlider){
			let tmp
			if (phi < slider.perView){
				return phi + slider.slidesAmount - slider.perView
			}
			else if (phi < slider.perView + slider.slidesAmount){
				return phi - slider.perView
			}
			else{
				return phi - slider.slidesAmount - slider.perView
			}
		}
		else if (slider instanceof Slider){ return phi }

	}

	static absToPhi(abs, slider){

		if (slider instanceof LoopSlider){
			let tmp = []
			tmp[0] = abs + slider.perView
			tmp[1] = abs + slider.perView + slider.slidesAmount
			tmp[2] = abs + slider.perView - slider.slidesAmount

			var minDistance = slider.slidesAmount + slider.perView*2
			var bestId = -1
			for(let i=0; i<3; i++){
				// console.log(tmp[i])
				if( (tmp[i] < slider.slidesAmount + slider.perView*2) && (tmp[i] >= 0) ){
					if ( Math.min( Math.abs(tmp[i] - slider.activeSlide), Math.abs(-tmp[i] + slider.activeSlide) ) < minDistance){
						minDistance = Math.min( Math.abs(tmp[i] - slider.activeSlide), Math.abs(-tmp[i] + slider.activeSlide) )
						bestId = tmp[i]
					}
					// console.log("ok")
				}
			}

			if( Math.abs(tmp[bestId] - abs) < Math.abs(-tmp[bestId] + abs) ){

			}

			return bestId;
		}
		else if (slider instanceof Slider){ return abs-1 }

	}

}


export class Slider{

	constructor(dom, perView, slidesAmount, activeSlide, positions, autoPlayer, styleHandler, buttonManager, navigationManager, mouseDragManager){

		this.dom = dom
		this.perView = perView
		this.slidesAmount = slidesAmount
		this.activeSlide = activeSlide
		this.positions = positions
		this.styleHandler = styleHandler
		this.slides = this.dom.slidesBox.children

		this.transitionEvent = this.whichTransitionEvent()

		this.refreshStyle()
		window.addEventListener('resize', this.refreshStyle.bind(this, true));
		this.mode = "slider"


		this.autoPlayer = autoPlayer
		if (this.autoPlayer != null){ this.autoPlayer.initialize(this) }

		this.buttonManager = buttonManager;
		if (this.buttonManager != null){ this.buttonManager.activate(this) }

		this.navigationManager = navigationManager;
		if (this.navigationManager != null){ this.navigationManager.activate(this) }

		this.mouseDragManager = mouseDragManager
		if (this.mouseDragManager != null){ this.mouseDragManager.activate(this) }



		this.initialize()

	}

	initialize(){
		// this.setInputs()
		this.shiftSlide(0, false)
	}

	setInputs(){
		// click (+ swipe)
	    this.dom.slidesBox.onmousedown = this.dragStart.bind(this);

	    // Touch events
	    this.dom.slidesBox.addEventListener('touchstart', this.dragStart.bind(this));
	    this.dom.slidesBox.addEventListener('touchend', this.dragEnd.bind(this));
	    this.dom.slidesBox.addEventListener('touchmove', this.dragAction.bind(this));

	}

	refreshStyle(shift=false){
		this.positions = this.styleHandler.refreshStyle()

		if (shift){
		  this.shiftSlide(this.activeSlide)
		}
	}

	whichTransitionEvent() {
		let t,
		  el = document.createElement("fakeelement");

		let transitions = {
		  "transition"      : "transitionend",
		  "OTransition"     : "oTransitionEnd",
		  "MozTransition"   : "transitionend",
		  "WebkitTransition": "webkitTransitionEnd"
		}

		for (t in transitions){
		  if (el.style[t] !== undefined){
		      return transitions[t];
		  }
		}
	}

	transitionEndCallback(e) {
	    this.dom.slidesBox.removeEventListener(this.transitionEvent, this.transitionEndCallback);
	    this.dom.slidesBox.classList.remove('shifting');
	}

	parseId(id_to_test) {

		// console.log(this.options.mode)
	    if(id_to_test>=0 && id_to_test<this.positions.length){
	      return id_to_test;
	    }
	    else if(id_to_test<0){
	      return 0;
	    }
	    else{
	      return this.positions.length-1;
	    }

	}

	dragRelease(dx){
		let currentpos = this.slides[this.activeSlide].offsetLeft
		let bb = this.findSlideByPos(parseInt(currentpos) + parseInt(dx));
		this.shiftSlide(bb);
	}

	navigationClick(e){
		let target = parseInt(event.target.dataset.slide);
		let parsed = Pmanager.absToPhi(target, this);
		if (this.autoPlayer != null){ this.autoPlayer.stopTimeout() }
		this.shiftSlide( parsed );
	}

	relativeShift(deltaPos){
		if (this.autoPlayer != null){ this.autoPlayer.stopTimeout() }
		this.shiftSlide(this.activeSlide + deltaPos);
	}

	shiftSlide(id_tmp, visibleTransition=true) {

			// console.log(this.activeSlide);

	    // remove 'active' class to the slide
	    this.dom.slidesBox.getElementsByClassName('slide')[this.activeSlide].classList.remove("active")

	    // if navigation dots are active, remove 'active' class to the navigation dot
	    if(this.navigationManager != null){
	    	let xx = Pmanager.phiToAbs(this.activeSlide, this)
	      this.navigationManager.getDot(xx).classList.remove("jas__nav-button--active")
	    }


	    this.activeSlide = this.parseId(id_tmp);


	    if (visibleTransition){
	      this.dom.slidesBox.classList.add('shifting');
	      this.dom.slidesBox.addEventListener(this.transitionEvent, this.transitionEndCallback.bind(this));
	    }

	    var position=this.positions[this.activeSlide];
	    this.dom.slidesBox.style.left = position + "px";


	    // add 'active' class to the slide
	    this.dom.slidesBox.getElementsByClassName('slide')[this.activeSlide].classList.add("active")

	    // if navigation dots are active, add 'active' class to the navigation dot
	    if(this.navigationManager != null){
				let xx = Pmanager.phiToAbs(this.activeSlide, this)
				this.navigationManager.getDot(xx).classList.add("jas__nav-button--active")
	      // this.dom.navigator.getElementsByClassName('jas__nav-button')[].classList.add("jas__nav-button--active")
	    }

			// if (this.autoPlayer != null){ this.autoPlayer.wait = false; }
			if (this.autoPlayer != null){ this.autoPlayer.resetTimeout() }

			// console.log(this.activeSlide);

	}

	findSlideByPos(x){
		var x_sum = 0;
		var i =0;
		for(i=0; i<this.slides.length-1; i++){
			let slide = this.slides[i];
			if( x< x_sum+slide.offsetWidth/2  ){
				return i;
			}
			x_sum +=slide.offsetWidth
		}
		return i;
	}

}


/******************************************************
 *
 *
 * */


export class LoopSlider extends Slider{

	mode = "loop"

	initialize(){
		this.setInputs()
		// this.makeLoop()
		this.shiftSlide(this.perView, false)
		this.mode = "loop"
	}


	dragAction (e) {
		e = e || window.event;

		if(e.type == 'touchmove'){// touch
		  this.dx = e.touches[0].clientX - this.x1;
		}
		else{// mouse
		  this.dx = e.clientX - this.x1;
		}

		this.dom.slidesBox.style.left = (this.posInitial + this.dx) + "px";
		// console.log(this.posInitial )

		if (this.dx > 0){
			console.log("<--")
			if ( parseInt(this.dom.slidesBox.style.left) >= this.positions[ this.perView  ] ){
			  let jump_id = + this.activeSlide + this.slidesAmount
			  this.posInitial = this.positions[ jump_id ]
			  this.shiftSlide(jump_id, false)
			}
		}
		else if (this.dx < 0){
			console.log("-->")
			if ( parseInt(this.dom.slidesBox.style.left) <= this.positions[ this.perView + this.slidesAmount  ] ){
			  let jump_id = + this.activeSlide - this.slidesAmount
			  this.posInitial = this.positions[ jump_id ]
			  this.shiftSlide(jump_id, false)
			}
		}
	}

	navigationClick(e){
		let target = parseInt(event.target.dataset.slide);
		let parsed = Pmanager.absToPhi(target, this)
		this.shiftSlide( parsed );
	}

}
