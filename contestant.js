function createContestant(params) {
  
  var experience = 0
  var algorithms = 0
  var rating = 1200
  var contribution = 0
  var codeLines = 0
  var linesPerSecond = 1
  var ideas = 0
  
  var experiencePerProblem
  var linesPerProblem
  var experiencePerAlgorithm
  var ideasPerProblem
  var ideasPerContest
  var contributionPerContest
  var linesPerContest
  
  var buttons = []
  
  var solveProblem = createClickerCommand({
    check: function(cnt) {
      return codeLines >= linesPerProblem * cnt
    },
    run: function(cnt) {
      codeLines -= linesPerProblem * cnt
      experience += experiencePerProblem * cnt
      ideas += ideasPerProblem * cnt
    },
  })
  
  var learnAlgorithm = function(cnt) {
    algorithms += 1
    experience -= experiencePerAlgorithm
  }
  
  var createContest = function(cnt) {
    ideas -= ideasPerContest
    contribution += contributionPerContest
  }
  
  var postHelp = function() {
    contribution -= 1
    experience += experiencePerProblem
    ideas += ideasPerProblem
  }
  
  civilization = createUnit($.extend({

    paint: function() {
      var x0 = 160
      var y0 = 10
      var sz = 40
            
      var lines = 0
      var print = function(text) {
        ui.text(text, x0, y0+sz*lines, colors.white, 40, "start", "top")
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
      
      var income = function(x) { 
        var sign 
        if (x < 0) sign = ""
        else sign = "+"
        return sign + x.toFixed(2)
      }
      buttons = []
      
      print("Experience: " + experience + " (+" + experiencePerProblem + " per problem solved)")
      
      commandButton(solveProblem)
      print("Solve " + solveProblem.zoom + " problems (costs " + linesPerProblem*solveProblem.zoom + " lines of code)")
      
      print("Lines of code: " + Math.floor(codeLines) + " (+" + linesPerSecond + " per second)")
      
      print("Ideas of new problems: " + ideas.toFixed(2) + " (+" + ideasPerProblem + " per problem solved)")
      
      print("Algorithms: " + algorithms)
      if (experience >= experiencePerAlgorithm) button(learnAlgorithm)
      print("Learn new algorithm (costs " + experiencePerAlgorithm + " experience, +1 experience per problem solved)")
      
      print("Contribution: " + contribution + " (+" + contributionPerContest + " per contest created)")
      if (ideas >= ideasPerContest-eps) button(createContest)
      print("Create contest (costs " + ideasPerContest + " ideas)")
      
      if (contribution >= 1) button(postHelp)
      print("Post \"PLEASE HELP ME SOLVE THIS PROBLEM\" (+1 problem solved, -1 contribution)")
    },
    tick: function() {
      dt = space.tickTime
      
      experiencePerProblem = 1 + algorithms
      linesPerProblem = 10
      linesPerContest = 50
      ideasPerProblem = 0.1
      ideasPerContest = 5
      contributionPerContest = 10
      experiencePerAlgorithm = Math.floor(Math.pow(1.1, algorithms))
      
      codeLines += linesPerSecond * dt
    },
    click: function(x, y) {
      buttons.forEach(function(button) {
        if (x > button.l && x < button.r && y > button.t && y < button.b) button.onclick()
      }) 
    }
  }, params))
  return civilization
}