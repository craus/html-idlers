function createMovieMaker(params) {
  
  var signPrefix = function(x) { 
    if (x > 0) return "+";
    return "";
  }
  large = function(x) {
    if (x == 0) return 0
    if (Math.abs(x) > 1e4*(1+eps) || Math.abs(x) < 1-eps) return x.toPrecision(4) 
    if (Math.abs(x - Math.floor(x+eps)) < eps) return Math.floor(x+eps)
    return x.toPrecision(4) 
  }
  
  // Rules common things
  
  var gameName = "movieMaker"
  var saveName = gameName+"SaveData"
  
  var processes = []
  
  var savedata
  if (localStorage[saveName] != undefined) {
    savedata = JSON.parse(localStorage[saveName])
  } else {
    savedata = {
      realTime: new Date().getTime()
    }
  }
  console.log("loaded " + gameName + " save: ", savedata)
  
  var saveWiped = false
  
  var save = function(timestamp) {
    if (saveWiped) {
      return
    }
    savedata = {}
    resources.forEach(function(resource) {
      savedata[resource.name] = resource.value
    })
    savedata.realTime = timestamp || new Date().getTime()
    localStorage[saveName] = JSON.stringify(savedata)
  } 
  
  wipeSave = function() {
    saveWiped = true
    localStorage.removeItem(saveName)
    location.reload()
  }
  
  var v = function(initialValue, name) {
    if (savedata[name] != undefined) {
      initialValue = savedata[name]
    }
    return {
      value: initialValue, 
      name: name,
      get: function(){return this.value}
    }
  }
  
  var c = function(calculator) {
    return {
      get: calculator
    }
  }
  
  var k = function(x){return c(function(){return x})}
  
  // rules
   
  var time = v(0, 'time')
  //var clicks = v(0, 'clicks')
  
  var money = v(0, 'money')
  
  var star = function(name) {
    return $.extend(v(0, name), {
      image: "images/" + name + ".jpg"
    })
  }

  var stars = [
    star('Keanu Reeves')
  ]
  
  var star_width = 36
  var star_height = 57
  
  var resources = [
    time,
    money
  ].concat(stars)
  
  var moneyPerSecond = c(function() {
    var total = 1
    return total
  })
  
  var secondTicked = createEvent({
    reward: [
      [time, k(1)],
      [money, moneyPerSecond]
    ]
  })

  var linear = {}
  var singular = {}
  
  var gameEvents = []
    
  var buyEvents = gameEvents.concat([
    buyEvent({
      name: "Advance Second",
      cost: [],
      reward: [[secondTicked, k(1)]],
      type: linear,
      alwaysTopButton: 'off'
    }),     
    buyEvent({
      name: "Wipe Save",
      cost: [],
      reward: [[{
        enabled: true,
        backupSelf: function() { this.enabled = false },
        run: function() {
          if (this.enabled) wipeSave()
        },
        restoreSelf: function() { this.enabled = true }
      }, k(1)]],
      type: linear,
      alwaysTopButton: 'off',
      upButton: 'off'
    })  
  ])
     
  result = $.extend({
    init: function() {
      var stars_div = $('#stars')
      stars.forEach(function(star) {
        stars_div.append('<img id = "' + star.name + '" src="' + star.image + '" width = ' + star_width + ' height = ' + star_height + '>')
      })
    },
    paint: function() {
      $('#money_value').text(money.get())
    },
    tick: function() {
      var currentTime = new Date().getTime()
      var deltaTime = currentTime - savedata.realTime
      secondTicked.run(deltaTime / 1000)
      save(currentTime)
      this.paint()
    }
  }, params)
  return result
}