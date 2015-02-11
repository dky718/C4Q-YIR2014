toRad = (perc) -> (perc/100) * Math.PI*2
dataSet = [
  {startAngle:toRad(0), endAngle: toRad(46)}
  {startAngle:toRad(46), endAngle: toRad(46+19)}
  {startAngle:toRad(46+19), endAngle: Math.PI*2}
]
color         = d3.scale.ordinal().domain([0,1,2]).range(['#929497', '#bbbdbf', '#e6e7e8'])
w             = 300
h             = 300
padding       = 25
innerRadius   = 0
outerRadius   = w / 2 - padding * 2
yOffset       = outerRadius + padding
arc           = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)
hoverArc      = d3.svg.arc().innerRadius(innerRadius + 100).outerRadius(outerRadius + 150)
svg           = d3.select('#pie-chart').append('svg').attr('width', w).attr('height', h)

arcs = svg.selectAll('g.arc')
    .data dataSet
  .enter()
    .append 'g'
    .attr 'class', 'arc'
    .attr 'transform', "translate(#{outerRadius},#{yOffset})"

currentSlice = 0

interpolator = (d, i) ->
  int = d3.interpolate(d.startAngle, d.endAngle)
  (t) ->
    if currentSlice is i
      d.endAngle = int(t)
      arc d
    else if currentSlice > i
      arc dataSet[i]
    else ""

alreadyAnimated = false
window.animatePie = () ->
  fn = ->
    paths = arcs.append('path').attr 'fill', (d,i) -> color i

    t1 = paths.transition().duration(750)
      .attrTween('d', interpolator)

    t2 = t1.transition().duration(750)
      .each "start", -> currentSlice = 1
      .each -> d3.select('.one').transition().style('opacity', 1)

    t3 = t2.transition().attrTween('d', interpolator)

    t4 = t3.transition().duration(750)
      .each "start", -> currentSlice = 2
      .each -> d3.select('.two').transition().style('opacity', 1)

    t5 = t4.transition().attrTween('d', interpolator)

    t6 = t5.transition().duration(750)
      .each -> d3.select('.three').transition().style('opacity', 1)
    alreadyAnimated = true
  fn() unless alreadyAnimated
