'use strict';

angular.module('csyywx')
	.controller('CardCtrl', function($scope, $state, $ionicLoading, userConfig, PayApi, bankService, utils) {
		var resendCountdown = utils.resendCountdown($scope), params;

		$scope.card = bankService.selected;
		$scope.kyc = bankService.kyc;

		$scope.select = function() {
			$state.go('tabs.selectCard');
		};

		$scope.sendVcode = function() {
			$ionicLoading.show();

			params = {
				sessionId: userConfig.getSessionId(),
				orderId: bankService.orderId,
				realname: $scope.kyc.realname,
				idNo: $scope.kyc.idNo,
				bankCode: $scope.card.bankCode,
				bankCardNo: $scope.card.cardNo,
				phone: $scope.card.phone
			};

			PayApi.sendBindVcode(params).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {
					// save token to params
					params.token = data.data.token;
					// enable vcode input
					$scope.vcodeSent = true;
					// start count count
					resendCountdown();
				}
			})
		}

		$scope.submit = function() {
			$ionicLoading.show();
			// add vcode to params
			params.vcode = $scope.card.vcode;
			
			PayApi.bind(params).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {

				}
			})
			console.log($scope.kyc);
		};
	})
	.controller('SelectCardCtrl', function($scope, bankService, utils) {
		$scope.bankList = bankService.bankList;

		$scope.select = function(index) {
			bankService.select(index);
			utils.goBack();
		};
	})