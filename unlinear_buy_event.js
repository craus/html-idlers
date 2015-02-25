function unlinearBuyEvent(params) {
  var rewardEvent = (params.reward.run != undefined) ? params.reward : createEvent({reward: params.reward})
  
  var backup = function(resource) {
    if (resource.reward != undefined) {
      resource.reward.forEach(function(reward) {
        var resource = reward[0]
        backup(resource)
      })
    } else {
      resource.backup = resource.value
    }
  }
  var restore = function(resource) {
    if (resource.reward != undefined) {
      resource.reward.forEach(function(reward) {
        var resource = reward[0]
        restore(resource)
      })
    } else {
      resource.value = resource.backup
    }
  }
  
  
  return createClickerCommand($.extend({
    backup: function() {
      params.cost.forEach(function(cost) {
        var resource = cost[0]
        backup(resource)
      })
      backup(rewardEvent)
    },
    restore: function() {
      params.cost.forEach(function(cost) {
        var resource = cost[0]
        restore(resource)
      })
      restore(rewardEvent)    
    },
    check: function(cnt) {

      this.backup()
      
      this.run(cnt)
      
      var insufficientResource = params.cost.find(function(cost) {
        var resource = cost[0]
        return resource.value < 0
      })
      
      this.restore()
      
      return insufficientResource == null
    },
    rewardEvent: rewardEvent,
    run: function(cnt) {
      for (var i = 0; i < cnt; i++) {
        params.cost.forEach(function(cost) {
          var resource = cost[0]
          var amount = cost[1]
          resource.value -= amount.get() * cnt
        })    
        rewardEvent.run(1)
      }
    },      
  }, params))
}