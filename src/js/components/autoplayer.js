/*
*
* AutoPlayer
*
*/

export default class AutoPlayer{

  constructor(delay, slider){
    this.delay = delay
    this.slider = slider
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
    
    var myself = this
    this.timeout = setTimeout(function () {
      myself.slider.relativeShift(1)
    }, myself.delay);

  }

  stopTimeout(){
    clearTimeout(this.timeout);
  }


}
