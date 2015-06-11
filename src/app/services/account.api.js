'use strict';

angular.module('csyywx')
	.service('AccountApi', function($http, md5, utils, HOST_URL) {
		var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
				vMd5 = md5.createHash(v),
				headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

		// balance info
		this.getAccountInfo = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/account/getAccountInfo',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {

			});
		};

		this.getBalanceDetail = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/account/getAssetDetails',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					queryType: obj.queryType // 1: total, 2: regular(定期), 3: demand(活期)
				})
			}).success(function(data) {
				// status   0: investing, 1: transfer to demand, 2: withdraw, 3: transfer to regular
			});
		}

		this.getLatestIncome = function(obj) {
				return $http({
					method: 'POST',
					url: HOST_URL + '/interest/latestMonthInterests',
					headers: headers,
					data: utils.param({
						sessionId: obj.sessionId
					})
				}).success(function(data) {

				});
			};
	})