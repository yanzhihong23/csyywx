'use strict';

angular.module('csyywx')
	.service('userConfig', function($state, localStorageService, UserApi, $rootScope, $ionicHistory) {
		var self = this;
		var auto = null;

		// this.isLogined = false;
		// this.sessionId;

		this.isLogined = function() {
			return localStorageService.get('isLogined');
		};

		this.setLoginStatus = function(isLogined) {
			localStorageService.add('isLogined', isLogined);
		};

		this.setSessionId = function(sessionId) {
			localStorageService.add('sessionId', sessionId);
		};

		this.getSessionId = function() {
			return localStorageService.get('sessionId');
		};

		this.setUser = function(user, broadcast) {
			// self.isLogined = true;
			self.setLoginStatus(true);
			localStorageService.add('user', user);
		};

		this.getUser = function() {
			return localStorageService.get('user');
		};

		this.setBasicInfo = function(info) {
			// self.sessionId = info.sessionId;
			self.setSessionId(info.sessionId);
			localStorageService.add('basicInfo', info);
		};

		this.getBasicInfo = function() {
			return localStorageService.get('basicInfo');
		};

		this.logout = function() {
			localStorageService.remove('isLogined');
			localStorageService.remove('basicInfo');
			localStorageService.remove('sessionId');
			localStorageService.remove('user');
			// localStorageService.clearAll();
			$state.go('tabs.home');
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
		};

		function autoLogin(broadcast) {
			var user = localStorageService.get('user');
			if(user) {
				UserApi.login(user)
	  			.success(function(data, status, headers, config) {
						if(+data.flag !== 1) {
							auto = null;
							self.logout();
						} else {
							// self.isLogined = true;
							self.setLoginStatus(true);
							self.setBasicInfo(data.data);
							if(broadcast) $rootScope.$broadcast('loginSuc');
							console.log('----------- autoLogin success -----------');
						}
					});
			}
		}

		this.autoLogin = function() {
			autoLogin();
		};

	})
	.service('balanceService', function(userConfig, AccountApi) {
		var self = this;

		this.balance = {};

		this.update = function() {
			AccountApi.getAccountInfo({sessionId: userConfig.getSessionId()})
				.success(function(data) {
					if(+data.flag === 1) {
						console.log('----------- balance updated -----------');
						var balance = data.data;
						self.balance.totalIncome = balance.totalInterest;
						self.balance.lastIncome = balance.yesterdayInterest;
						self.balance.total = balance.totalAssetAmount;
						self.balance.regular = balance.totalTermAssetAmount;
						self.balance.demand = balance.totalDemandAssetAmount;
						self.balance.experience = balance.totalRewardAmount;
					}
				})
		};

		this.update();
	})