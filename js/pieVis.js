(function() {
  var alreadyAnimated, arc, arcs, color, currentSlice, dataSet, h, hoverArc, innerRadius, interpolator, outerRadius, padding, svg, toRad, w, yOffset;

  toRad = function(perc) {
    return (perc / 100) * Math.PI * 2;
  };

  dataSet = [
    {
      startAngle: toRad(0),
      endAngle: toRad(46)
    }, {
      startAngle: toRad(46),
      endAngle: toRad(46 + 19)
    }, {
      startAngle: toRad(46 + 19),
      endAngle: Math.PI * 2
    }
  ];

  color = d3.scale.ordinal().domain([0, 1, 2]).range(['#929497', '#bbbdbf', '#e6e7e8']);

  w = 300;

  h = 300;

  padding = 25;

  innerRadius = 0;

  outerRadius = w / 2 - padding * 2;

  yOffset = outerRadius + padding;

  arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  hoverArc = d3.svg.arc().innerRadius(innerRadius + 100).outerRadius(outerRadius + 150);

  svg = d3.select('#pie-chart').append('svg').attr('width', w).attr('height', h);

  arcs = svg.selectAll('g.arc').data(dataSet).enter().append('g').attr('class', 'arc').attr('transform', "translate(" + outerRadius + "," + yOffset + ")");

  currentSlice = 0;

  interpolator = function(d, i) {
    var int;
    int = d3.interpolate(d.startAngle, d.endAngle);
    return function(t) {
      if (currentSlice === i) {
        d.endAngle = int(t);
        return arc(d);
      } else if (currentSlice > i) {
        return arc(dataSet[i]);
      } else {
        return "";
      }
    };
  };

  alreadyAnimated = false;

  window.animatePie = function() {
    var fn;
    fn = function() {
      var paths, t1, t2, t3, t4, t5, t6;
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
      return alreadyAnimated = true;
    };
    if (!alreadyAnimated) {
      return fn();
    }
  };

}).call(this);
