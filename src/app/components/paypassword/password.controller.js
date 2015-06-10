'use strict';

angular.module('csyywx')
	.controller('PayPasswordCtrl', function($scope, $timeout, $ionicLoading, userConfig, UserApi, settingService, utils) {
		var sessionId =  userConfig.getSessionId();
		$scope.ok = false;

		if (settingService.setting.payPassword) {
			$scope.step = {
				index: 0,
				title: '请输入当前支付密码'
			};
		} else {
			$scope.step = {
				index: 1,
				title: '请输入新密码'
			};
		}

		$scope.error = {
			show: false,
			content: ''
		};

		$scope.currentPassword = '';
		$scope.newPassword = '';
		$scope.repeatPassword = '';

		$scope.inserts = [];
		for (var i=0; i<6; i++) {
			var insert = {
				show: false,
				number: ''
			};
			$scope.inserts.push(insert);
		}

		var insertPassword = (function() {
			var current = 0;
			var len = $scope.inserts.length;

			function clearOneNumber(curr) {
				$scope.ok = false;

				curr.show = false;
				curr.number = '';

				current--;
			}

			function addOneNumber(curr, num) {
				resetError();
				$scope.ok = false;

				$timeout(function() {
					curr.show = true;
				}, 300);
				curr.number = num;


				current++;
			}

			function reset() {
				$scope.inserts.forEach(function(self) {
					clearOneNumber(self);
				});
			}

			function insertNumber(num, callback) {

				if (num === -1) {
					if (current !== 0) {
						clearOneNumber($scope.inserts[current-1]);
					}
				} else {
					if (current < len) {
						addOneNumber($scope.inserts[current], num);
						if (current === len) {
							if (callback) callback();
						}
					}
				}

			}

			return {
				insertNumber: insertNumber,
				reset: reset
			}

		})();


		$scope.enter = function(num) {
			if (num===-1) {
				console.log("===clear===");
				insertPassword.insertNumber(num);
			} else if (num==='ok') {
				console.log("===number %s entered", num);
				next();
			} else {
				console.log("===number %d entered", num);
				insertPassword.insertNumber(num, function() {
					$scope.ok = true;
					console.log($scope.currentPassword, "===insert complete===");
				});
			}
		};

		function savePassword(step) {


			switch (step) {
				case 0:
					$scope.currentPassword = '';
					$scope.inserts.forEach(function(self) {
						$scope.currentPassword += self.number;
					});

					break;
				case 1:
					$scope.newPassword = '';
					$scope.inserts.forEach(function(self) {
						$scope.newPassword += self.number;
					});

					break;
				case 2:
					$scope.repeatPassword = '';
					$scope.inserts.forEach(function(self) {
						$scope.repeatPassword += self.number;
					});

					break;
			}
		}

		function next() {
			switch ($scope.step.index) {
				case 0:
					savePassword(0);

					$ionicLoading.show();
					UserApi.checkPayPassword({
						sessionId: sessionId,
						oldPassword: $scope.currentPassword
					}).success(function(data) {
						$ionicLoading.hide();
						console.log(data);
						if (+data.flag === 1) {
							console.log("=== step0 right");
							insertPassword.reset();
							$scope.step = {
								index: 1,
								title: '请输入新支付密码'
							};
						} else {
							$scope.error = {
								show: true,
								content: data.msg
							};
							insertPassword.reset();
						}
					});
					break;
				case 1:
					savePassword(1);
					if ($scope.newPassword === $scope.currentPassword) {
						$scope.error = {
							show: true,
							content: '新密码不能与当前密码相同'
						};
						insertPassword.reset();
					} else {
						console.log("=== step1 right");
						insertPassword.reset();
						$scope.step = {
							index: 2,
							title: '请确认新支付密码'
						};
					}
					break;
				case 2:
					savePassword(2);
					if ($scope.newPassword !== $scope.repeatPassword) {
						$scope.error = {
							show: true,
							content: '两次输入密码不相同'
						};
						insertPassword.reset();
					} else {
						if ($scope.currentPassword === '') {
							$ionicLoading.show();
							UserApi.setPayPassword({
								sessionId: sessionId,
								newPassword: $scope.newPassword
							}).success(function(data) {
								$ionicLoading.hide();
								console.log(data);
								if (+data.flag === 1) {
									insertPassword.reset();
									$scope.step = {
										index: 0,
										title: '请输入当前支付密码'
									};
									utils.goBack();
								}
							});
						} else {
							$ionicLoading.show();
							UserApi.changePayPassword({
								sessionId: sessionId,
								oldPassword: $scope.currentPassword,
								newPassword: $scope.newPassword
							}).success(function(data) {
								$ionicLoading.hide();
								console.log(data);
								if (+data.flag === 1) {
									insertPassword.reset();
									$scope.step = {
										index: 0,
										title: '请输入当前支付密码'
									};
									utils.goBack();
								}
							});
						}
					}

					break;
			}
		}

		function resetError() {
			if ($scope.error.show) {
				$scope.error = {
					show: false,
					content: ''
				};
			}
		}

	})
;