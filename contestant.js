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
  
  var getExperiencePerAlgorithm = function(algorithms) {
    return Math.floor(Math.pow(1.1, algorithms))
  }
  var getCurrentExperiencePerAlgorithm = function() {
    return getExperiencePerAlgorithm(algorithms)
  }
  
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
  
  var learnAlgorithm = createClickerCommand({
    check: function(cnt) {
      return experience >= this.requiredExperience(cnt)
    },
    requiredExperience: function(cnt) {
      var result = 0
      var virtualAlgorithms = algorithms
      for(var i = 0; i<cnt; i++) {
        result += getExperiencePerAlgorithm(virtualAlgorithms)
        virtualAlgorithms += 1
      }
      return result
    },
    currentRequiredExperience: function() {
      return this.requiredExperience(this.zoom)
    },
    run: function(cnt) {
      for(var i = 0; i<cnt; i++) {
        experience -= getCurrentExperiencePerAlgorithm()
        algorithms += 1
      }
    }
  })
  
  var createContest = createClickerCommand({
    check: function(cnt) {
      return ideas >= ideasPerContest*cnt-eps
    },
    run: function(cnt) {
      ideas -= ideasPerContest*cnt
      contribution += contributionPerContest*cnt
    },
  })
  
  var postHelp = createClickerCommand({
    check: function(cnt) {
      return contribution >= cnt
    },
    run: function(cnt) {
      contribution -= cnt
      experience += experiencePerProblem*cnt
      ideas += ideasPerProblem*cnt
    },
  })
  
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
      commandButton(learnAlgorithm)
      print("Learn " + 
        learnAlgorithm.zoom + 
        " new algorithms (costs " + 
        learnAlgorithm.currentRequiredExperience() + 
        " experience, +" +
        learnAlgorithm.zoom +
        " experience per problem solved)")
      
      print("Contribution: " + contribution + " (+" + contributionPerContest + " per contest created)")
      commandButton(createContest)
      print("Create " + 
        createContest.zoom +
        " contests (costs " + 
        ideasPerContest*createContest.zoom + 
        " ideas)")
      
      commandButton(postHelp)
      print(postHelp.zoom + 
        " times post \"PLEASE HELP ME SOLVE THIS PROBLEM\" (+" +
        postHelp.zoom +
        " problem solved, -" +
        postHelp.zoom +
        " contribution)")
    },
    tick: function() {
      dt = space.tickTime
      
      experiencePerProblem = 1 + algorithms
      linesPerProblem = 10
      linesPerContest = 50
      ideasPerProblem = 0.1
      ideasPerContest = 5
      contributionPerContest = 10
      experiencePerAlgorithm = getCurrentExperiencePerAlgorithm()
      
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