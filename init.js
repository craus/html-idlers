 

window.onload = function() {
 
  eps = 1e-2
  game = createContestant()
  
  space = createSpace({speed: 1})
  
  bounds = createBounds($('#display-div')[0].offsetWidth, $('#display-div')[0].offsetHeight)
  var xc = (bounds.left + bounds.right)/2
  var yc = (bounds.top + bounds.bottom)/2
 
  units = [game]
  
  space.setIntervals()
  
  realTime = 0
  var secondTime = 0
  
  setInterval(function() {
    realTime += 0.1
    secondTime += 1
    
    $('#realTime').text("real time: " + realTime)
    
    if (secondTime == 10) {
      $('#fps').text("fps: " + space.frameCount)
      space.frameCount = 0
      secondTime = 0
    }
    
    $('#debugInfo').text(JSON.stringify(debugInfo))
    $('#frameCount').text("frames: " + space.frameCount)
    $('#tickCount').text("ticks: " + space.tickCount)
  }, 100)
  
  window.onkeydown = function(e) {
    console.log(e)
  }
  
  var display = $('#display')[0]
  display.addEventListener('click', function(event) {
    var x = event.pageX - display.offsetLeft
    var y = event.pageY - display.offsetTop
    space.click(x,y)
  })
}