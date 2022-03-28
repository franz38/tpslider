export class BreakpointStyle{

  breakpoint = -1
  style = {}

  constructor(breakpoint, style){
    this.breakpoint = parseInt(breakpoint)
    this.style = style
  }

  isActive(){
    return window.matchMedia("(min-width: " + parseInt(this.breakpoint)  + "px)").matches;
  }

  getStyle(){
    return this.style;
  }

  add(bp){

    var override = false
    if(bp.breakpoint > this.breakpoint){ override = true }

    for (const [key, value] of Object.entries(bp.style)) {
      if ((override) || (this.style[key]==null)){ this.style[key] = value; }
    }

    this.breakpoint = bp.breakpoint

  }

  isCentered(){
    return this.style.centered
  }


}

export class SliderStyler{

  breakpoints = []
  dom
  positions = []
  actualBreakpointSum
  sliderManager
  perView
  mode

  constructor(dom, options, sliderManager, slides){
    // console.log(this);
    this.completeBreakPoints(options)
    this.dom = dom
    this.options = options
    this.sliderManager = sliderManager
    this.perView = options.perView
    this.slidesAmount = sliderManager.amount
    this.slides = slides

    this.mode = options.mode

  }

  completeBreakPoints(options){

    if (options.breakpoints != null){
      for (const [key, value] of Object.entries(options.breakpoints)) {
        this.breakpoints.push( new BreakpointStyle(key, value) )
      }
    }

    this.breakpoints.push( new BreakpointStyle(0, { perView:options.perView, padding: options.padding, centered: options.centered }) )

    this.breakpoints.sort(function(a,b){
      return ( (a.breakpoint>=b.breakpoint) ? 1 : -1 );
      // if (a.breakpoint>=b.breakpoint){ return 1 }
      // return -1
    })

    // console.log(this.breakpoints);

    // this.breakpoints[0].perView = options.perView;
    // this.breakpoints[0].padding = options.padding;
    // this.breakpoints[0].centered = options.centered;

    // console.log(this.breakpoints);

  }

  getBreakPoint(){

    var bp = new BreakpointStyle(-1, {})
    for(var i=0; i<this.breakpoints.length;i++){
      if(this.breakpoints[i].isActive()){
        bp.add(this.breakpoints[i])
      }

    }
    return bp
  }

  isCentered(){
    return this.getBreakPoint().isCentered();
  }

  refreshStyle(slides){

    this.actualBreakpointSum = this.getBreakPoint()
    var style = this.actualBreakpointSum.getStyle()

    this.setWrapperWidth(slides)
    this.makePositions(slides)

    return this.positions;

  }

  setWrapperWidth(slides){

    if (this.mode=="static"){
      this.dom.wrapper.style.width = "max-content";
    }
    else{


      if (this.options.resizeSlider){
        var w = 0;
        for(var i=0; i<this.actualBreakpointSum.style.perView; i++){
          w += this.dom.slidesBox.children[i].offsetWidth;
        }
        this.dom.wrapper.style.width = w + "px";
      }

      if(this.options.resizeSlides){

        let avgW = 0;
        slides.forEach(slide => {
          avgW += slide.width;
        });
        avgW = avgW/slides.length;

        let ratio = this.dom.wrapper.clientWidth/(avgW*this.actualBreakpointSum.style.perView);

        slides.forEach(slide => {
          slide.Resize(slide.width*ratio);
        });

      }


    }

  }


  makePositions(slides){

    // console.log(this.dom.wrapper.offsetWidth);
    // console.log(this.dom.wrapper.clientWidth);
    // console.log(this.dom.wrapper.scrollWidth);

    // centered positions
    if(this.actualBreakpointSum.isCentered()){



      var offset = this.dom.wrapper.offsetWidth/2 - slides[0].width/2;
      slides[0].setOffset(offset);

      slides.forEach(slide => {
        slide.setPosition(offset)
      });


      // var steps = this.dom.slidesBox.children.length
      // this.positions = new Array(steps);
      // var tot = parseInt(this.dom.wrapper.offsetWidth / 2)
      // for(var i=0; i<steps; i++){
      //   this.positions[i] = tot - (this.dom.slidesBox.children[i].offsetWidth / 2)
      //   tot -= this.dom.slidesBox.children[i].offsetWidth
      // }
      // console.log(this.positions[0]);
    }
    // normal positions
    else{
      var slide_width = this.dom.slidesBox.getElementsByClassName('slide')[0].offsetWidth
      var steps = this.dom.slidesBox.children.length - this.actualBreakpointSum.style.perView +1;
      this.positions = new Array(steps);
      this.positions[0] = 0
      for(var i=1;i<steps;i++){
        this.positions[i] = this.positions[i-1] - this.dom.slidesBox.children[i-1].offsetWidth
      }
    }

  }

}
