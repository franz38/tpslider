
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


class Slide{

	constructor(){
			// this.position
	}

}


export class Slider{

	constructor(dom, perView, slidesAmount, activeSlide, autoPlayer, styleHandler, buttonManager, navigationManager, mouseDragManager, tmp_slides){

		this.dom = dom
		this.perView = perView
		this.slidesAmount = slidesAmount
		this.activeSlide = activeSlide
		this.styleHandler = styleHandler
		this.slides = this.dom.slidesBox.children

		this.tmp_slides = tmp_slides
		// console.log(tmp_slides);
		this.tmp_activeSlide = tmp_slides[0]

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
		this.shiftSlide(0, false)
	}


	refreshStyle(shift=false){
		let tmp = this.styleHandler.refreshStyle(this.tmp_slides)

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



	  if(id_to_test>=0 && id_to_test<this.tmp_slides.length){


			if(this.styleHandler.isCentered()){
				return id_to_test;
			}
			else{

				if(id_to_test+this.perView>this.tmp_slides.length){
					return this.tmp_slides.length - this.perView;
				}
				else{
					return id_to_test;
				}
			}



	  }
	  else if(id_to_test<0){
	    return 0;
	  }
	  else{
	    return this.tmp_slides.length-1;
	  }

	}

	dragRelease(dx){
		let currentpos = this.tmp_slides[this.activeSlide].position
		let targetIndex = this.findSlideByPos(parseInt(currentpos) + parseInt(dx));
		this.shiftSlide(targetIndex);
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

			this.tmp_activeSlide.deemphasizes()

	    this.activeSlide = this.parseId(id_tmp);

			// console.log(id_tmp + " ->" + this.activeSlide);

			this.tmp_activeSlide = this.tmp_slides[this.parseId(id_tmp)]

	    if (visibleTransition){
	      this.dom.slidesBox.classList.add('shifting');
	      this.dom.slidesBox.addEventListener(this.transitionEvent, this.transitionEndCallback.bind(this));
	    }

			var position = this.tmp_activeSlide.position

	    this.dom.slidesBox.style.left = - position + "px";


			this.tmp_activeSlide.highlight()

			if (this.autoPlayer != null){ this.autoPlayer.resetTimeout() }

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
