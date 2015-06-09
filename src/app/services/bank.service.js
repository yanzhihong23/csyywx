'use strict';

angular.module('csyywx')
	.service('bankService', function(PayApi, userConfig) {
		var self = this;

		this.selected = {};

		this.bankList = [];

		this.kyc = {};

		this.orderId = '';

		this.select = function(index) {
			self.selected.bankName = self.bankList[index].bankName;
			self.selected.bankCode = self.bankList[index].bankCode;
		};

		this.init = function() {
			PayApi.initBind({sessionId: userConfig.getSessionId()}).success(function(data) {
				if(+data.flag === 1) {
					self.bankList = data.data.bankList.filter(function(obj) {
						return +obj.avaliableBind;
					});
					// select the first one
					self.select(0);

					var userDetail = data.data.userDetail;
					self.kyc.realname = userDetail.realName;
					self.kyc.idNo = userDetail.certificateNumber;
					if(userDetail.realName && userDetail.certificateNumber) {
						self.kyc.disableEdit = true;
					}

					self.orderId = data.data.orderid;
				}
			});
		};

		this.init();
	})