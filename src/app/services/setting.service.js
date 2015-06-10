'use strict';

angular.module('csyywx')
	.service('settingService', function(UserApi, userConfig) {
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
						if(data.bankList) {
							self.setting.card = data.bankList[0].bankName + '(尾号' + data.bankList[0].cardCode + ')';
						}

						self.setting.payPassword = !!(+data.hasPayPassword);
						self.setting.salaryDay = +data.salaryDay;
					}
				});
		};

		this.update();
	})