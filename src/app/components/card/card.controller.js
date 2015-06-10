'use strict';

angular.module('csyywx')
	.controller('CardCtrl', function($scope, $state, $ionicLoading, userConfig, PayApi, bankService, utils, orderService) {
		var resendCountdown = utils.resendCountdown($scope), params;
		var isPay = $state.current.name === 'tabs.pay';

		$scope.title = isPay ? '绑定并支付' : '绑定银行卡';
		$scope.card = bankService.selected;
		$scope.kyc = bankService.kyc;

		$scope.select = function() {
			isPay ? $state.go('tabs.paySelectCard') : $state.go('tabs.selectCard');
		};

		$scope.sendVcode = function() {
			isPay ? sendPayVcode() : sendBindVcode();
		};

		var sendVcodeHandler = function(data) {
			$ionicLoading.hide();
			if(+data.flag === 1) {
				// save token to params
				params.token = data.data.token;
				// enable vcode input
				$scope.vcodeSent = true;
				// start count count
				resendCountdown();
			}
		};

		var sendPayVcode = function() {
			$ionicLoading.show();

			params = {
				sessionId: orderService.order.sessionId,
				orderId: orderService.order.orderId,
				amount: orderService.order.amount,
				productCode: orderService.order.productCode,
				realname: $scope.kyc.realname,
				idNo: $scope.kyc.idNo,
				bankCode: $scope.card.bankCode,
				bankCardNo: $scope.card.cardNo,
				phone: $scope.card.phone
			}

			PayApi.sendBindPayVcode(params).success(sendVcodeHandler);
		};

		var sendBindVcode = function() {
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

			PayApi.sendBindVcode(params).success(sendVcodeHandler);
		};

		$scope.submit = function() {
			$ionicLoading.show();
			// add vcode to params
			params.vcode = $scope.card.vcode;

			PayApi.bind(params).success(function(data) {
				$ionicLoading.hide();
				if(+data.flag === 1) {

				}
			});
		};
	})
	.controller('SelectCardCtrl', function($scope, bankService, utils) {
		$scope.bankList = bankService.bankList;

		$scope.select = function(index) {
			bankService.select(index);
			utils.goBack();
		};
	})