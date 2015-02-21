(function(){
  var id = 0
  
  cells = []
  
  var paintCount = 0
  
  destroyAllCells = function() {
    cells = []
    id = 0
  }
  
  createCell = function(params) {
    
    result = $.extend({
      visible: true,
      visited: 0,
      runTriggers: nop,
      available: function() {return true},
      c: [128,128,128,1],
      id: id,
      links: [],
      invisibleCells: [],
      add: function(side, cell, params) {
        return this.link($.extend({command: side, to: cell}, params))
      },
      
      link: function(params) {
        var link = createLink(params)
        
        this.links.push(link)
        var cell = link.to
        var backLink = link.back({to: this})
        cell.links.push(backLink) 
        var that = this
        operations.push(function() {
          that.links.remove(link)
          cell.links.remove(backLink)
        })
        return cell
      },
      
      unlink: function(to) {
        var link = this.links.find(function(link) { return link.to == to })
        this.links.remove(link)
        var cell = this
        var backLink = link.to.links.find(function(link2) { return link2.to.id == cell.id })
        link.to.links.remove(backLink)
      },
      
      linkPath: function(path, params) {
        var matrix = identityMatrix
        var cell = this
        for (var i = 0; i < path.length; i++) {
          var c = path[i]
          var link = cell.links.find(function(link) { return link.command == c })
          cell = link.to
          matrix = transformByMatrix(matrix, link.matrix)
        }
        this.link($.extend({to: cell, matrix: matrix}, params))
      },
      
      linkThru: function(cells, params) {
        var matrix = identityMatrix
        var cell = this
        for (var i = 0; i < cells.length; i++) {
          var next = cells[i]
          var link = cell.links.find(function(link) { return link.to == next })
          if (link == null) {
            console.log('cannot get link from ' + cell.id + ' to ' + next.id)
          }
          cell = link.to
          matrix = transformByMatrix(matrix, link.matrix)
        }
        this.link($.extend({to: cell, matrix: matrix}, params))       
      },
      
      unsee: function(cell) {
        this.invisibleCells.push(cell)
      },
      
      move: function(side, cell, fromSide, params) {
        
        link = this.links.find(function(link) {return link.command == side})
        if (link != null) {
          return link.to
        } else {
          return this.add(side, cell, $.extend({fromSide: fromSide}, params))
        }
      },
      
      left: function(cell, fromSide, params) { return this.move('l', cell, fromSide, params) },
      up: function(cell, fromSide, params) { return this.move('u', cell, fromSide, params) },
      right: function(cell, fromSide, params) { return this.move('r', cell, fromSide, params) },
      down: function(cell, fromSide, params) { return this.move('d', cell, fromSide, params) },
      
      go: function(side, count) { 
        if (count == 0) return this
        return this.move(side).go(side, count-1)
      },
      
      walk: function(path, cell, fromSide, params) {
        if (path.length == 1) return this.move(path, cell, fromSide, params)
        return this.move(path[0]).walk(path.substring(1), cell, fromSide, params)
      },
      
      room: function(args) {
        var a = args.map
        var b = args.keymap || []
        var legend = args.legend || mazeLibrary.defaultLegend
        var ca = []
        for (var i = 0; i < a.length; i++) {
          ca[i] = []
          for (var j = 0; j < a[i].length; j++) {
            ca[i][j] = legend(this, a[i][j], (b[i] || [])[j])
          }
        }
        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < a[i].length; j++) {
            if (i>0 && !!ca[i][j] && !!ca[i-1][j]) {
              ca[i][j].up(ca[i-1][j])
            }
            if (!!ca[i][j] && !!ca[i][j-1]) {
              ca[i][j].left(ca[i][j-1])
            }
          }
        }
      },
      
      mirror: function() {
        this.links.last().mirror = true
        this.links.last().to.links.last().mirror = true
      },
      
      paintCell: function(painted, depth) {
        if (this.decorative) {
          space.expandLayers(-1)
        }
        if (ui.layer == 0 && !this.decorative || ui.layer == -1 && this.decorative) {
        
          var cp = this.c
          if (!this.available()) {
            cp = colors.mix(cp, [0,0,0,0], 0.75)
          }
          if (this.visited > 0) {
            //cp = colors.mix(cp, [255,192,128,1], 0.25)
          }
          ui.rect(-0.51, -0.51, 1.02, 1.02, cp)
          if (!!this.condition) {
            var cond = this.condition
            var lighted = !this.available()
            ui.symbolycGrid({
              print: function(cross, zero) { 
                return cond.value ? cross : zero
              }, 
              lighted: function(cross, zero) {
                return lighted
              },
              c: cond.c,
              r: 0.015,
              d: 0.03,
              alpha: 0.75
            })        
          }
          if (!!this.trigger) {
            
            var c = this.trigger.c
            var type = this.trigger.type
            var cp = c
            
            var lighted = type == 'on' && triggers[c] || type == 'off' && !triggers[c] || type == 'on-off'
            if (!lighted) {
              cp = colors.mix(cp, [0,0,0,0], 0.25)
            }
            ui.circle0(0,0,0.44, cp, 3)

            ui.symbolycGrid({
              print: function(cross, zero) { 
                return (type == 'on' || type == 'on-off') && cross ||
                       (type == 'off' || type == 'on-off') && zero
              }, 
              lighted: function(cross, zero) {
                return (cross && triggers[c] || zero && !triggers[c])
              },
              c: this.trigger.c
            })
          }
          if (this.isExit) {
            var globalPhase = (space.time / 100.0) % 1
            for (var i = 0; i < 4; i++) {
              var maxRadius = 0.49
              var phase = (globalPhase+i*0.25) % 1 
              ui.circle0(0, 0, maxRadius - phase * maxRadius, colors.alpha([colors.white, colors.black][i%2], phase))    
            }
            this.runTriggers = function() {
              moveLevel()
            }
          }
        }
        if (ui.layer == 1) {
          if (paintManCopies && maze.getCurrent() == this) {

            ui.transformByMatrix(inverseMatrix(maze.getCurrentAnimationMatrix()))
            ui.transformByMatrix(inverseMatrix(maze.getViewTransform()))
            ui.paintMan()
            ui.untransform()
            ui.untransform()
          }
          if (dev.selectedCell == this) {
            ui.transform(0,0,1,-Math.PI/2 *(2+ commands.indexOf(dev.selectedSide[0])))
            ui.line(0.51, 0.51, 0.51, -0.51, 0.02, colors.red)
            ui.untransform()
          }
        }
      },
      
      addTrigger: function(color, type, v) {
        if (v == undefined) {
          if (triggers[color] == undefined) {
            triggers[color] = false
          }
          v = triggers[color]
        }
        triggers[color] = v
        this.trigger = {
          c: color,
          type: type
        }
        this.runTriggers = function() {
          if (type == 'on') triggers[color] = true
          if (type == 'off') triggers[color] = false
          if (type == 'on-off') triggers[color] = !triggers[color]
        }
        return this
      },
      
      on: function(c) { this.addTrigger(colors[c], 'on'); return this },
      off: function(c) { this.addTrigger(colors[c], 'off'); return this },
      onoff: function(c) { this.addTrigger(colors[c], 'on-off'); return this },
      
      exit: function() { this.isExit = true },
      
      addCondition: function(color, v) {
        this.condition = {
          c: color,
          value: v
        }
        triggers[color] = false
        this.available = function() {
          return triggers[color] == v
        }
        return this
      },
      
      open: function(c) { this.addCondition(colors[c], true); return this },
      close: function(c) { this.addCondition(colors[c], false); return this },
     
      mapping: function() {
        var q = new Deque()
        q.enqueue({
          cell: this, 
          distance: 0
        })
        set = {}
        while (!q.isEmpty()) {
          var el = q.dequeue()
          var f = function(){
            if (!!set[el.cell.id] || set[el.cell.id] == 0) return
            set[el.cell.id] = el.distance
            el.cell.links.forEach(function(link) {
              q.enqueue({
                cell: link.to,
                distance: el.distance+1
              })
            })
          }
          f()
        }
        
        Object.keys(set).forEach(function(cellId) {
          var cell = cells[cellId]
          cell.distanceFromStart = set[cellId]
        })      
      }
    }, params)
    
    cells[id] = result
    
    id += 1 
    operations.push(function() {
      cells.remove(result)
      id -= 1
    })
    
    return result
  }
})()
