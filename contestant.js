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
  
  
  var buttons = []
  
  var solveProblem = function() {
    codeLines -= linesPerProblem
    experience += experiencePerProblem
    ideas += ideasPerProblem
  }
  
  var learnAlgorithm = function() {
    algorithms += 1
    experience -= experiencePerAlgorithm
  }
  
  civilization = createUnit($.extend({

    paint: function() {
      var x0 = 40
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
      var income = function(x) { 
        var sign 
        if (x < 0) sign = ""
        else sign = "+"
        return sign + x.toFixed(2)
      }
      buttons = []
      
      print("Experience: " + experience + " (+" + experiencePerProblem + " per problem solved)")
      if (codeLines >= linesPerProblem) button(solveProblem)
      print("Solve problem (costs " + linesPerProblem + " lines of code)")

      print("Lines of code: " + Math.floor(codeLines) + " (+" + linesPerSecond + " per second)")
      
      print("Ideas of new problems: " + ideas.toFixed(2) + " (+" + ideasPerProblem + " per problem solved)")
      
      print("Algorithms: " + algorithms)
      if (experience >= experiencePerAlgorithm) button(learnAlgorithm)
      print("Learn new algorithm (costs " + experiencePerAlgorithm + " experience, +1 experience per problem solved)")
      
      print("Contribution: " + contribution)
      if (ideas >= ideasPerContest) button(createContest)
      print("Create contest (costs " + ideasPerContest + " ideas)")
    },
    tick: function() {
      dt = space.tickTime
      
      experiencePerProblem = 1 + algorithms
      linesPerProblem = 10
      ideasPerProblem = 0.1
      ideasPerContest = 5
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