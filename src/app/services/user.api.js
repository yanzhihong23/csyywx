'use strict';

angular.module('csyywx')
	.service('UserApi', function($http, md5, utils) {
		var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
				vMd5 = md5.createHash(v),
				headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'},
				HOST_URL = utils.getApiServer(utils.host);

		this.checkUser = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/initWelcomPage',
				headers: headers,
				data: utils.param({
					mobileNumber: obj.phone
				})
			}).success(function(data) {
				// data.data.isOldUser
			})
		};

		this.sendCheckCode = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/message/sendCheckCode',
				headers: headers,
				data: utils.param({
					mobileNumber: obj.phone,
					approach: obj.approach || 1, // 1:register, 2:retrieve password, 3:retrieve pay password
					opened: ''
				})
			}).success(function(data) {
				// data.data.sessionId
			})
		};

		this.register = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/register/registerByMobile',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					mobileNumber: obj.phone,
					checkCode: obj.vcode,
					password: md5.createHash(obj.password || ''),
					userType: obj.userType || '',
					inviteCode: obj.inviteCode || '',
					registerApproach: obj.registerApproach || '03',
					resource: obj.resource || ''
				})
			}).success(function(data) {
				// data.data.sessionId
			})
		};

		this.registerByActivity = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/register/registerByActivity',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					mobileNumber: obj.phone,
					checkCode: obj.vcode,
					password: md5.createHash(obj.password || ''),
					userType: obj.userType || 'wx+1+1', // 'tiyanjin+wx+1'
					fromActivityId: obj.inviteCode || '',
					registerApproach: obj.registerApproach || '03' // 01 need openId
				})
			}).success(function(data) {
				// data.data.sessionId
			})
		};

		this.login = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/login/doLogin',
				headers: headers,
				data: utils.param({
					userName: obj.phone,
					password: md5.createHash(obj.password || '')
				})
			}).success(function(data) {
				// sessionId, mobileNumber, ownerActivityId, isInvest, yesterdayInterest
			})
		};

		this.logout = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/logout/doLogout',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {

			})
		};

		this.getUserData = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/getUserData',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// data.data.userData
			})
		}

		this.changePassword = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/changePassword',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					oldPassword: md5.createHash(obj.oldPassword),
					newPassword: md5.createHash(obj.newPassword)
				})
			}).success(function(data) {

			})
		};

		this.checkPayPassword = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/checkPayPassword',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					oldPassword: md5.createHash(obj.oldPassword)
				})
			}).success(function(data) {

			})
		}

		this.changePayPassword = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/changePayPassword',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					oldPassword: md5.createHash(obj.oldPassword),
					newPassword: md5.createHash(obj.newPassword)
				})
			}).success(function(data) {

			})
		};

		this.setPayPassword = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/payPasswordSetting',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					newPassword: md5.createHash(obj.newPassword)
				})
			}).success(function(data) {
				
			})
		};

		// for retrieve login and pay password
		this.securityCheck = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/securityCheck',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					mobileNumber: obj.phone,
					certificateNumber: obj.certificateNumber, // id, for retrieve pay password
					inputCheckCode: obj.checkCode, // 2015, for dev test,
					interfaceType: obj.type // 1:login, 2: pay
				})
			}).success(function(data) {
				// sessionId, need to send back retrieveXXX api
			})
		};

		this.retrievePassword = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/findPassword',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					newPassword: md5.createHash(obj.newPassword)
				})
			}).success(function(data) {
				
			})
		};

		this.retrievePayPassword = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/findPayPassword',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					newPassword: md5.createHash(obj.newPassword)
				})
			}).success(function(data) {
				
			})
		};


		this.setSalaryDay = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/salaryDay',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					salaryDay: obj.salaryDay
				})
			}).success(function(data) {
				
			})
		};

		this.getSalaryDay = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/user/salaryDayInfo',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				
			})
		};

		this.identityAuth = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/authen/authenCertificate',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					realName: obj.realname,
					certificateNumber: obj.idNo
				})
			}).success(function(data) {
			})
		};
	})