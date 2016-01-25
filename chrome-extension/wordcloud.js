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
    .rotate(function() { return ~~(Math.random()*2) * 90;}) // 0 or 90deg
    .fontSize(function(d) { return d.size; })
    .on('end', drawCloud)
    .start();
};


