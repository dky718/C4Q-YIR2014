(function() {
  var alreadyAnimated, arc, arcs, color, currentSlice, dataSet, h, highlightData, hoverArc, innerRadius, interpolator, outerRadius, padding, svg, toRad, w, xOffset, yOffset;

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

  highlightData = [
    {
      startAngle: toRad(0),
      endAngle: toRad(46 + 19)
    }
  ];

  color = d3.scale.ordinal().domain([0, 1, 2]).range(['#929497', '#bbbdbf', '#e6e7e8']);

  w = 300;

  h = 300;

  padding = 25;

  innerRadius = 0;

  outerRadius = w / 2 - padding * 2;

  yOffset = outerRadius + padding;

  xOffset = outerRadius + padding * 2;

  arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  hoverArc = d3.svg.arc().innerRadius(innerRadius + 100).outerRadius(outerRadius + 150);

  svg = d3.select('#pie-chart').append('svg').attr('width', w).attr('height', h);

  arcs = svg.selectAll('g.arc').data(dataSet).enter().append('g').attr('class', 'arc').attr('transform', "translate(" + xOffset + "," + yOffset + ")");

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

  window.c4qD3AnimatePie = function() {
    var fn;
    fn = function() {
      var paths, t1, t10, t11, t2, t3, t4, t5, t6, t7, t8, t9;
      paths = arcs.append('path').attr('fill', function(d, i) {
        return color(i);
      });
      t1 = paths.transition().duration(750).attrTween('d', interpolator);
      t2 = t1.transition().duration(750).each("start", function() {
        return currentSlice = 1;
      }).each(function() {
        return d3.selectAll($('.vis-tooltip.one *')).transition().style('opacity', 1);
      });
      t3 = t2.transition().attrTween('d', interpolator).each(function() {
        return d3.selectAll($('.vis-tooltip.one *')).transition().duration(700).style('opacity', 0.2);
      });
      t4 = t3.transition().duration(750).each("start", function() {
        return currentSlice = 2;
      }).each(function() {
        return d3.selectAll($('.vis-tooltip.two *')).transition().style('opacity', 1);
      });
      t5 = t4.transition().attrTween('d', interpolator).each(function() {
        return d3.selectAll($('.vis-tooltip.two *')).transition().duration(700).style('opacity', 0.2);
      });
      t6 = t5.transition().duration(750).each(function() {
        return d3.selectAll($('.vis-tooltip.three *')).transition().style('opacity', 1);
      });
      t7 = t6.transition().each(function() {
        return d3.selectAll($('.vis-tooltip.three *')).transition().style('opacity', 0.2);
      });
      t8 = t7.transition().each(function() {
        return d3.selectAll($('.vis-tooltip *')).transition().style('opacity', 0);
      });
      t9 = t8.transition().each(function() {
        var highlight, p;
        highlight = svg.selectAll('g.highlight').data(highlightData).enter().append('g').attr('class', 'highlight').style('opacity', 0).attr('transform', "translate(" + xOffset + "," + yOffset + ")");
        p = highlight.append('path').attr('stroke', 'rgb(189,69,52)').attr('fill', 'none').attr('stroke-width', '3px').attr('stroke-linecap', 'round').attr('d', arc);
        return highlight.transition().duration(750).style('opacity', '1');
      });
      t10 = t9.transition().duration(750).each(function() {
        return d3.selectAll($('.vis-tooltip.four *')).transition().style('opacity', 1);
      });
      t11 = t10.transition().each(function() {
        return d3.select('.access-cohort p').transition().style('opacity', 1);
      });
      t11.transition().each(function() {
        return d3.select('.access-cohort ul').transition().style('opacity', 1);
      });
      return alreadyAnimated = true;
    };
    if (!alreadyAnimated) {
      return fn();
    }
  };

}).call(this);
