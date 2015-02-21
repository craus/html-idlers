function createCivilization(params) {
  var population = 1
  var cities = 1
  var food = 0.0
  var minerals = 0.0
  var happyPopulationLimit = 1
  var mineralQuality = 1
  
  var happyPopulation
  var unhappyPopulation
  var workingPopulation
  var averageCityPopulation
  var growthPenalties
  var growthCost
  var dt
  var foodIncome
  
  var buttons = []
  
  var buildCity = function() {
    population -= 2
    minerals -= 30
    cities += 1
  }
  
  civilization = createUnit($.extend({

    paint: function() {
      var x0 = ui.width()/4
      var y0 = 10
      var sz = 40
            
      var lines = 0
      var print = function(text) {
        ui.text(text, x0, y0+sz*lines, colors.white, 40, "start", "top")
        lines += 1
      }
      var button = function(onclick) {
        ui.rect(x0-sz,y0,sz,sz,colors.green)
        buttons.push({l: x0-sz, t: y0, r: x0, b: y0+sz, onclick: onclick})
      }
      buttons = []
      
      print("Population: " + population)
      if (population >= 3 && minerals >= 30) button(buildCity)
      print("Cities: " + cities)
      print("Food: " + Math.floor(food))
      print("Minerals: " + Math.floor(minerals))
      print("Working population: " + workingPopulation) 
      print("Food income: " + foodIncome.toFixed(2))
    },
    tick: function() {
      averageCityPopulation = population / cities
      growthPenalties = Math.floor(averageCityPopulation / 3)
      growthCost = 20 + 10 * growthPenalties
      happyPopulation = Math.min(happyPopulationLimit, population)
      unhappyPopulation = population - happyPopulation
      workingPopulation = happyPopulation + unhappyPopulation / 2
      dt = space.tickTime
      foodIncome = cities * 2 + workingPopulation * 2 - population * 2
    
      food += foodIncome * dt
      if (food < 0) {
        food += 1
        population -= 1
      }
      if (food >= growthCost) {
        food -= growthCost
        population += 1
      }
      
      minerals += mineralQuality * workingPopulation * dt
    },
    click: function(x, y) {
      buttons.forEach(function(button) {
        if (x > button.l && x < button.r && y > button.t && y < button.b) button.onclick()
      }) 
    }
  }, params))
  return civilization
}