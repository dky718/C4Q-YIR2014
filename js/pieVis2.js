(function() {
  var arc, arcTween, arcs, color, currentSlice, dataSet, h, hoverArc, innerRadius, interpolator, outerRadius, padding, paths, scale, svg, t1, t2, t3, t4, t5, t6, toRad, w, yOffset;

  toRad = function(perc) {
    return (perc / 100) * Math.PI * 2;
  };

  dataSet = [
    {
      id: 0,
      startAngle: toRad(0),
      endAngle: toRad(46)
    }, {
      id: 1,
      startAngle: toRad(46),
      endAngle: toRad(46 + 19)
    }, {
      id: 2,
      startAngle: toRad(46 + 19),
      endAngle: Math.PI * 2
    }
  ];

  scale = d3.scale.linear().domain([0, 1]).range([toRad(46 + 19), Math.PI * 2]);

  color = d3.scale.category10();

  w = 300;

  h = 300;

  padding = 25;

  innerRadius = 0;

  outerRadius = w / 2 - padding * 2;

  yOffset = outerRadius + padding;

  arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  hoverArc = d3.svg.arc().innerRadius(innerRadius + 100).outerRadius(outerRadius + 150);

  svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

  arcTween = function(a) {
    var i;
    i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  };

  arcs = svg.selectAll('g.arc').data(dataSet).enter().append('g').attr('class', 'arc').attr('transform', "translate(" + outerRadius + "," + yOffset + ")");

  currentSlice = 0;

  interpolator = function(d, i) {
    var int;
    int = d3.interpolate(d.startAngle, d.endAngle);
    return function(t) {
      if (currentSlice === i) {
        console.log("current is i: " + i);
        d.endAngle = int(t);
        return arc(d);
      } else if (currentSlice > i) {
        return arc(dataSet[i]);
      } else {
        return "";
      }
    };
  };

  paths = arcs.append('path').attr('fill', function(d, i) {
    return color(i);
  });

  t1 = paths.transition().duration(750).attrTween('d', interpolator);

  t2 = t1.transition().duration(750).each("start", function() {
    return currentSlice = 1;
  }).each(function() {
    return d3.select('.one').transition().style('opacity', 1);
  });

  t3 = t2.transition().attrTween('d', interpolator);

  t4 = t3.transition().duration(750).each("start", function() {
    return currentSlice = 2;
  }).each(function() {
    return d3.select('.two').transition().style('opacity', 1);
  });

  t5 = t4.transition().attrTween('d', interpolator);

  t6 = t5.transition().duration(750).each(function() {
    return d3.select('.three').transition().style('opacity', 1);
  });

}).call(this);
