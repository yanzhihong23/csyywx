'use strict';

angular.module('csyywx')
	.controller('ExperienceCtrl', function($scope, ActivityApi, userConfig, utils) {
		// $scope.balance
		// $scope.detail
		var sessionId = userConfig.getSessionId();

		ActivityApi.getBalanceInfo({sessionId: sessionId}).success(function(data) {
			if(+data.flag === 1) {
				$scope.balance = data.data;
			}
		});

		ActivityApi.getBalanceDetail({sessionId: sessionId}).success(function(data) {
			if(+data.flag === 1) {
				$scope.detailList = data.data.rewardDetailList;
			}
		});

		$scope.experienceAlert = function() {
			utils.alert({
				title: '邀请码: ' + userConfig.getBasicInfo().ownerActivityId,
				content: '邀请好友投资即可获得2000元体验金，最低可1元起投哦~'
			});
		};
	})