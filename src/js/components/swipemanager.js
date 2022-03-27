
export default class SwipeManager{

  constructor(slidesBox, mouseDrag){

    this.slidesBox = slidesBox

    this.slidesBox.addEventListener('touchstart', this.dragStart.bind(this));
    this.slidesBox.addEventListener('touchend', this.dragEnd.bind(this));
    this.slidesBox.addEventListener('touchmove', this.dragAction.bind(this));

    if(mouseDrag){ this.slidesBox.onmousedown = this.dragStart.bind(this); }

  }

  activate(slider){
    this.slider = slider
  }



  dragStart (e) {

		if((e.type=="mousedown") && (e.button!=0)) return;

    if (this.slider.autoPlayer != null){ this.slider.autoPlayer.stopTimeout() }

		e = e || window.event;
		e.preventDefault();
		this.posInitial = this.slidesBox.offsetLeft;
		this.slidesBox.classList.add('dragging');

		if (e.type == 'touchstart') {// touch
		 this.x1 = e.touches[0].clientX;
		}
		else{// mouse
		  this.x1 = e.clientX;
		  this.slidesBox.onmouseup = this.dragEnd.bind(this);
		  this.slidesBox.onmousemove = this.dragAction.bind(this);
		}

	}

  dragAction (e) {
		e = e || window.event;

		if(e.type == 'touchmove'){// touch
		  this.dx = e.touches[0].clientX - this.x1;
		}
		else{// mouse
		  this.dx = e.clientX - this.x1;
		}

		this.slidesBox.style.left = (this.posInitial + this.dx) + "px";
	}

	dragEnd(e) {

    this.slider.dragRelease(this.dx*(-1))
		this.slidesBox.classList.remove('dragging');
		this.slidesBox.onmouseup = null;
		this.slidesBox.onmousemove = null;
		this.dx=0;

	}

}
