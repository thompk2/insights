'use strict';

/**
 * @ngdoc function
 * @name insightsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the insightsApp
 */
angular.module('insightsApp')
  .controller('MainCtrl', function ($scope, $http) {

  	var tofu = 'total_shares';
  	var mofu = 'leads_generated';
  	var bofu = 'opportunities_won';

  	$scope.getTofu = function(d) { return d[tofu]; };
  	$scope.getMofu = function(d) { return d[mofu]; };
  	$scope.getBofu = function(d) { return d[bofu]; };

  	$http.get('authors.json').success(function(response) {
  		$scope.items = response.data.items;
  		var tofuFilter = $scope.items.filter(function(item){ return item[tofu] > 0; });
  		var mofuFilter = $scope.items.filter(function(item){ return item[mofu] > 0; });
  		var bofuFilter = $scope.items.filter(function(item){ return item[bofu] > 0; });


  		var scale = d3.scale.quantile()
  			.domain([-0.5, -0.25, 0, 1, 2])
  			.range(["F", "D", "C", "B", "A"]);

  		var tofuDev = d3.deviation(tofuFilter, $scope.getTofu);
  		var tofuMean = d3.mean(tofuFilter, $scope.getTofu);

  		var mofuDev = d3.deviation(mofuFilter, $scope.getMofu);
  		var mofuMean = d3.mean(mofuFilter, $scope.getMofu);

  		var bofuDev = d3.deviation(bofuFilter, $scope.getBofu);
  		var bofuMean = d3.mean(bofuFilter, $scope.getBofu);

  		_.each($scope.items, function(item) {
  			var t = (item[tofu] - tofuMean) / tofuDev;
  			item.tofu = scale(t);

  			var m = (item[mofu] - mofuMean) / mofuDev;
  			item.mofu = scale(m);

  			var b = (item[bofu] - bofuMean) / bofuDev;
  			item.bofu = scale(b);
  		});
  	});
  });
