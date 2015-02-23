function buyEvent(params) {
  var rewardEvent = (params.reward.run != undefined) ? params.reward : createEvent({reward: params.reward})
  return createClickerCommand($.extend({
    check: function(cnt) {
      var insufficientResource = params.cost.find(function(cost) {
        var resource = cost[0]
        var amount = cost[1]
        return resource.value < amount.get() * cnt
      })
      return insufficientResource == null
    },
    rewardEvent: rewardEvent,
    run: function(cnt) {
      params.cost.forEach(function(cost) {
        var resource = cost[0]
        var amount = cost[1]
        resource.value -= amount.get() * cnt
      })
      rewardEvent.run(cnt)
    },      
  }, params))
}