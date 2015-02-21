var sides = {
  'l': {
    x: -1
  },
  'r': {
    x: 1
  },
  'u': {
    y: -1
  },
  'd': {
    y: 1
  },
}

commands = 'ldru'

linkParams = {}

function createLink(params) {
  params = $.extend({
    x: 0,
    y: 0,
    z: 1, 
    globalRotate: 0,
    mirror: false,
    back: function(params) {
      var result = createLink($.extend({}, this, {
        matrix: inverseMatrix(this.matrix),
        command: this.fromSide,
        fromSide: this.command,
      }, params))
      return result
    },
    mirrorTransform: function() {
      var mx = this.matrix
      this.matrix = identityMatrix
      if (this.command == 'l' || this.command == 'r') {
        this.matrix = transform(this.matrix, 0,0,1, Math.PI/2)
      }
      this.matrix = mirrorTransform(this.matrix)
      if (this.command == 'l' || this.command == 'r') {
        this.matrix = transform(this.matrix, 0,0,1, -Math.PI/2)
      }  
      this.matrix = transformByMatrix(this.matrix, mx)
    },
    findBackLink: function(from) {
      var mx = this.matrix
      var that = this
      return this.to.links.find(function(link) { 
        return link.to == from && closeMatrices(transformByMatrix(mx, link.matrix), identityMatrix) && link != that
      })
    },
    destroy: function(from) {
      from.links.remove(this)
      var backLink = this.findBackLink(from)
      this.to.links.remove(backLink)
      var that = this
      operations.push(function() {
        from.links.push(that)
        this.to.links.push(backLink)
      })
    },
  }, sides[params.command] || {}, linkParams, params)
  params.to = params.to || createCell()
  params.fromSide = params.fromSide || commands[(commands.indexOf(params.command)+42-params.globalRotate) % 4]
  params.globalRotate = commands.indexOf(params.command)+2-commands.indexOf(params.fromSide)
  params.ang = params.ang || -Math.PI /2 * params.globalRotate
  if (!params.matrix) {
    params.matrix = transform(identityMatrix, params.x, params.y, params.z, params.ang)    
    if (params.mirror) params.mirrorTransform()
  }
  return params
}