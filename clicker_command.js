function createClickerCommand(params)
{
  var result = $.extend({
    zoom: 1,
    alwaysTop: false,
    check: function(cnt){return false},
    run: function(cnt){},
    use: function() {
      this.run(this.zoom)
    },
    canUse: function() {
      return this.check(this.zoom)
    },
    canZoomUp: function() {
      return this.check(this.zoom * 10)
    },
    canZoomDown: function() {
      return this.zoom > 1
    },
    zoomUp: function() {
      if (this.canZoomUp()) {
        this.zoom *= 10
        console.log("adjusted up to " + this.zoom)
      }
    },
    zoomDown: function() {
      if (this.canZoomDown()) {
        this.zoom /= 10
        console.log("adjusted down to " + this.zoom)
      }
    },
    adjust: function() {
      if (this.canZoomDown() && !this.canUse()) {
        this.zoom /= 10
        console.log("adjusted down to " + this.zoom)
      }
      if (this.alwaysTop) {
        if (this.canZoomUp()) {
          this.zoom *= 10
          console.log("adjusted up to " + this.zoom)
        }
      }
    },
    switchAlwaysTop: function() {
      this.alwaysTop = !this.alwaysTop
    },
  }, params)
  return result
}