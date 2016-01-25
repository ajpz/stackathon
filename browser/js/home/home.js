app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});
var cloudTip;

app.controller('HomeCtrl', function($scope, $http) {

    var showSpinner = false;
    $scope.url = 'http://www.ny.gov/';

    $scope.hittingAPI = function() {
        return showSpinner;
    }
    $scope.makeTree = function() {
        console.log('MAKING THE TREE');
        showSpinner = true;
        $http.post('api/get-web', { url: $scope.url })
        .then(function(response) {
            $scope.treeData = response.data;
            showSpinner = false;
            $scope.drawTree($scope.treeData);

        })
        .then(null, console.error.bind(console));
    };
    $scope.drawTree = function (root) {

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
                    console.log(cloudTip);
                    calculateCloud(d.words);
                    cloudTip.style('display', 'block');
                })
                .on("mouseout", function(d) {
                    // cloudTip.style('display', 'none');
                    d3.select('#curTip').remove();
                })
                .on("click", function(d) {
                    showSpinner = true;
                    $http.post('/api/get-web', { url: d.url })
                    .then(function(res) {
                        d3.select('#theWEB').remove();
                        d3.select('#curTip').remove();
                        showSpinner = false;
                        $scope.drawTree(res.data);
                    })
                    .then(null, console.error.bind(console));
                })

            node.append("text")
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                .text(function(d) { return d.shortUrl; });

        };

        // Define 'div' for tooltips
        cloudTip = d3.select("body")
            .append("div")  // declare the tooltip div
            .attr("id", "tooltip")

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

        var svg = d3.select("body").append("svg")
            .attr("id", 'theWEB')
            .attr("width", diameter)
            .attr("height", diameter) //removed -150
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        // Invoke helper function to creat and append nodes to the svg
        drawWhenDataAvailable(root);

        d3.select(self.frameElement).style("height", diameter - 150 + "px");

    }




    // $scope.drawTree = function(root) {

    //     console.log('D3 SCRIPT IS RUNNING');

    //     // helper function that wraps all root-dependent functionality
    //     var drawWhenDataAvailable = function(root) {
    //         console.log('D3.JSON CB FUNCTION INVOKED WITH ROOT')
    //         // if (error) throw error;

    //         var nodes = tree.nodes(root),
    //             links = tree.links(nodes);

    //         var link = svg.selectAll(".link")
    //             .data(links)
    //             .enter().append("path")
    //             .attr("class", "link")
    //             .attr("d", diagonal);

    //         var node = svg.selectAll(".node")
    //             .data(nodes)
    //             .enter().append("g")
    //             .attr("class", "node")
    //             .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

    //         node.append("circle")
    //             .attr("r", 4.5);

    //         node.append("text")
    //             .attr("dy", ".31em")
    //             .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    //             .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
    //             .text(function(d) { return d.url; });
    //     };

    //     //AJAX to get tree data
    //     var getTreeData = function() {
    //         return $http.get('/flare.json')
    //         .then(function(res) {
    //             return res.data;
    //         })
    //     };


    //     //basic D3 tree configuration
    //     var diameter = 960;

    //     var tree = d3.layout.tree()
    //     .children(function(d) {
    //         return d.childNodes;  //update the children accessor function
    //     })
    //     .size([360, diameter / 2 - 120])
    //     .separation(function(a, b) {
    //         return (a.parent == b.parent ? 1 : 2) / a.depth;
    //     });

    //     var diagonal = d3.svg.diagonal.radial()
    //         .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    //     var svg = d3.select("section").append("svg")
    //         .attr("width", diameter)
    //         .attr("height", diameter - 150)
    //         .append("g")
    //         .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    //     // AJAX for data then draw to tree with root json data file
    //     // getTreeData()
    //     // .then(function(root) {
    //     //     drawWhenDataAvailable(root);
    //     // });

    //     drawWhenDataAvailable(root);

    //     d3.select(self.frameElement).style("height", diameter - 150 + "px");

    // }
});
