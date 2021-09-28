

export default class NavigationManager{

	dots = [];

	constructor(wrapper, slidesBox, navigationBox_class, navigationDot_class, navLabels_mode){

		this.navigationBox = wrapper.querySelector(navigationBox_class)
		if (this.navigationBox==null){
			var div = document.createElement("div");
      div.classList.add(navigationBox_class.replace(".", ""));
      wrapper.appendChild(div);
      this.navigationBox = div;
		}

		var slides_amount = slidesBox.children.length
		for(let i=0; i<slides_amount; i++){
			var dot = document.createElement("div");
			dot.setAttribute("data-slide", i);
      dot.classList.add(navigationDot_class.replace(".", ""));

      dot.addEventListener('click', this.dotClick.bind(this, dot) );
			switch (navLabels_mode){
				case "numbers":
					dot.innerHTML = i+1;
					break;
				// case "slideTitle":
				// 	dot.innerHTML = this.dom.slidesBox.getElementsByClassName('slide')[i].dataset.slidetitle
				// 	break;
				default:
			}

      this.navigationBox.appendChild(dot);
			this.dots.push(dot);
		}
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
