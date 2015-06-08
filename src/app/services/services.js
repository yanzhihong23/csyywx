'use strict';

angular.module('csyywx')
	.service('userConfig', function(localStorageService, UserApi, $rootScope) {
		var self = this;
		var auto = null;

		this.isLogined = false;
		this.sessionId;

		this.setUser = function(user, broadcast) {
			self.isLogined = true;
			localStorageService.add('user', user);
		};

		this.getUser = function() {
			return localStorageService.get('user');
		};

		this.setBasicInfo = function(info) {
			self.sessionId = info.sessionId;
			localStorageService.add('basicInfo', info);
		};

		this.getBasicInfo = function() {
			return localStorageService.get('basicInfo');
		}

		this.logout = function() {
			localStorageService.remove('basicInfo');
			localStorageService.remove('user');
			// localStorageService.clearAll();
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
							self.isLogined = true;
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