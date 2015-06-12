'use strict';

angular.module('csyywx')
	.controller('SetSalaryCtrl', function($scope, utils, UserApi, userConfig, settingService) {
		UserApi.getSalaryDay({sessionId: userConfig.getSessionId()})
			.success(function(data) {
				if(+data.flag === 1) {
					$scope.active = data.data.salaryDay;
					$scope.extraInterest = data.data.salaryDayExtraRate;
					$scope.remain = data.data.remindTimes;
					$scope.addDays = data.data.containDays;
					$scope.firstSet = !data.data.salaryDay;

					if($scope.active) {
						set7days();
					}
				}
			});

		$scope.days = [];
		$scope.daysCurrentMonth = 30;

		for (var i=1; i<=$scope.daysCurrentMonth; i++) {
			$scope.days.push({index: i,active: false});
		}

		$scope.getActive = function(index) {
			if(!$scope.remain) return;

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

		$scope.skip = function() {
			utils.goBack();
		};

		$scope.set = function() {
			UserApi.setSalaryDay({
				sessionId: userConfig.getSessionId(),
				salaryDay: $scope.active
			}).success(function(data) {
				if(+data.flag === 1) {
					// update setting service
					settingService.update();
					utils.alert({
						content: '设置成功，还有 ' + $scope.remain-1 + ' 次修改机会。',
						callback: function() {
							utils.goBack();
						}
					});
				} else {
					utils.alert({
						content: data.msg,
						callback: function() {
							reset();
						}
					});
				}
			})
		};
	})
;