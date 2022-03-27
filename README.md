# TP Slider

A vanilla javascript slider.

## Usage
```html
<script type="module" src="slider.js" charset="utf-8"></script>

<script type="module">

  var slider = new JASlider({
    wrapper: "#wrapper",
    perView: 3,
  })

  slider.start()

</script>
```

### Options

Option | Default | Values | Description
---- | ---- | ---- | ----
`mode` | `'slider'` | `'slider'`, `'static'`, `'loop'` | Define the slider behaviour
`mouseDrag` | `true` | Boolean | Enable mouse swipe
`buttons` | `true` | Boolean | Enable buttons
`navigation` | `false` | Boolean | Enable navigations dots
`autoplay` | `false` | Boolean | Enable autoplay
`centered` | `false` | Boolean | Center the highlighted slide inside the wrapper, active in `'slider'` mode
`wrapper` | `'#wrapper'` | String | Default: `'#wrapper'`
`slidesBox` | `'.slides'` | String | Default: `'.slides'`
`prevButton` | `'.prev'` | String | Default: `'.prev'`
`nextButton` | `'.next'` | String | Default: `'.next'`
`navigationBox` | `'.jas__nav'` | String | Navigation dots container
`navigationDot` | `'.jas__nav-button'` | String | Navigation dots class
`navigationLabels` | `null` | `null`, `'numbers'`, `'slideTitle'` | HTML displayed in the dots
`perView` | `1` | Integer | Number of visible items
`navSteps` | `1` | Integer | How many steps on button click
`autoplayDelay` | `2000` | Integer | Autoplay Delay
`breakpoints` | - | List of Obj, `(String media query)` => `(Obj)` | Available options : `items`, `factor`, `padding`, `center`
