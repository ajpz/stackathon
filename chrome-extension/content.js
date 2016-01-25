chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('message is: ', request.message)
    console.log('root is: ', request.root)

    // if( request.message === "clicked_browser_action" ) {
    if( request.message === "tree_data_available" ) {
        // var redirect = "http://localhost:1337/home";
        // chrome.runtime.sendMessage({"message": "open_new_tab", "url": redirect});
        drawTree(request.root);

        function drawTree (root) {

            console.log('D3 SCRIPT IS RUNNING');

            // Helper function that creates the radial tree
            // receives the data-structure, "root"
            var drawWhenDataAvailable = function(root) {
                console.log('D3.JSON CB FUNCTION INVOKED WITH ROOT', typeof root, root);

                var nodes = tree.nodes(root),
                    links = tree.links(nodes);

                var link = svg.selectAll(".link")
                    .data(links)
                    .enter().append("path")
                    .attr("class", "link")
                    .attr("d", diagonal);

                var node = svg.selectAll(".node")
                    .data(nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

                node.append("circle")
                    .attr("r", 4.5)
                    .on("mouseover", function(d) {
                        console.log(d);
                        calculateCloud(d.words);
                        tooltip.style('display', 'block');
                    })
                    .on("mouseout", function(d) {
                        tooltip.style('display', 'none');
                        d3.select('#curTip').remove();
                    });

                node.append("text")
                    .attr("dy", ".31em")
                    .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                    .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                    .text(function(d) { return d.shortUrl; });
            };

            //This code builds the DOM-modal using jquery-ui dialog module
            var layerNode = document.createElement('div');
            layerNode.setAttribute('id', 'dialog');
            layerNode.setAttribute('title', 'View your neighbors!');

            var pNode = document.createElement('p');
            pNode.innerHTML = "This site has is part of an interesting network.";

            layerNode.appendChild(pNode);
            document.body.appendChild(layerNode);

            jQuery("#dialog").dialog({
                autoOpen: true,
                draggable: true,
                resizable: true,
                height: 'auto',
                width: 900,
                zIndex: 3999,
                modal: false,
                open: function(event, ui) {
                    $(event.target).parent().css('position', 'fixed');
                    $(event.target).parent().css('top', '5px');
                    $(event.target).parent().css('left', '10px');
                }
            })



            //basic D3 tree configuration
            var diameter = 800;

            var tree = d3.layout.tree()
            .children(function(d) {
                return d.childNodes;  //override the children accessor function to use childNodes instead
            })
            .size([360, diameter / 2 - 120])
            .separation(function(a, b) {
                return (a.parent == b.parent ? 1 : 2) / a.depth;
            });

            var diagonal = d3.svg.diagonal.radial()
                .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

            var svg = d3.select("#dialog").append("svg")
                .attr("width", diameter)
                .attr("height", diameter) //removed -150
                .append("g")
                .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

            // Invoke helper function to creat and append nodes to the svg
            drawWhenDataAvailable(root);

            d3.select(self.frameElement).style("height", diameter - 150 + "px");

        }

    }
  }
);
