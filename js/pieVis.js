(function() {
  var arc, arcTween, arcs, byId, color, currentSlice, endDataset, h, highlightArcs, highlightData, hoverArc, innerRadius, linScale, numSteps, outerRadius, padding, paths, pie, previousTime, startDataset, stepFn, steps, svg, toRad, valOne, valTwo, w, yOffset;

  toRad = function(perc) {
    return (perc / 100) * Math.PI * 2;
  };

  byId = function(data, id) {
    return (data.filter(function(i) {
      return i.id === id;
    }))[0];
  };

  startDataset = [
    {
      id: 0,
      v: toRad(46),
      off: false,
      startAngle: 0,
      endAngle: 0
    }, {
      id: 1,
      v: toRad(19),
      off: false,
      startAngle: toRad(46),
      endAngle: toRad(46)
    }, {
      id: 2,
      v: toRad(35),
      off: false,
      startAngle: toRad(46 + 19),
      endAngle: toRad(46 + 19)
    }
  ];

  valOne = toRad(46);

  valTwo = toRad(46 + 19);

  console.log("valOne: " + valOne);

  console.log("valTwo: " + valTwo);

  endDataset = [
    {
      id: 0,
      v: toRad(46),
      off: false,
      startAngle: 0,
      endAngle: valOne
    }, {
      id: 1,
      v: toRad(19),
      off: false,
      startAngle: valOne,
      endAngle: toRad(46 + 19)
    }, {
      id: 2,
      v: toRad(35),
      off: false,
      startAngle: toRad(46 + 19),
      endAngle: Math.PI * 2
    }
  ];

  highlightData = [
    {
      value: 65,
      off: false
    }, {
      value: 35,
      off: true
    }
  ];

  color = d3.scale.category10();

  pie = d3.layout.pie().sort(null).value(function(d) {
    return d.v;
  });

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

  numSteps = 100;

  linScale = d3.scale.linear().domain([0, numSteps]).range([0, 1]);

  arcs = svg.selectAll('g.arc').data(startDataset).enter().append('g').attr('class', 'arc').attr('transform', "translate(" + outerRadius + "," + yOffset + ")");

  paths = arcs.append('path').attr('fill', function(d, i) {
    return color(i);
  });

  previousTime = 0;

  steps = 0;

  currentSlice = 0;

  stepFn = function(time) {
    var scaledVal;
    if (steps > numSteps) {
      if (currentSlice === 2) {
        return true;
      }
      currentSlice += 1;
      steps = 0;
    }
    scaledVal = linScale(steps);
    paths.attr('d', function(d) {
      var newVal, scaledD, v;
      scaledD = byId(endDataset, d.id);
      if (d.id < currentSlice) {
        return arc(scaledD);
      }
      if (d.id > currentSlice) {
        return;
      }
      newVal = {
        id: scaledD.id,
        v: scaledD.v,
        startAngle: scaledD.startAngle,
        endAngle: scaledD.endAngle
      };
      newVal.endAngle = scaledVal * scaledD.endAngle;
      if (newVal.endAngle < newVal.startAngle) {
        return;
      }
      console.log("new EndAngle: " + newVal.endAngle + ", for id: " + d.id);
      v = arc(newVal);
      return v;
    });
    console.log('scaled val: ', scaledVal);
    previousTime = time;
    steps += 1;
    return false;
  };

  d3.timer(stepFn, 1000);

  return;

  paths = arcs.append('path').attr('fill', function(d, i) {
    return color(i);
  }).attr('d', function(d) {
    return arc(toRad(d));
  }).style('opacity', function(d) {
    if (d.off) {
      return 0;
    } else {
      return 1;
    }
  }).each(function(d) {
    return this._current = d;
  });

  arcs.data(pie(dataset));

  paths.data(pie(dataset)).transition().duration(4000).attrTween('d', arcTween);

  startDataset = [
    {
      v: 46,
      off: false
    }, {
      v: 0,
      off: false
    }, {
      v: 35,
      off: true
    }
  ];

  arcs.data(pie(dataset));

  paths.data(pie(dataset)).attr('d', arc).style('opacity', function(d) {
    if (d.data.off) {
      return 0;
    } else {
      return 1;
    }
  }).transition().duration(4000).attrTween('d', arcTween);

  arcs.on('mouseenter', function(d, i) {
    return d3.select(this).transition().duration(200).ease('circle').attr('transform', function(d) {
      var dist, x, y;
      dist = 20;
      d.midAngle = (d.endAngle - d.startAngle) / 2 + d.startAngle;
      x = Math.sin(d.midAngle) * dist + outerRadius;
      y = -Math.cos(d.midAngle) * dist + yOffset;
      return "translate(" + x + "," + y + ")";
    });
  });

  arcs.on('mouseleave', function(d, i) {
    return d3.select(this).transition().duration(200).ease('circle').attr('transform', "translate(" + outerRadius + "," + yOffset + ")");
  });

  arcs.append('text').attr('transform', function(d) {
    return "translate(" + (arc.centroid(d)) + ")";
  }).attr('text-anchor', 'middle').text(function(d) {
    return d.value;
  });

  pie.value(function(d) {
    return d.value;
  });

  highlightArcs = svg.selectAll('g.highlight').data(pie(highlightData)).enter().append('g').attr('class', 'highlight').attr('transform', "translate(" + outerRadius + "," + yOffset + ")");

  highlightArcs.append('path').attr('stroke', function(d) {
    if (d.data.off) {
      return 'none';
    } else {
      return 'black';
    }
  }).attr('fill', 'none').attr('stroke-linecap', 'round').attr('d', arc);

}).call(this);
