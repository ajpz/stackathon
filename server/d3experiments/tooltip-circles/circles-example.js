// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;


// Set the rangestrann
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.id); })
    .y(function(d) { return y(d.amount); });

// Define 'div' for tooltips
var tooltip = d3.select("body")
    .append("div")  // declare the tooltip div
    .attr("id", "tooltip")

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
var data = JSONData.slice();
    data.forEach(function(d) {
        d.id = +d.id;
        d.amount = +d.amount;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.id; }));
    y.domain([0, d3.max(data, function(d) { return d.amount; })]);
    // x.domain(data.map(function(d) { return d.id; }));
    // y.domain([0, d3.max(data, function(d) { return d.amount; })]);


    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // draw the scatterplot
    svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.id); })
        .attr("cy", function(d) { return y(d.amount); })
    // Tooltip stuff after this
        .on("mouseover", function(d) {
            calculateCloud(d.words);
            tooltip.style('display', 'block');
            // tooltip.transition()
            //     .duration(500)
            //    .style("opacity", .9)
            })

        .on("mouseout", function(d) {
            tooltip.style('display', 'none');
            // tooltip.transition()
            //     .duration(500)
            //     .style("opacity", 0);
            d3.select('#curTip').remove();
            });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);





//WORD CLOUD:
//https://www.pubnub.com/blog/2014-10-09-quick-word-cloud-from-a-chatroom-with-d3js/
  /* D3  */

  //var typeFace = 'Gorditas';
var minFontSize = 40;
var colors = d3.scale.category20b();
var width = 300;
var height = 300;
function drawCloud(words) {
  d3.select('#tooltip')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'curTip')
    .append('g')
    .attr('transform', 'translate('+width/2+', '+height/2+')')  //move the #cloud div
    .selectAll('text')
    .data(words)
    .enter().append('text')
    .style('font-size', function(d) {
        console.log(d);
     return d.size*3 + 'px'; }) //adjust text size with multiplier
    // .style('font-family', function(d) { return d.font; })
    .style('fill', function(d, i) { return colors(i); })
    .attr('text-anchor', 'middle')
    .attr('transform', function(d) {
      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
    })
    .text(function(d) { return d.text; });
};

// [{"text": "hello", "size": 23}, {"text": "night","size": 3}...]
function calculateCloud(data) {
  d3.layout.cloud()
    .size([width*1.5, height*1.5])
    .words(data)
    .rotate(function() { return ~~(Math.random()*2) * 90;
    }) // 0 or 90deg
    .fontSize(function(d) { return d.size; })
    .on('end', drawCloud)
    .start();
};


