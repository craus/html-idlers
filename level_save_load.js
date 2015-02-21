(function(){
  var prepareToJSON = function() {
    cells.forEach(function(cell) {
      cell.links.forEach(function(link) {
        link.to = link.to.id
      })
    })
  }

  var restoreAfterJSON = function () {
    cells.forEach(function(cell) {
      cell.links.forEach(function(link) {
        link.to = cells[link.to]
      })
    })
  }
  
  var restoreAfterLoad = function() {
    restoreAfterJSON()
  }

  var getLevelData = function() {
    prepareToJSON()
    var result = JSON.stringify([cells, maze.getCurrent().id])
    restoreAfterJSON()
    return result
  }

  writeLevel = function() {
    $('#levelData').text('')
    $('#levelData').text(getLevelData())
  }
  
  loadLevelFromString = function(s) {
    data = JSON.parse(s)
    destroyAllCells()
    data[0].forEach(function(row) {
      createCell(row)
    })
    restoreAfterLoad()
    return cells[data[1]]
  }

  readLevel = function() {
    loadLevel(function() {
      return loadLevelFromString($('#levelData').val())
    })
  }
})()