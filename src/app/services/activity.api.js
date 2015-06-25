'use strict';

angular.module('csyywx')
	.service('ActivityApi', function($http, md5, utils, HOST_URL) {
		var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
				vMd5 = md5.createHash(v),
				headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

		this.getBalanceInfo = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/activity/incomeInfo',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// totalAmount, lastDayIncome, expectIncome, totalRewardIncome
			});
		};

		this.getBalanceDetail = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/activity/rewardDetail',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// rewardDetailList
			});
		};

		this.getInviteCode = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/activity/inviteCode',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// inviteCode
			});
		}
	})