mazeLibrary = {
  decorate: function() {
    cells.forEach(function(cell) {
      cell.links.push(createLink({
        x: rnd(-1,1),
        y: rnd(-1,1), 
        z: rnd(0.05,0.5),
        ang: rnd(0, Math.PI),
        to: createCell({decorative: true, c: [160, 160, 160, 0.7]})
      }))
    })  
  },

  defaultLegend: function(start, c, d) { 
    if (c == '.') return null
    if (c == '$') return start
    var cell = createCell()
    if ('a' <= c && c <= 'z') {
      call({
        '0': 'off',
        '1': 'on',
        '2': 'onoff',
      }[d], c)(cell)
    }          
    if ('A' <= c && c <= 'Z') {
      c = c.toLowerCase()
      call({
        '0': 'close',
        '1': 'open',
      }[d], c)(cell)
    }
    if (c == '@') cell.exit()
    return cell
  }, 

}