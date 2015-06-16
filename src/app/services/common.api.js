'use strict';

angular.module('csyywx')
	.service('CommonApi', function($http, md5, utils, HOST_URL) {
		var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
				vMd5 = md5.createHash(v),
				headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

		this.addFeedback = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/feedback/addFeedback',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					message: obj.message
				})
			}).success(function(data) {
			})
		};

		this.bankBaseData = function() {
			return $http({
				method: 'POST',
				url: HOST_URL + '/system/bankBaseData',
				headers: headers,
				data: null
			})
		};
	})