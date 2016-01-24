app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope, $http) {

    $scope.makeTree = function() {
        console.log('MAKING THE TREE');
        $http.post('api/get-web', { url: $scope.url })
        .then(function(response) {
            $scope.treeData = response.data;
            $scope.drawTree($scope.treeData);
        })
        .then(null, console.error.bind(console));
    };

    $scope.drawTree = function(root) {

        console.log('D3 SCRIPT IS RUNNING');

        // helper function that wraps all root-dependent functionality
        var drawWhenDataAvailable = function(root) {
            console.log('D3.JSON CB FUNCTION INVOKED WITH ROOT')
            // if (error) throw error;

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
                .attr("r", 4.5);

            node.append("text")
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
                .text(function(d) { return d.url; });
        };

        //AJAX to get tree data
        var getTreeData = function() {
            return $http.get('/flare.json')
            .then(function(res) {
                return res.data;
            })
        };


        //basic D3 tree configuration
        var diameter = 960;

        var tree = d3.layout.tree()
        .children(function(d) {
            return d.childNodes;  //update the children accessor function
        })
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
        });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

        var svg = d3.select("section").append("svg")
            .attr("width", diameter)
            .attr("height", diameter - 150)
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        // AJAX for data then draw to tree with root json data file
        // getTreeData()
        // .then(function(root) {
        //     drawWhenDataAvailable(root);
        // });

        drawWhenDataAvailable(root);

        d3.select(self.frameElement).style("height", diameter - 150 + "px");

    }
});
