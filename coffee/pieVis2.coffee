toRad = (perc) -> (perc/100) * Math.PI*2
dataSet = [
  {id: 0, startAngle:toRad(0), endAngle: toRad(46)}
  {id: 1, startAngle:toRad(46), endAngle: toRad(46+19)}
  {id: 2, startAngle:toRad(46+19), endAngle: Math.PI*2}
]
scale = d3.scale.linear()
  .domain([0,1])
  .range([toRad(46+19), Math.PI*2])

color         = d3.scale.category10()
w             = 300
h             = 300
padding       = 25
innerRadius   = 0
outerRadius   = w / 2 - padding * 2
yOffset       = outerRadius + padding
arc           = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)
hoverArc      = d3.svg.arc().innerRadius(innerRadius + 100).outerRadius(outerRadius + 150)
svg           = d3.select('body').append('svg').attr('width', w).attr('height', h)
arcTween = (a) ->
  i = d3.interpolate(@_current, a)
  @_current = i(0)
  (t) -> arc i(t)

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
      console.log "current is i: #{i}"
      d.endAngle = int(t)
      arc d
    else if currentSlice > i
      arc dataSet[i]
    else
      ""

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
