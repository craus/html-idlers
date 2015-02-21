 

window.onload = function() {
 
  space = createSpace({
    ticksPerFrame: 1, 
    speed: 0.3,
    inc: function(current, derivative) {
      return current + derivative * this.tickTime
    }
  })
  bounds = createBounds($('#display-div')[0].offsetWidth, $('#display-div')[0].offsetHeight)
  var xc = (bounds.left + bounds.right)/2
  var yc = (bounds.top + bounds.bottom)/2
 
  units = []
  
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