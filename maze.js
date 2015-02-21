function createMaze(x, y, z, construct) {

  z = 200
  maxDistance = 6
  maxPaintingDistance = 3.5
  movingTime = 2
  mazeZoom = 1
  paintManCopies = false
  
  space.expandLayers(1) // man is painted on 1st layer
  
  var inList = function(list, value) {
    return list.some(function(t) {
      return closeMatrices(t, value)
    })
  }  
  
  var bfs = function(painting, set, queue) {
    if (!painting.cell.visible) return
    if (painting.distance > maxDistance) {
      return
    }
    var m = painting.matrix
    if ((Math.abs(m[0])+Math.abs(m[1])+Math.abs(m[2])+Math.abs(m[3]))*z < 1) return
    if (dist(painting.matrix[4], painting.matrix[5]) > maxPaintingDistance) return
    if (current.invisibleCells.indexOf(painting.cell) != -1) return
    
    var list = set[painting.cell.id] = set[painting.cell.id] || []
    
    if (inList(list, painting.matrix)) {
      return
    }
    list.push(painting.matrix)
    
    painting.cell.links.forEach(function(link) {
      var matrix = transformByMatrix(painting.matrix, link.matrix)
      queue.enqueue({
        cell: link.to, 
        matrix: matrix,
        distance: painting.distance+1
      })
    })
  }

  var start = createCell()
  var current = construct(start) || start
  start.mapping()
  var lastLink = null
  var currentMoveTime = movingTime
  var movedOn = -100500
  paintingSet = null
  var viewTransform = identityMatrix
  var animationMatrix = identityMatrix
  var mirrored = false
  
  var commandTransform = {
    u: 'u',
    r: 'r',
    d: 'd',
    l: 'l'
  }
  
  var result = createUnit({
    start: start,
    getCurrent: function() { return current },
    setCurrent: function(value) { 
      current = value
      this.moved() 
    },
    getCurrentAnimationMatrix: function() {
      var currentMovingTime = space.time - movedOn
      var k = Math.max(0,1 - currentMovingTime / currentMoveTime)
      return matrixPow(animationMatrix, k) // animation matrix
    },
    getViewTransform: function() {
      return viewTransform
    },
    paint: function() {
      
      ui.transform(x,y,z * mazeZoom,0) // mazeTransform
      
      ui.transformByMatrix(viewTransform) // viewTransform
      
      ui.transformByMatrix(this.getCurrentAnimationMatrix())
      
      Object.keys(paintingSet).forEach(function(cellId) {
        var cell = cells[cellId]
        var matrices = paintingSet[cellId]

        matrices.forEach(function(matrix) {
          ui.transformByMatrix(matrix)
          
          cell.paintCell()
          ui.untransform()
        })
      })
      
      ui.untransform() // animation matrix
      
      ui.untransform() // viewTransform
      ui.paintMan()
      ui.untransform() // mazeTransform
    },
    key: function(command, e) {   
      if (!command) return
      var originalCommand = command
      command = commandTransform[command]
      var link = current.links.find(function(link) {return link.command == command})

      e = e || {}
      
      if (dev.on) {
        if (e.shiftKey) {
          dev.selectedCell = current
          dev.selectedSide = command
          return
        } else if (e.ctrlKey) {
          if (!link) {
            operations.push(operationSeparator)
            var oldLink = dev.selectedLink()
            if (oldLink != null) {
              console.log('destroy')
              oldLink.destroy(dev.selectedCell)
            }
            current.move(command, dev.selectedCell, dev.selectedSide)
            dev.selectedCell = dev.selectedSide = null
            this.key(originalCommand)
            return
          }
        }
      }
      if (!link) {
        return
      }
      (function() {
        var saveCurrent = current
        var saveMirrored = mirrored
        var saveAnimationMatrix = animationMatrix
        var saveViewTransform = viewTransform
        var saveCommandTransform = commandTransform
        operations.push(function() {
          current = saveCurrent
          mirrored = saveMirrored
          animationMatrix = saveAnimationMatrix
          viewTransform = saveViewTransform
          commandTransform = saveCommandTransform
        })      
      })()

      target = link.to
      if (!target.available()) return
      lastLink = link
      
      animationMatrix = identityMatrix

      animationMatrix = transform(animationMatrix, 0,0,1, link.globalRotate * Math.PI / 2)

      
      var turns = link.globalRotate
      if (mirrored) turns = -turns
      turns = (turns + 40) % 4
      for (var i = 0; i < turns; i++) {
        commandTransform = transformMap(commandTransform, singleCommandTransform)
      }      
      
      if (link.mirror) {
        mirrored = !mirrored
        if (link.command == 'l' || link.command == 'r') {
          viewTransform = transform(viewTransform, 0,0,1,Math.PI/2)
          animationMatrix = transform(animationMatrix, 0,0,1,Math.PI/2)
        }
        if (originalCommand == 'l' || originalCommand == 'r') {
          commandTransform = transformMap(commandTransform, singleCommandTransform)
        }
        animationMatrix = mirrorTransform(animationMatrix, link.mirror)   
        viewTransform = mirrorTransform(viewTransform)
        commandTransform = transformMap(commandTransform, mirrorCommandTransform)
        
        if (originalCommand == 'l' || originalCommand == 'r') {
          for (var i = 0; i < 3; i++) {
            commandTransform = transformMap(commandTransform, singleCommandTransform)
          }
        }
        if (link.command == 'l' || link.command == 'r') {
          animationMatrix = transform(animationMatrix, 0,0,1,-Math.PI/2)
          viewTransform = transform(viewTransform, 0,0,1,-Math.PI/2)
        }        
      }
      animationMatrix = transformByMatrix(animationMatrix, link.matrix)    

      viewTransform = transform(viewTransform, 0, 0, 1, -link.globalRotate * Math.PI / 2)

      movedOn = space.time
      currentMoveTime = link.movingTime || movingTime
      current = target
      current.visited += 1
      this.moved()
      current.runTriggers()
      var nonvisited = cells.find(function(cell) { return cell.visited == 0 })
      debug(current.id, commandTransform, mirrored)
    },
    moved: function() {
      var q = new Deque()
      q.enqueue({
        cell: current, 
        matrix: [1,0,0,1,0,0],
        distance: 0
      })
      paintingSet = {}
      while (!q.isEmpty()) {
        var painting = q.dequeue()
        bfs(painting, paintingSet, q)
      }     
    }
  })
  result.moved()
  operations = [operationSeparator]
  return result
}