/*
*
* AutoPlayer
*
*/

export default class AutoPlayer{

  constructor(delay, slider, perClick){
    this.delay = delay
    this.slider = slider
    this.perClick = perClick
  }

  initialize(slider){
    this.slider = slider
  }

  /*
  *
  *
  *
  */

  resetTimeout(){

    let delta = this.perClick
    var myself = this
    this.timeout = setTimeout(function () {
      myself.slider.relativeShift(delta)
    }, myself.delay);

  }

  stopTimeout(){
    clearTimeout(this.timeout);
  }


}
