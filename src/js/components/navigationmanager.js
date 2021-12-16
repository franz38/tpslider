

export default class NavigationManager{

	dots = [];

	constructor(wrapper, slidesBox, navigationBox_class, navigationDot_class, navLabels_mode, slides){

		this.navigationBox = wrapper.querySelector(navigationBox_class)
		if (this.navigationBox==null){
			var div = document.createElement("div");
      div.classList.add(navigationBox_class.replace(".", ""));
      wrapper.appendChild(div);
      this.navigationBox = div;
		}

		slides.forEach((element, index) => {
			let dot = this.makeDot(index, navigationDot_class, navLabels_mode)
		  this.navigationBox.appendChild(dot);
			this.dots.push(dot);
			element.setDot(dot);
		});

	}

	makeDot(i, class_, label_){

		var dot = document.createElement("div");
		dot.setAttribute("data-slide", i);
		dot.classList.add(class_.replace(".", ""));

		dot.addEventListener('click', this.dotClick.bind(this, dot) );
		switch (label_){
			case "numbers":
				dot.innerHTML = i+1;
				break;
			// case "slideTitle":
			// 	dot.innerHTML = this.dom.slidesBox.getElementsByClassName('slide')[i].dataset.slidetitle
			// 	break;
			default:
		}

		return dot

	}

  activate(slider){
		// console.log(this.dots[1]);
    this.slider = slider;
  }

  dotClick(dot){
    let id = dot.dataset.slide
    this.slider.shiftSlide(id)
  }

	setActive(index){

	}

	getDot(id){
		return this.dots[id];
	}

}
