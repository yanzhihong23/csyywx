'use strict';

angular.module('csyywx')
	.controller('PayPasswordCtrl', function($scope, $rootScope, $timeout, $ionicLoading, userConfig, UserApi, settingService, utils) {
		var sessionId =  userConfig.getSessionId();
		var hasSetted = settingService.setting.payPassword;

		var step = [{
			index: 0,
			title: '第一步：请输入当前支付密码'
		},{
			index: 1,
			title: hasSetted ? '第二步：请输入新的支付密码' : '第一步：请设置支付密码'
		},{
			index: 2,
			title: hasSetted ? '第三步：请确认新的支付密码' : '第二步：请确认支付密码'
		}];

		resetStep();
		resetError();

		if (hasSetted) {
			$scope.step = step[0];
		} else {
			$scope.step = step[1];
		}

		$scope.currentPassword = '';
		$scope.newPassword = '';
		$scope.repeatPassword = '';

		$scope.$on('keyboard', function(evt, key) {
			console.log("===%s pressed==", key);
			if (key !== 'ok' && $scope.error.show) {
				resetError();
			}
		});

		$scope.$on('payPassword', function(evt, password) {

			switch ($scope.step.index) {
				case 0:
					step0(password);
					break;
				case 1:
					step1(password);
					break;
				case 2:
					step2(password);
					break;
			}

		});

		function step0(password) {
			$scope.currentPassword = password;
			$ionicLoading.show();
			UserApi.checkPayPassword({
				sessionId: sessionId,
				oldPassword: $scope.currentPassword
			}).success(function(data) {
				$ionicLoading.hide();
				console.log(data);
				if (+data.flag === 1) {
					console.log("=== step0 right");
					$scope.step = step[1];
				} else {
					$scope.error = {
						show: true,
						content: data.msg
					};
				}
				clearPayPasswordWidget();
			});
		}

		function step1(password) {
			$scope.newPassword = password;
			if ($scope.newPassword === $scope.currentPassword) {
				$scope.error = {
					show: true,
					content: '新密码不能与当前密码相同'
				};
			} else {
				console.log("=== step1 right");
				$scope.step = step[2];
			}
			clearPayPasswordWidget();
		}

		function step2(password) {
			$scope.repeatPassword = password;
			if ($scope.newPassword !== $scope.repeatPassword) {
				$scope.error = {
					show: true,
					content: '两次输入密码不相同'
				};
				clearPayPasswordWidget();
				$scope.step = step[1];
			} else {
				if (!hasSetted) {
					notSettedPost();
				} else {
					hasSettedPost();
				}
			}
		}

		function hasSettedPost() {
			$ionicLoading.show();
			UserApi.changePayPassword({
				sessionId: sessionId,
				oldPassword: $scope.currentPassword,
				newPassword: $scope.newPassword
			}).success(function(data) {
				$ionicLoading.hide();
				console.log(data);
				if (+data.flag === 1) {
					utils.alert({
						content: '支付密码设置成功',
						callback: function() {
							clearPayPasswordWidget();
							$scope.step = step[0];
							utils.goBack();
						}
					});
				} else {
					utils.alert({
						content: data.msg,
						callback: function() {
							clearPayPasswordWidget();
							resetStep();
							resetError();
						}
					});
				}
			});
		}

		function notSettedPost() {
			$ionicLoading.show();
			UserApi.setPayPassword({
				sessionId: sessionId,
				newPassword: $scope.newPassword
			}).success(function(data) {
				$ionicLoading.hide();
				console.log(data);
				if (+data.flag === 1) {
					$scope.step = step[0];
					settingService.update();
					utils.alert({
						content: '支付密码设置成功',
						callback: function() {
							clearPayPasswordWidget();
							utils.goBack();
						}
					});
				} else {
					utils.alert({
						content: data.msg,
						callback: function() {
							clearPayPasswordWidget();
							$scope.step = step[1];
							resetError();
						}
					});
				}
			});
		}

		function resetStep() {
			$scope.step = step[0];
		}

		function resetError() {
			$scope.error = {
				show: false,
				content: ''
			};
		}

		function clearPayPasswordWidget() {
			$scope.$broadcast('resetPayPassword');
		}

	})
;