'use strict';

angular.module('csyywx')
	.controller('SetSalaryCtrl', function($scope) {

		$scope.days = [];
		$scope.active = null;
		$scope.addDays = 7;
		$scope.daysCurrentMonth = 30;
		$scope.increaseRate = 2;

		$scope.firstSet = true;

		for (var i=1; i<=$scope.daysCurrentMonth; i++) {
			$scope.days.push({index: i,active: false});
		}
		$scope.getActive = function(index) {

			$scope.active = +index;
			reset();
			set7days();
		};

		function reset() {
			$scope.days.forEach(function(self) {
				self.active = false;
			});
		}
		function set7days() {
			var len = $scope.days.length;
			var overFlow = $scope.active - 1 + $scope.addDays - len;
			if (overFlow > 0) {
				var i0 = $scope.active-1;
				for (var i = i0; i<len; i++) {
					$scope.days[i].active = true;
				}
				for (var i = 0; i<overFlow; i++) {
					$scope.days[i].active = true;
				}
			} else {
				var istart = $scope.active- 1, iend = $scope.active -1 + $scope.addDays;
				for (var i = istart; i<iend; i++) {
					$scope.days[i].active = true;
				}
			}
		}
	})
;