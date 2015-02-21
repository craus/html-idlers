testMazes = {
  testMaze001: function(start){
    var x = start.add('r')
    x = x.add('u')
    var center = x.add('l')
    center.add('d', start)
    x = x.add('u')
    x = x.add('l')
    center.add('u', x)
    x = x.add('l')
    x = x.add('d')
    center.add('l', x)
  },
  
  testMaze002: function(start) {
    start.add('r', start)
    mazeLibrary.decorate()
    mazeLibrary.decorate()
    mazeLibrary.decorate()
  },

  testMaze003: function(start) {
    start.add('r').add('u', start)
  },
  
  testMaze004: function(start) {
    start.add('r').add('r', start).add('u').add('u', start)
  },
  
  testMaze005: function(start) {
    start.right().left().up().down().left().left().right().down().up().right()
  },
  
  testMaze006: function(start) {
    b = start.right().down()
    b.down().
      left().
      down().
      left().
      down().down(start).up().up().
      left().
      up().
      left().left(b).right().right().
      up().
      right().
      up().
      right(start)
  },
  
  testMaze007: function(start) {
    start.go('r', 9).right(start).go('d', 9).down(start)
    var b = createCell()
    var m = start.go('right', 5)
    b.go('r', 9).right(b).go('d', 4).down(m).go('d', 4).down(b)
  },
  
  testMaze008: function(start) {
    start.
      walk('rrddllu').up(start).
      walk('rr').
      walk('rrddl').left(start.walk('rrdd')).
      right().
      walk('ddllu').up(start.walk('ddr')).
      walk('ddr').
      walk('ddrdddll').left(start.walk('rrrrd')).
      walk('rrrrddldllddl').left(start.walk('ddrddrddr')).
      walk('rruurrdrdd').down(start.right()).
      walk('uuur').up(start.walk('dll')).
      up(start.walk('dlldlluurr'))
  },
  
  testMaze009: function(start) {
    testMazes.testMaze008(start)
    cells[19].walk('lldll')
    cells[34].walk('drr').right(cells[48])
    cells[32].walk('uul')
    cells[46].walk('dd').down(cells[54])
  },
  
  testMaze010: function(start) {
    testMazes.testMaze009(start)
    mazeLibrary.decorate()
  },
  
  testMaze011: function(start) {
    testMazes.testMaze010(start)
    cells[4].addTrigger(colors.red, 'on', false)
    cells[5].addTrigger(colors.red, 'off', false)
    cells[6].addTrigger(colors.red, 'on-off', false)
    cells[0].addCondition(colors.red, false)
    return cells[3]
  },
  
  testMaze012: function(start) {
    start.left().close('blue').left().onoff('red').right().right().right().open('red').
      right().close('yellow').down().onoff('blue')
    start.right().up().open('blue').up().onoff('yellow').down().left().close('red').down(start).
      up().left().down(start.left())
    start.left().up().up().open('yellow').up()
    start.right().down().close('blue').left().up(start)
    start.walk('rrd').left(start.walk('rd'))
    mazeLibrary.decorate()
    return null
  },
  
  testMaze013: function(start) {
    var r = start.down().open('green').walk('uuuuu')
    var r2 = r.walk('llluuuurrrrrrddddlll')
    r2.walk('dddddd').on('green')
    r2.walk('lluuuuuurrrrddddddl').left(r)
    mazeLibrary.decorate()
  },
  
  testMaze014: function(start) {
    start.walk('rrrddd').down(start.walk('ru'))
    start.walk('dddrrr').right(start.walk('dl'))
    start.walk('dllddld').left(start.walk('rrr'))
    start.walk('ruullld').left(start.walk('ruuurr')).walk('rdd').down(start.walk('dddrrruu'))
    cells[21].walk('uuuu').left(cells[26].walk('rr'))
    var a = cells[31].walk('rrruuu')
    cells[32].walk('uul').up(cells[37])
    cells[42].walk('rr').right(a)
    cells[39].walk('rruuulll')
    cells[45].walk('uuluullldddddd')
    cells[58].walk('rrrdd')
    cells[64].walk('rrrrr')
    cells[72].walk('rr').right(cells[67])
    cells[48].walk('rrrdd').down(cells[77])
    cells[53].left(cells[83])
    cells[55].open('red')
    cells[23].open('blue')
    cells[11].open('green')
    cells[60].open('yellow')
    cells[18].close('red')
    cells[42].close('blue')
    cells[70].close('blue')
    cells[33].close('green')
    cells[63].close('yellow')
    cells[4].onoff('yellow')
    cells[29].on('red')
    cells[8].off('red')
    cells[68].off('red')
    cells[15].on('blue')
    cells[50].off('blue')
    cells[75].onoff('green')
    cells[48].onoff('green')
    mazeLibrary.decorate()
  },
  
  testMaze015: function(start) {
    start.walk('uuurrddd')
    cells[1].link({x: 2, to: cells[7]})
  },
  
  testMaze016: function(start) {
    linkParams.movingTime = 20
    start.link({x: 2, ang: -0.2, command: 'r'}).link({x: 2, y: 0.5, ang: -0.1, command: 'r'})
    start.link({z: 1.2, y: 1.4, ang: -0.2, command: 'd'})
    .link({z: 1.2, x: 1.6, ang: -0.2, command: 'r'}).walk('dd')
    start.walk('dr').linkPath('lur', {command: 'u'})
    start.walk('ruu')
    //.link({y: -1.5, to: start, command: 'up'})
  },
  
  testMaze017: function(start) {
    start.left().on('red').walk('rr').open('red').walk('rrr')
  },
  
  testMaze018: function(start) {
    linkParams.movingTime = 5
    maxPaintingDistance = 5
    var center = start.link({y: -5, to: createCell({visible: false})})
    var firstCenter = center
    var current = start
    for (var i = 0; i < 6; i++) {
      nextCenter = center.link({ang: -Math.PI / 12, to: createCell({visible: false})})
      var next = nextCenter.link({y: 5})
      current.linkThru([center, nextCenter, next], {command: 'r'})
      current = next
      center = nextCenter
    }
    var last = current
    current = start
    for (var i = 0; i < 4; i++) {
      current = current.link({y: -1.25, command: 'u'})
    }
    center = current
    current = last
    for (var i = 0; i < 3; i++) {
      current = current.link({y: -1.25, command: 'u'})
    }   
    center.linkPath('ddddrrrrrruuu', {globalRotate: 1, command: 'r'})
  },
  
  // squaare of start with rotating 
  testMaze019: function(start) {
    linkParams.movingTime = 5
    //start.link({x: 1, ang: -Math.PI / 2, to: start, command: 'r', globalRotate: 1})
    start.right(start, 'u')
    mazeLibrary.decorate()
    mazeLibrary.decorate()
    mazeLibrary.decorate()
  },
  
  // skull with rotating tunnel from bottom to right
  testMaze020: function(start) {
    linkParams.movingTime = 5
    var a = start.walk('rrddllu').up(start).walk('rr')
    a = a.walk('rrddl').left(a.walk('dd')).walk('r')
    a = a.walk('ddllu').up(a.walk('ll'))
    a.walk('ddrdddddd').link({
      y: 1, ang: -Math.PI/2, to: a.walk('rrru'), command: 'd', globalRotate: 1
    })    
  },
  
  // infinite spiral of 1 cell
  testMaze021: function(start) {
    maxPaintingDistance = 70
    linkParams.movingTime = 10
    start.link({to: start, x: -1, z: 0.5, ang: -1.7, command: 'l', globalRotate: 1})
  },
  
  testMaze022: function(start) {
    maxPaintingDistance = 5
    linkParams.movingTime = 10
    var a = start
    for (var i = 0; i < 5; i++) {
      a = a.link({y: -2, z: 2, ang: 0.1, command: 'u'})
    }
    a = a.link({to: start, y: -2, z: 2, ang: 0.1, command: 'u', mirror: true})
    for (var i = 0; i < 5; i++) {
      a = a.link({x: -2, z: 2, ang: 0.1, command: 'l'})
    }
    a = a.link({to: start, x: -2, z: 2, ang: 0.1, command: 'l', mirror: true})
    //start.linkPath('uuuu', {})
    //start.linkPath('llll', {})
    //start.link({to: start, x: -2, z: 1, ang: 0.1, command: 'l'})
    mazeLibrary.decorate()
  },
  
  testMaze023: function(s) {
    s.walk('rrddddrrruuurr').right(s)
    cells[14].walk('uuulluu').up(cells[8])
    cells[6].walk('llllddddlll').left(cells[17])
    cells[19].walk('lllllllddddrrrrr').right(cells[12])
    cells[33].walk('dddddlll').left(cells[3])
    cells[32].walk('uuuuu').up(cells[22])
    cells[35].walk('uuuuurrrddd').down(cells[24])
  },
  
  testMaze024: function(s) {
    s.walk('rrrddd').down(s, 'l')
  },
  
  // skull with rotating mirroring tunnel from bottom to right
  testMaze025: function(start) {
    linkParams.movingTime = 5
    var a = start.walk('rrdddlluu').up(start).walk('rrd')
    a = a.walk('rrddl').left(a.walk('dd')).walk('r')
    a = a.walk('ddllu').up(a.walk('ll'))
    a.walk('ddrdddddd').down(a.walk('rrru'), 'r', {mirror: true})
  },
  
  testMaze026: function(start) {
    mazeZoom = 0.3
    maxPaintingDistance = 10
    linkParams.movingTime = 5
    start.walk('dddrr').down(start, 'u', {mirror: true})
  },
  
  testMaze027: function(start) {
    mazeZoom = 0.3
    maxPaintingDistance = 10
    linkParams.movingTime = 5
    start.walk('dddrr').right(start, 'l', {mirror: true})
  },
  
  testMaze028: function(start) {
    mazeZoom = 0.3
    maxPaintingDistance = 10
    linkParams.movingTime = 5
    start.walk('dddrr').down(start, 'l', {mirror: true})
  },
  
  testMaze029: function(s) {
    s.walk('ddr').right(s.walk('ddr'), 'r', {mirror: true})
    s.up(s, 'u', {mirror: true})
    mazeLibrary.decorate()
    mazeLibrary.decorate()
    mazeLibrary.decorate()    
  },
  
  testMaze030: function(s) {
    s.walk('ddddrrruuulllll').left(s, 'r', {mirror: true})
    cells[14].walk('dddddd').down(cells[8], 'r')
    cells[18].walk('rrrr').up(cells[4], 'd')
    cells[7].walk('ddddd').down(cells[23], 'd', {mirror: true})
    cells[10].walk('uuuuu').up(cells[2], 'l')
  },
  
  testMaze031: function(start) {
    mazeZoom = 0.3
    maxPaintingDistance = 10
    linkParams.movingTime = 5
    start.walk('ddddddd', start, 'r')
    cells[3].walk('lll')
    cells[9].left(start, 'u', {mirror:true})
  },
  
  testMaze032: function(s) {
    maxDistance = 8
    //maxPaintingDistance = 5
    var m = {mirror: true}
    s.walk('rrrrrrrrrrrrr')
    cells[4].down(s, 'l', m)
    cells[9].up(cells[13], 'r', m)
    cells[3].walk('uuuuu', cells[11], 'd', m)
    cells[7].walk('ddddrdrddddd')
    cells[29].down(cells[28], 'd', m)
    cells[29].walk('rrrrrr', cells[6], 'u')
    cells[0].walk('ul', cells[3], 'd', m)
    cells[32].walk('uuuuurrrrr', cells[20], 'l')
    cells[26].walk('llululuu', cells[43], 'd')
    cells[30].unlink(cells[31])
    cells[30].walk('rr', cells[31])
    cells[42].walk('uuuuu')
    cells[57].walk('rr', cells[57], 'l', {mirror: true, z: 0.7})
    cells[25].walk('rrrr', cells[39])
    cells[32].walk('ddddd')
    cells[66].down(cells[66], 'd')
    cells[64].walk('rrrdddlllllldddrrr', cells[64])
    cells[78].walk('urd', cells[77])
    cells[72].walk('rul', cells[71])
    cells[84].walk('urd', cells[85])
    cells[86].walk('rul', cells[87])
    cells[88].up(cells[91], 'r', m)
    cells[89].up(cells[90], 'r', m)
    cells[89].walk('rrdd', cells[75])
    steps = {x: -1, z: 0.7, command: 'l'}
    cells[37].link(steps).link(steps).link(steps).link(steps).link(steps).walk('lll', cells[29], 'l')
    cells[16].walk('r')
    cells[39].unlink(cells[40])
    cells[39].walk('uuu', cells[40])
    cells[84].walk('lluurr', cells[91], 'u', m)
    cells[106].walk('dld', cells[93])
    cells[81].walk('ddd', cells[73], 'd')
    cells[18].unlink(cells[19])
    cells[18].walk('ddd', cells[19])
    cells[115].walk('rrrrr')
    return cells.last()
  },
  
  testMaze033: function(start) {
    start.room({
      legend: mazes.defaultLegend,
      map: [
        '.#@#.',
        '.G.B.',
        '.BYG.',
        '..R..',
        '.b#g.',
        'y#GBy',
        '#R.b#',
        'rGBY#',
        '.$Rr.'
      ], 
      keymap: [
        '.#@#.',
        '.0.0.',
        '.111.',
        '..0..',
        '.0#2.',
        '1#100',
        '#1.1#',
        '0010#',
        '.$01.'
      ]
    })
  },
}