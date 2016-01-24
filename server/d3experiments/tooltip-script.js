//referenced data through script tags;
var data = JSONData.slice();


var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

//EXAMPLE:
// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return "<strong>Amount:</strong> <span style='color:red'>" + d.amount + "</span>";
//   })


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    // var listOfWords =
    // d.words.forEach(function){

    // }
    return "<strong>Amount:</strong> <span style='color:red'>" + d.amount + "</span>";
  })



var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);


  x.domain(data.map(function(d) { return d.id; }));
  y.domain([0, d3.max(data, function(d) { return d.amount; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.id); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.amount); })
      .attr("height", function(d) { return height - y(d.amount); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)


function type(d) {
  console.log(d);
  d.amount = +d.amount;
  return d;
}



//WORD CLOUD:
//https://www.pubnub.com/blog/2014-10-09-quick-word-cloud-from-a-chatroom-with-d3js/
  /* D3  */

  //var typeFace = 'Gorditas';
  var minFontSize = 40;
  var colors = d3.scale.category20b();
  var width = 300;
  var height = 300;
function drawCloud(words) {
  d3.select('#cloud').append('svg')
    .attr('width', width).attr('height', height)
    .append('g')
    .attr('transform', 'translate('+width/2+', '+height/2+')')
    .selectAll('text')
    .data(words)
    .enter().append('text')
    .style('font-size', function(d) { return d.size*2 + 'px'; })
    // .style('font-family', function(d) { return d.font; })
    .style('fill', function(d, i) { return colors(i); })
    .attr('text-anchor', 'middle')
    .attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
    })
    .text(function(d) { return d.text; });
}

/*
{"id":30,"amount":23,"words":[{"word":"Npath","frequency":2},{"word":"Skibox","frequency":13},{"word":"Wordtune","frequency":3},{"word":"Digitube","frequency":5},{"word":"Wordify","frequency":10},{"word":"Podcat","frequency":14},{"word":"Eamia","frequency":8},{"word":"Thoughtblab","frequency":11},{"word":"Edgepulse","frequency":2},{"word":"Skynoodle","frequency":4},{"word":"Teklist","frequency":11}]};
*/

// [{"text": "hello", "size": 23}, {"text": "night","size": 3}...]
function calculateCloud(data) {
  d3.layout.cloud()
    .size([width, height])
    .words(data) // data from PubNub
    .rotate(function() { return ~~(Math.random()*2) * 90;}) // 0 or 90deg
    .fontSize(function(d) { return d.size; })
    .on('end', drawCloud)
    .start();
}


console.log(data[0]);
calculateCloud(data[1].words);
