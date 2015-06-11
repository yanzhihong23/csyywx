'use strict';

angular.module('csyywx')
	.service('settingService', function(UserApi, userConfig, $rootScope) {
		var self = this;

		this.setting = {};

		this.update = function() {
			UserApi.getUserData({sessionId: userConfig.getSessionId()})
				.success(function(data) {
					if(+data.flag === 1) {
						console.log('----------- setting updated -----------');

						var data = data.data.userData;
						self.setting.realname = data.realName;
						self.setting.phone = data.mobileNumber;
						self.setting.card = data.bankList ? data.bankList[0].bankName + '(尾号' + data.bankList[0].cardCode + ')' : null;
						self.setting.payPassword = !!(+data.hasPayPassword);
						self.setting.salaryDay = +data.salaryDay;
					}
				});
		};

		$rootScope.$on('loginSuc', this.update);

		this.update();
	})