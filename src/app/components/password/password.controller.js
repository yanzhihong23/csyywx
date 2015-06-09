'use strict';

angular.module('csyywx')
	.controller('PasswordCtrl', function($scope) {

		$scope.enter = function(num) {
			if (num===-1) {
				console.log("===clear===");
			} else {
				console.log("===number %d entered", num);
			}
		}

	})