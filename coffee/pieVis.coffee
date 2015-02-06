toRad = (perc) -> (perc/100) * Math.PI*2
byId = (data, id) -> (data.filter (i) -> i.id is id)[0]
startDataset  = [{id:0, v:toRad(46), off:false, startAngle: 0, endAngle: 0},
                 {id:1, v:toRad(19), off:false, startAngle: toRad(46), endAngle: toRad(46)},
                 {id:2, v:toRad(35), off:false, startAngle: toRad(46+19), endAngle: toRad(46+19)}]

valOne = toRad(46)
valTwo = toRad(46+19)

endDataset    = [{id:0, v:toRad(46), off:false, startAngle:0, endAngle:valOne,scale: d3.scale.linear().domain([0,1]).range([0, valOne]) },
                 {id:1, v:toRad(19), off:false, startAngle: valOne, endAngle: toRad(46+19), scale: d3.scale.linear().domain([0,1]).range([valOne, toRad(46+19)]) },
                 {id:2, v:toRad(35), off:false, startAngle: toRad(46+19), endAngle: Math.PI*2, scale: d3.scale.linear().domain([0,1]).range([toRad(46+19), Math.PI*2]) }]
highlightData = [ { value: 65, off: false }, { value: 35, off: true } ]
color         = d3.scale.category10()
pie           = d3.layout.pie().sort(null).value (d) -> d.v
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

numSteps = 50
timeToProgressScale = d3.scale.linear().domain([0,numSteps]).range([0,1])


arcs = svg.selectAll('g.arc')
    .data startDataset
  .enter()
    .append 'g'
    .attr 'class', 'arc'
    .attr 'transform', "translate(#{outerRadius},#{yOffset})"

paths = arcs.append('path').attr 'fill', (d,i) -> color i

previousTime = 0
steps = 0
currentSlice = 0




stepFn = (time) ->
  if steps > numSteps
    if currentSlice is (endDataset.length - 1)
      return true
    currentSlice += 1
    steps = 0

  paths.attr 'd', (d) ->
    scaledD = byId(endDataset, d.id)
    if d.id < currentSlice
      # Slices that already completing animating.
      return arc(scaledD)
    # Skip future slices.
    return if d.id > currentSlice

    # Copy vals as to not mutate them.
    newVal =
      id: scaledD.id
      v: scaledD.v
      startAngle: scaledD.startAngle
      endAngle: scaledD.endAngle

    progress = timeToProgressScale(steps)
    scaledAngle = scaledD.scale(progress)
    newVal.endAngle = scaledAngle
    return if newVal.endAngle < newVal.startAngle
    v = arc(newVal)
    #console.log "new v is: #{v}"
    v

  #console.log('progress: ', progress)
  previousTime = time
  steps += 1
  false


d3.timer stepFn, 1000
return

paths = arcs.append('path')
    .attr 'fill', (d,i) -> color i
    .attr 'd', (d) -> arc(toRad(d))
    .style 'opacity', (d) -> if d.off then 0 else 1
    .each (d) -> @_current = d

arcs.data(pie(dataset))
paths.data(pie(dataset))
  .transition()
    .duration(4000)
    .attrTween 'd', arcTween

startDataset  = [{v:46, off:false}, {v:0,off:false}, {v:35,off:true}]
arcs.data(pie(dataset))
paths.data(pie(dataset))
  .attr 'd', arc
    .style 'opacity', (d) -> if d.data.off then 0 else 1
  .transition()
    .duration(4000)
    .attrTween 'd', arcTween

arcs.on 'mouseenter', (d, i) ->
  d3.select(this).transition()
    .duration(200).ease('circle').attr 'transform', (d) ->
      dist = 20
      d.midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle
      x = Math.sin(d.midAngle) * dist + outerRadius
      y = -Math.cos(d.midAngle) * dist + yOffset
      "translate(#{x},#{y})"

arcs.on 'mouseleave', (d, i) ->
  d3.select(this)
    .transition().duration(200)
    .ease 'circle'
    .attr 'transform', "translate(#{outerRadius},#{yOffset})"

arcs.append('text')
    .attr 'transform', (d) -> "translate(#{arc.centroid(d)})"
    .attr('text-anchor', 'middle')
    .text (d) -> d.value

pie.value (d) -> d.value

highlightArcs = svg.selectAll('g.highlight')
    .data(pie(highlightData))
  .enter()
    .append('g')
    .attr('class', 'highlight')
    .attr 'transform', "translate(#{outerRadius},#{yOffset})"

highlightArcs.append('path')
  .attr('stroke', (d) -> if d.data.off then 'none' else 'black')
  .attr('fill', 'none')
  .attr('stroke-linecap', 'round')
  .attr 'd', arc

