'use strict';

angular.module('csyywx')
	.service('PayApi', function($http, md5, utils, HOST_URL) {
		var v = 'm.nonobank.com/msapi/'+ utils.getDate(),
				vMd5 = md5.createHash(v),
				headers = {'Authorization': vMd5,'Content-Type': 'application/x-www-form-urlencoded'};

		this.getProductCode = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/index/indexInfo',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// data.data.productCode
			})
		};

		this.initOrder = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/order/initOrderInfo',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					productCode: obj.productCode,
					transCode: obj.transCode || 1 // 1: pay, 2: withdraw
				})
			}).success(function(data) {
				// productRule, bindCardList, userDetail, monthRates, orderid, isSetSalaryDay, isBetweenSalaryDate, bankList, limitExplain
			})
		};

		this.initBindPay = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/pay/toBindPay',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// userDetail, bankList, orderid
			})
		};

		this.sendBindPayVcode = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/trade/dynamicCode',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					orderid: obj.orderId,
					realName: obj.realname,
					idno: obj.idNo,
					bankCode: obj.bankCode,
					bankCardno: obj.bankCardNo,
					mobile: obj.phone,
					amount: obj.amount,
					transCode: obj.transCode || 1, // 1: bind and pay, 2: withdraw, 3: bind,
					productCode: obj.productCode // optional if transCode is 3
				})
			}).success(function(data) {
				// token, storablePan
			})
		};

		this.bindPay = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/trade/firstRecharge',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					orderid: obj.orderId,
					realName: obj.realname,
					idno: obj.idNo,
					bankCode: obj.bankCode,
					bankCardno: obj.bankCardNo,
					mobile: obj.phone,
					amount: obj.amount,
					transCode: obj.transCode || 1, // 1: bind and pay, 2: withdraw, 3: bind,
					productCode: obj.productCode, // optional if transCode is 3
					// above are the same with send vcode
					token: obj.token,
					storablePan: obj.storablePan,
					validCode: obj.vcode,
					systemMonthRateId: obj.systemMonthRateId // get from initOrder API
				})
			}).success(function(data) {
				// 
			})
		};

		this.quickPay = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/trade/quickRecharge',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					orderid: obj.orderId,
					userCardCode: obj.userCardCode,
					storablePan: obj.storablePan,
					amount: obj.amount,
					transCode: obj.transCode || 1, // 1: bind and pay, 2: withdraw, 3: bind,
					productCode: obj.productCode, // optional if transCode is 3
					payPassword: md5.createHash(obj.payPassword), // md5 encode
					systemMonthRateId: obj.systemMonthRateId // get from initOrder API
				})
			}).success(function(data) {
				// data.data.productCode
			})
		};


		/********************************** Just Bind *************************************/
		this.initBind = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/pay/toBindCard',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// userDetail, bankList, orderid
			})
		};

		this.sendBindVcode = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/pay/dynBind',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					orderid: obj.orderId,
					realName: obj.realname,
					idno: obj.idNo,
					bankCode: obj.bankCode,
					bankCardno: obj.bankCardNo,
					mobile: obj.phone,
					transCode: obj.transCode || 3 // 1: bind and pay, 2: withdraw, 3: bind,
				})
			}).success(function(data) {
				// token
			})
		};

		this.bind = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/pay/bindCard',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					orderid: obj.orderId,
					realName: obj.realname,
					idno: obj.idNo,
					bankCode: obj.bankCode,
					bankCardno: obj.bankCardNo,
					mobile: obj.phone,
					transCode: obj.transCode || 3, // 1: bind and pay, 2: withdraw, 3: bind,
					// above are the same with send vcode
					token: obj.token,
					validCode: obj.vcode
				})
			}).success(function(data) {
				// 
			})
		};


		/********************************** Withdraw *************************************/
		this.initWithdraw = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/trade/toWithdrawCash',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId
				})
			}).success(function(data) {
				// isBindCard, productEntity, bankCardList, orderid
			})
		};

		this.withdraw = function(obj) {
			return $http({
				method: 'POST',
				url: HOST_URL + '/trade/withdrawCash',
				headers: headers,
				data: utils.param({
					sessionId: obj.sessionId,
					productCode: obj.productCode,
					orderid: obj.orderId,
					userCardCode: obj.userCardCode,
					storablePan: obj.storablePan,
					withdrawAmount: obj.arrivalAmount,
					chargeAmount: obj.fee,
					amount: obj.amount,
					provinceId: obj.provinceId || '',
					cityId: obj.cityId || '',
					bankBranchId: obj.bankBranchId || ''
				})
			}).success(function(data) {
				// isBindCard, productEntity, bankCardList, orderid
			})
		}
	})