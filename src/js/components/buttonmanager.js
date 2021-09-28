
export default class ButtonManager{

  constructor(wrapper, prevButton_class, nextButton_class, perClick){

    this.prevButton = wrapper.querySelector(prevButton_class);
    if (this.prevButton == null){
      var div = document.createElement("div");
      div.classList.add(prevButton_class.replace(".", ""));
      wrapper.appendChild(div);
      this.prevButton = div;
    }

    this.nextButton = wrapper.querySelector(nextButton_class);
    if (this.nextButton == null){
      var div = document.createElement("div");
      div.classList.add(nextButton_class.replace(".", ""));
      wrapper.appendChild(div);
      this.nextButton = div;
    }

    this.perClick = perClick;

  }

  activate(slider){
    this.slider = slider
    this.prevButton.addEventListener('click', this.buttonClick.bind(this, -1) );
    this.nextButton.addEventListener('click', this.buttonClick.bind(this, 1) );
  }

  buttonClick(dir){
    let delta = dir*this.perClick;
    this.slider.relativeShift(delta)
  }

}
