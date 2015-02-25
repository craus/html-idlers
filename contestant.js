function createContestant(params) {
  
  // UI 
 
  var x0
  var y0
  var sz = 40
        
  var lines
  var print = function(text, align, baseline, font) {
    ui.text(text, x0, y0+sz*lines, colors.white, font || sz, align || "start", baseline || "top")
    lines += 1
  }
  var button = function(onclick) {
    var d = sz * 0.1
    ui.rect(x0-sz+d,y0+sz*lines+d,sz-2*d,sz-2*d,colors.green)
    buttons.push({l: x0-sz+d, t: y0+sz*lines+d, r: x0-d, b: y0+sz+sz*lines-d, onclick: onclick})
  }
  var commandButton = function(command) {
    command.adjust()
    var d = 0.1
    var arrow = function() {
      ui.polygon([
        {x: 0, y: -0.5+d},
        {x: -0.5+d, y: 0.5-d},
        {x: 0.5-d, y: 0.5-d}
      ])          
    }
    ui.transform(x0-4*sz+sz/2,y0+sz*lines+sz/2,sz)
    if (true) {
      ui.move(0,0)  
      ui.color(command.alwaysTop ? colors.red : colors.green)
      arrow()
      ui.line(-0.5+d, -0.5+d, 0.5-d, -0.5+d,3)
      ui.untransform()
      buttons.push({
        l: x0-4*sz+d, 
        t: y0+sz*lines+d, 
        r: x0-4*sz+sz-d, 
        b: y0+sz+sz*lines-d, 
        onclick: function(){command.switchAlwaysTop()}
      })       
    }
    
    if (command.canZoomUp()) {
      ui.move(1,0)
      ui.color(colors.green)
      arrow()
      ui.untransform()
      buttons.push({
        l: x0-3*sz+d,
        t: y0+sz*lines+d, 
        r: x0-3*sz+sz-d, 
        b: y0+sz+sz*lines-d, 
        onclick: function(){command.zoomUp()}       
      })
    }

    if (command.canZoomDown() && !command.alwaysTop) {
      ui.move(2,0)
      ui.rotate(Math.PI)
      ui.color(colors.green)
      arrow()
      ui.untransform()
      ui.untransform()
      buttons.push({
        l: x0-2*sz+d, 
        t: y0+sz*lines+d, 
        r: x0-2*sz+sz-d, 
        b: y0+sz+sz*lines-d, 
        onclick: function(){command.zoomDown()}
      })       
    }
    
    if (command.canUse()) {
      ui.move(3,0)
      ui.rotate(Math.PI/2)
      ui.color(colors.green)
      arrow()
      ui.untransform()
      ui.untransform()
      buttons.push({
        l: x0-1*sz+d, 
        t: y0+sz*lines+d, 
        r: x0-1*sz+sz-d, 
        b: y0+sz+sz*lines-d, 
        onclick: function(){command.use()}
      })       
    }
    ui.untransform()
  }
  
  var signPrefix = function(x) { 
    if (x > 0) return "+";
    return "";
  }
  large = function(x) {
    if (x == 0) return 0
    if (Math.abs(x) > 1e4 || Math.abs(x) < 1) return x.toPrecision(4) 
    if (Math.abs(x - Math.floor(x)) < eps) return Math.floor(x)
    return x.toPrecision(4) 
  }
  
  // Rules common things
  
  var processes = []
  
  var v = function(initialValue, name) {
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
  
  var codeLines = v(0, 'code lines')
  var experience = v(0, 'experience')
  var algorithms = v(0, 'algorithms')
  var imagination = v(0, 'imagination')
  var blindTyping = v(0, 'blind typing')
  var ideas = v(0, 'ideas')
  var totalIdeas = v(0, 'total ideas') 
  var contribution = v(0, 'contribution')
  var money = v(0, 'money')
  var cormen = v(0, 'cormen level')
  var keyboard = v(0, 'keyboard level')
  var rating = v(0, 'rating')

  var resources = [
    codeLines, 
    experience,
    algorithms,
    imagination,
    blindTyping,
    ideas, 
    totalIdeas, 
    contribution,
    money, 
    cormen,
    keyboard, 
    rating, 
  ]
  
  var ideaGet = createEvent({
    reward: [
      [ideas, k(1)],
      [totalIdeas, k(1)]
    ]
  })
  var ideasPerProblem = function() {return Math.pow(2, imagination.get()) / Math.pow(1.1, Math.floor(totalIdeas.get()))}
  problemSolvedGainsIdea = {
    run: function(cnt) {
      while (cnt > 0) {
        var nextIntTotalIdeas = 1 + Math.floor(totalIdeas.get())
        var partOfIdea = nextIntTotalIdeas - totalIdeas.get()
        var problemForNextIdea = Math.ceil(partOfIdea / ideasPerProblem())
        if (cnt >= problemForNextIdea) {
          cnt -= problemForNextIdea
          ideaGet.run(partOfIdea)
        }
        else {
          ideaGet.run(cnt * ideasPerProblem())
          cnt = 0
        }
      }
    }, 
    reward: [
      [ideas],
      [totalIdeas]
    ]
  }
  var problemSolved = createEvent({
    reward: [
      [experience, c(function(){return Math.pow(1.1, algorithms.get())})], 
      [problemSolvedGainsIdea, k(1)]
    ]
  })
  
  var events = [problemSolved]

  var processes = [
    derivative({
      speed: c(function(){return Math.pow(1.1, blindTyping.get())}),
      value: codeLines
    }),
    derivative({
      speed: contribution,
      value: problemSolved
    }),
  ]

  var buyEvents = [
    {
      name: 'Solve problem',
      cost: [[codeLines, k(10)]],
      reward: problemSolved
    },
    {
      name: 'Create contest',
      cost: [[codeLines, k(500)], [ideas, k(5)]],
      reward: [[money, k(1)], [contribution, c(function(){return 1+rating.get()})]]
    },
    {
      name: 'Play contest',
      cost: [[codeLines, k(50)]],
      reward: [[rating, c(function(){return 1+algorithms.get()})]]
    },
    {
      name: 'Upgrade Cormen',
      cost: [[money, k(10)]],
      reward: [[cormen, k(1)]]
    },
    {
      name: 'Upgrade keyboard',
      cost: [[money, k(10)]],
      reward: [[keyboard, k(1)]]
    }
  ].map(buyEvent).concat([
    {
      name: 'Learn algorithm',
      cost: [[experience, c(function(){return Math.pow(1.1, algorithms.get()) / Math.pow(2, cormen.get())})]],
      reward: [[algorithms, k(1)]]
    },   
    {
      name: 'Learn imagination',
      cost: [[experience, c(function(){return Math.pow(1.1, imagination.get())})]],
      reward: [[imagination, k(1)]]
    },
    {
      name: 'Learn blind typing',
      cost: [[experience, c(function(){return Math.pow(1.1, blindTyping.get()) / Math.pow(2, keyboard.get())})]],
      reward: [[blindTyping, k(1)]]
    },
  ].map(unlinearBuyEvent))
  
  contestant = createUnit($.extend({

    paint: function() {

      buttons = []
      x0 = 250
      y0 = 10
      lines = 0
      resources.forEach(function(resource) {
        print(large(resource.value), 'end')
      })
      x0 = 250
      y0 = 10
      lines = 0
      resources.forEach(function(resource) {
        print(" " + resource.name)
      })
      
      x0 = 700
      y0 = 10
      lines = 0
      buyEvents.forEach(function(buyEvent) {
        commandButton(buyEvent)
        print(buyEvent.name + " " + large(buyEvent.zoom) + " times")
        var delta = buyEvent.getDelta()
        print(delta.map(function(resource) {
          return signPrefix(resource.value) + large(resource.value) + " " + resource.name
        }).join("; "), null, null, 20)
      })
    },
    tick: function() {
      processes.forEach(call('tick'))
    },
    click: function(x, y) {
      buttons.forEach(function(button) {
        if (x > button.l && x < button.r && y > button.t && y < button.b) button.onclick()
      }) 
    }
  }, params))
  return contestant
}