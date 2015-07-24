(function(){
var app = angular.module('FlyptoX.chart', ['nvd3']);

app.controller('chartCtrl', ['$scope', '$interval', '$http', function($scope, $interval, $http){
  $scope.options = {
            chart: {
                type: 'sparklinePlus',
                height: 450,
                x: function(d, i){return i;},
                xTickFormat: function(d) {
                    return d3.time.format('%x')(new Date($scope.data[d].x))
                },
                transitionDuration: 250
            }
        };


// time.getTime();
  $scope.priceData = [];

  $scope.getTrades = function () {
        $http({
          method: 'GET',
          url: '/api/v1/products/1/trades'
          })
        .success(function(data, status, headers, config, statusText){
          console.log("success", data);
          for (var i =0; i < data.length; i++){
            $scope.priceData[i] = {
              y: parseFloat(data[i].price),
              x: Date.parse(data[i].time)
            };
            // $scope.priceData[i]['y']
            // $scope.priceData[i]['x']
            console.log("saved data of: ", $scope.priceData[i]);
            console.log("final data", $scope.priceData);
          }
        })
        .error(function(data, status, headers, config, statusText) {
          console.log("error", data);
        });
      };

  $scope.getTrades();

        //$scope.data = sine();
        $scope.data = volatileChart(130.0, 0.02);
        console.log("nvd3 data", $scope.data);
        //$scope.data = volatileChart(25.0, 0.09,30);

        /* Random Data Generator (took from nvd3.org) */
        function sine() {
            var sin = [];
            var now =+new Date();

            for (var i = 0; i < 100; i++) {
                sin.push({x: now + i * 1000 * 60 * 60 * 24, y: Math.sin(i/10)});
            }

            return sin;
        }

        function volatileChart(startPrice, volatility, numPoints) {
            var rval =  [];
            var now =+new Date();
            numPoints = numPoints || 100;
            for(var i = 1; i < numPoints; i++) {

                rval.push({x: now + i * 1000 * 60 * 60 * 24, y: startPrice});
                var rnd = Math.random();
                var changePct = 2 * volatility * rnd;
                if ( changePct > volatility) {
                    changePct -= (2*volatility);
                }
                startPrice = startPrice + startPrice * changePct;
            }
            return rval;
        }
  }]);
})();



    // this.barData = {
    //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //   series: [
    //     [5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
    //     [3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
    //   ]
    // };

    // this.barOptions = {
    //   seriesBarDistance: 15
    // };

    // function getRandomInt(min, max) {
    //   return Math.floor(Math.random() * (max - min)) + min;
    // }

    // function pushLimit(arr, elem, limit) {
    //   arr.push(elem);
    //   if (arr.length > limit) {
    //     arr.splice(0, 1);
    //   }
    // }

    // var barUpdatePromise = $interval(function() {
    //   var time = new Date();

    //   pushLimit(this.barData.labels, [
    //     time.getHours(),
    //     time.getMinutes(),
    //     time.getSeconds()
    //   ].join(':'), 12);

    //   this.barData.series.forEach(function(series) {
    //     pushLimit(series, getRandomInt(0, 10), 12);
    //   });
    // }.bind(this), 1000);

    // $scope.$on('$destroy', function() {
    //   $interval.cancel(barUpdatePromise);
    // });

