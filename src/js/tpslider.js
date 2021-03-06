
import AutoPlayer from './components/autoplayer.js';
import NavigationManager from './components/navigationmanager.js';
import ButtonManager from './components/buttonmanager.js';
import SwipeManager from './components/swipemanager.js';

import { Slider } from './components/slider.js';
import { SliderStyler } from './components/stylehandler.js';


/*****************************************************************************************************************************
 *
 * TPSlider
 *
 * The main class
 *
 * Fuctions:
 *  parseOptions -- get optional parameters and integrates them with default ones
 *  getDom -- get dom elements based on this.options classes, get also the amount of slides and the slider width, also if required make buttons and navigation dots
 *  buildButtons -- create prev & next buttons
 *  buildNav -- create navigation dots
 *  refreshPositions -- refresh positions
 *  parseId -- parse the position (if <0 or if>max)
 *  shiftSlide -- perform the shift, add/remove 'active' class, add 'dragging' class to the slider
 *  navShift -- shift to next or previous slide
 *  fetchPos -- based on position found the correct slide, and return it
 *
 */

 class Slide{

   constructor(dom_slide, id){
     this.id = id
     this.dom = dom_slide
     this.shadow = null
     this.shadowPosition = null
     this.width = dom_slide.offsetWidth
     this.position = dom_slide.offsetLeft
     this.dot = null
   }

   setPrevNext(prev, next){
     this.prev = prev
     this.next = next
   }

   setShadow(dom_shadow){
     this.shadow = dom_shadow
   }

   setOffset(offset){
     this.dom.style.marginLeft = offset + "px";
   }

   setPosition(position){
     this.position = this.dom.offsetLeft - position;
   }

   Resize(width){
     this.dom.style.width = width + "px";
     this.width = width;
     this.position = this.dom.offsetLeft;
   }

   getShadowPosition(){ return this.shadow.offsetLeft; }

   setDot(dom_dot){
     this.dot = dom_dot
   }

   highlight(){
     this.dom.classList.add("active")
     if(this.dot != null){ this.dot.classList.add("tp__nav-button--active") }
   }

   deemphasizes(){
     this.dom.classList.remove("active")
     if(this.dot != null){ this.dot.classList.remove("tp__nav-button--active") }
   }

 }


export default class TPSlider{

  constructor(custom_options){
    this.custom_options = custom_options
  }

  start(){

    this.slides = []

    // copy options and integrathe them with default
    this.parseOptions(this.custom_options)

    // look for wrapper and slides container
    this.getDom()

    // console.log(this.slides);

    var autoplayer = null;
    if (this.options.autoplay){
      autoplayer = new AutoPlayer(this.options.autoplayDelay, null, this.options.navSteps)
    }

    var buttonManager = null;
    if(this.options.buttons){
      buttonManager = new ButtonManager(this.dom.wrapper, this.options.prevButton, this.options.nextButton, this.options.navSteps)
    }
    // console.log(buttonManager)

    var navigationManager = null;
    if(this.options.navigation){
      navigationManager = new NavigationManager(this.dom.wrapper, this.dom.slidesBox, this.options.navigationBox, this.options.navigationDot , this.options.navigationLabels, this.slides)
    }
    // console.log(navigationManager)

    var mouseDragManager = null;
    if (true){
      mouseDragManager = new SwipeManager(this.dom.slidesBox, this.options.mouseDrag )
    }


    if (this.options.mode == "slider"){

      var stylehandler = new SliderStyler(this.dom, this.options, this.sliderManager, this.slides)
      var slid = new Slider(this.dom, this.options.perView, this.sliderManager.amount, this.sliderManager.position, autoplayer, stylehandler, buttonManager, navigationManager, mouseDragManager, this.slides);

    }
    else if (this.options.mode == "loop"){
      throw "Loop slider not yet available";
      // var stylehandler = new LoopStyler(this.dom, this.options, this.sliderManager, this.slides)
      // var slid = new LoopSlider(this.dom, this.options.perView, this.sliderManager.amount, this.sliderManager.position, this.positions, autoplayer, stylehandler, buttonManager, navigationManager, mouseDragManager, this.slides);

    }
    else if (this.options.mode == "loop"){
      throw "Static slider not yet available";
    }

    // console.log(this);

  }

  dom = {
    wrapper: null,
    slidesBox: null,
    prevButton: null,
    nextButton: null,
    navigator: null
  }

  options = {
    mode: "slider",
    mouseDrag: true,
    buttons: true,
    navigation: false,
    autoplay: false,
    centered: false,
    wrapper: "#wrapper",
    slidesBox:".slides",
    prevButton:".prev",
    nextButton:".next",
    navigationBox: ".tp__nav",
    navigationDot: ".tp__nav-button",
    navigationLabels: "numbers",
    perView: 3,
    navSteps: 1,
    padding: "1rem",
    breakpoints: null,
    autoplayDelay: 2000,
    animationSpeed: 200,
    resizeSlider: true,
    resizeSlides: false,

  }

  breakpoints = []

  sliderManager = {
    position : 0,
    amount: 0,
    slider_width: -1
  }

  slide_width = -1

  positions = []
  transitionEvent


  // copy options and integrathe them with default
  parseOptions(custom_options){

    custom_options = custom_options || {}
    for (const [key, value] of Object.entries(custom_options)) {
      this.options[key] = value
    }

    if (this.options.mode == "static"){
      //
    }

  }


  // look for wrapper and slides container
  getDom(){

    try{
      if ( (this.dom.wrapper = document.querySelector(this.options.wrapper))==null ) throw "Wrapper not found";
      if ( (this.dom.slidesBox = this.dom.wrapper.querySelector(this.options.slidesBox))==null ) throw "Slides not found";
    }
    catch(err){ console.error(err); }

    this.sliderManager.slider_width = this.dom.wrapper.offsetWidth;
    this.sliderManager.amount = this.dom.slidesBox.getElementsByClassName('slide').length

    for(let i=0; i<this.sliderManager.amount; i++){
      this.slides.push( new Slide(this.dom.slidesBox.getElementsByClassName('slide')[i], i) )
    }

  }


}
