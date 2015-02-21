function createSpace(params) {
  return $.extend({
    tickTime: params.speed / params.ticksPerFrame,
    frameCount: 0,
    tickCount: 0,
    time: 0,
    minLayer: 0, 
    maxLayer: 0,
    expandLayers: function(layer) {
      this.minLayer = Math.min(this.minLayer, layer)
      this.maxLayer = Math.max(this.maxLayer, layer)
    },
    paint: function() {
      debugCounter = 0
      ui.clearDisplay()
      ui.context()
      ui.fillDisplay(colors.white)
      for (ui.layer = this.minLayer; ui.layer <= this.maxLayer; ui.layer++) {
        units.forEach(call('paint')) 
      }
      ui.gradient(colors.white)
    },
    tick: function() {
      this.frameCount++
      for (var i = 0; i < this.ticksPerFrame; i++) {
        this.tickCount++
        this.time += this.tickTime
        units.forEach(call('tick'))
      }
      this.paint()

    }
  }, params)
}