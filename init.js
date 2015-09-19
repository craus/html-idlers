window.onload = function() {
  if(typeof(Storage) !== "undefined") {
  } else {
    console.log("Sorry! No Web Storage support..")
  } 
 
  eps = 1e-8
  game = createMovieMaker()
  
  var realTime = 0
  var secondTime = 0
    
  setInterval(function() {
    realTime += 0.1
    secondTime += 1
    
    $('#realTime').text("real time: " + realTime)
    
    if (secondTime == 10) {
      secondTime = 0
    }
    
    $('#debugInfo').text(JSON.stringify(debugInfo))
  }, 100)
  
  game.init()
  setInterval(function() {
    game.tick()
  }, 10)
  
  window.onkeydown = function(e) {
    console.log(e)
  }
}