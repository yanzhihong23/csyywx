'use strict';

angular.module('csyywx')
	.factory('utils', function($ionicHistory, $timeout) {
		return {
			param: function(obj) {
				var str = [];
        for(var p in obj) {
        	str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        
        return str.join("&");
			},
			getDate: function(dateObj) {
				var now = dateObj ? new Date(dateObj) : new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var date = now.getDate();
				var appendZero = function(obj) {
					return (obj < 10 ? '0' : '') + obj;
				};
				
				return year + '-' + appendZero(month) + '-' + appendZero(date);
			},
			addMonth: function(dateObj, num) {
				var currentMonth = dateObj.getMonth();
		    dateObj.setMonth(dateObj.getMonth() + num)

		    if (dateObj.getMonth() != ((currentMonth + num) % 12)){
		        dateObj.setDate(0);
		    }
		    return dateObj;
			},
			disableBack: function() {
				$ionicHistory.nextViewOptions({
				  disableAnimate: false,
				  disableBack: true
				});
			},
			goBack: function(depth) {
				if(depth) {
					// get the right history stack based on the current view
					var historyId = $ionicHistory.currentHistoryId();
					var history = $ionicHistory.viewHistory().histories[historyId];
					// set the view 'depth' back in the stack as the back view
					var targetViewIndex = history.stack.length - 1 - depth;
					$ionicHistory.backView(history.stack[targetViewIndex]);
				}
				// navigate to it
				$ionicHistory.goBack();
			},
			isPasswordValid: function(password) {
				var minMaxLength = /^[\s\S]{6,16}$/,
	        letter = /[a-zA-Z]/,
	        number = /[0-9]/,
	        special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
	        count = 0;
	      if(minMaxLength.test(password)) {
	      	letter.test(password) && count++;
	      	number.test(password) && count++;
	      	special.test(password) && count++;
	      }

	      return count >= 2;
			},
			resendCountdown: function($scope) {
				$scope.resendCountdown = 0;
				
				return function() {
					$scope.resendCountdown = 60;
					var countdown = function() {
					  if($scope.resendCountdown > 0) {
					    $scope.resendCountdown += -1;
					    $timeout(countdown, 1000);
					  }
					};
					countdown();
				};
			}
		}
	})