'use strict';

angular.module('csyywx')
	.controller('ExperienceCtrl', function($scope, $stateParams, ActivityApi, userConfig, utils) {
		var sessionId, inviteCode;
		if($stateParams.sessionId) {
			sessionId = $stateParams.sessionId;
			ActivityApi.getInviteCode({sessionId: sessionId}).success(function(data) {
				if(+data.flag === 1) {
					inviteCode = data.data.inviteCode;
				}
			});
		} else {
			sessionId = userConfig.getSessionId();
			inviteCode = userConfig.getBasicInfo().ownerActivityId;
		}

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
				title: '邀请码: ' + inviteCode,
				content: '邀请好友投资即可获得2000元体验金，最低可1元起投哦~'
			});
		};
	})