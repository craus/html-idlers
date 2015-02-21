 

window.onload = function() {
 
  game = createUnit({
    population: 1,
    cities: 1,
    food: 0,
    paint: function() {
      var x0 = ui.width()/4
      var y0 = 10
      var sz = 40
      var g = ui.g
    
      g.textAlign = "start"
      g.textBaseline = "top"
      ui.color(colors.white)
      
    
      ui.text("Population: " + this.population, x0, y0, colors.white, 40, "center", "top");
      ui.text("Cities: " + this.cities, x0, 50);
      ui.text("Food: " + this.food, x0, 90);
    },
    tick: function() {
      this.population += 1
    }
  })
  
 
  space = createSpace({
    ticksPerFrame: 1, 
    speed: 0.3,
    inc: function(current, derivative) {
      return current + derivative * this.tickTime
    },
  })
  bounds = createBounds($('#display-div')[0].offsetWidth, $('#display-div')[0].offsetHeight)
  var xc = (bounds.left + bounds.right)/2
  var yc = (bounds.top + bounds.bottom)/2
 
  units = [game]
  
  spaceTick = setInterval(space.tick.bind(space), 5)
  
  realTime = 0
  var secondTime = 0
  
  setInterval(function() {
    realTime += 0.1
    secondTime += 1
    
    $('#realTime').text(realTime)
    
    if (secondTime == 10) {
      $('#fps').text(space.frameCount)
      space.frameCount = 0
      secondTime = 0
    }
    $('#debugInfo').text(JSON.stringify(debugInfo))
    $('#frameCount').text(space.frameCount)
    $('#tickCount').text(space.tickCount)
  }, 100)
  
  window.onkeydown = function(e) {
    console.log(e)
  }
}