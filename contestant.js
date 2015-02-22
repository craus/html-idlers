function createContestant(params) {
  
  var experience = 0
  var algorithms = 0
  var rating = 1200
  var contribution = 0
  var codeLines = 0
  var linesPerSecond = 1
  var ideas = 0
  var money = 0
  var totalIdeas = 0
  var problemsPerIdea = function(){
    return Math.floor(Math.pow(1.1, totalIdeas))
  }
  var problemsLeftForIdea = problemsPerIdea()
  
  var contributionPercentagePerContest = function(){return 0.1}
  
  var experiencePerProblem = function(){return 1+algorithms}
  var linesPerProblem = 10
  var linesPerContest = 50
  var ideasPerContest = 5
  var contributionPerHelp = 10
  var contributionPerAnswer = 1
  var linesPerAnswer = 20
  var experiencePerAlgorithm = function(algorithms) {
    return Math.floor(Math.pow(1.1, algorithms))
  }
  
  var buttons = []
  
  var solvedSomeProblems = function(cnt) {
    experience += experiencePerProblem() * cnt
    problemsLeftForIdea -= cnt
    while (problemsLeftForIdea <= 0) {
      ideas += 1
      totalIdeas += 1
      problemsLeftForIdea += problemsPerIdea()
    }
  }
  
  var solveProblem = createClickerCommand({
    check: function(cnt) {
      return codeLines >= linesPerProblem * cnt
    },
    run: function(cnt) {
      codeLines -= linesPerProblem * cnt
      solvedSomeProblems(cnt)
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
        result += experiencePerAlgorithm(virtualAlgorithms)
        virtualAlgorithms += 1
      }
      return result
    },
    currentRequiredExperience: function() {
      return this.requiredExperience(this.zoom)
    },
    run: function(cnt) {
      for(var i = 0; i<cnt; i++) {
        experience -= experiencePerAlgorithm(algorithms)
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
      for (var i = 0; i < cnt; i++) {
        contribution += Math.floor(contribution*contributionPercentagePerContest())
      }
    },
  })
  
  var postHelp = createClickerCommand({
    check: function(cnt) {
      return contribution >= contributionPerHelp*cnt
    },
    run: function(cnt) {
      contribution -= contributionPerHelp*cnt
      solvedSomeProblems(cnt)
    },
  })
  
  var postAnswer = createClickerCommand({
    check: function(cnt) {
      return codeLines >= linesPerAnswer * cnt
    },
    run: function(cnt) {
      contribution += contributionPerAnswer*cnt
      codeLines -= linesPerAnswer * cnt
      solvedSomeProblems(cnt)
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
      
      print("Experience: " + experience + " (+" + experiencePerProblem() + " per problem solved)")
      
      commandButton(solveProblem)
      print("Solve " + solveProblem.zoom + " problems (costs " + linesPerProblem*solveProblem.zoom + " lines of code)")
      
      print("Lines of code: " + Math.floor(codeLines) + " (+" + linesPerSecond + " per second)")
      
      print("Ideas of new problems: " + ideas.toFixed(2) + " (+1 after next " + problemsLeftForIdea + " problems solved)")
      
      print("Algorithms: " + algorithms)
      commandButton(learnAlgorithm)
      print("Learn " + 
        learnAlgorithm.zoom + 
        " new algorithms (costs " + 
        learnAlgorithm.currentRequiredExperience() + 
        " experience, +" +
        learnAlgorithm.zoom +
        " experience per problem solved)")
      
      print("Contribution: " + contribution)
      commandButton(createContest)
      print("Create " + 
        createContest.zoom +
        " contests (costs " + 
        ideasPerContest*createContest.zoom + 
        " ideas; +" + 
        Math.floor(contributionPercentagePerContest()*100) + 
        "% contribution)")
      
      commandButton(postHelp)
      print(postHelp.zoom + 
        " times post \"PLEASE HELP ME SOLVE THIS PROBLEM\" (+" +
        postHelp.zoom +
        " problem solved, -" +
        postHelp.zoom*contributionPerHelp +
        " contribution)")
        
      commandButton(postAnswer)
      print(postAnswer.zoom + 
        " times help somebody who post \"PLEASE HELP ME SOLVE THIS PROBLEM\"")
      print("(costs " +
        postHelp.zoom*linesPerAnswer +
        " lines of code, +" +
        postHelp.zoom*contributionPerAnswer +
        " contribution)")        
    },
    tick: function() {
      dt = space.tickTime
      
     
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