'use strict';

angular.module('csyywx')
	.service('withdrawService', function(CommonApi, localStorageService) {
		var self = this;

		this.province = [];
		this.city = [];
		this.selected = {};
		this.order = {};

		this.init = function() {
			var province = localStorageService.get('province');
			var city = localStorageService.get('city');

			if(province && city) {
				self.province = province;
				self.city = city;
			} else {
				CommonApi.bankBaseData().success(function(data) {
					if(+data.flag === 1) {
						data = data.data;
						self.province = data.provinceData;
						self.city = data.cityData;
						localStorageService.add('province', data.provinceData);
						localStorageService.add('city', data.cityData);
					}
				})
			}
		};

		this.selectProvince = function(province) {
			self.selected.province = province;
		};

		this.selectCity = function(city) {
			self.selected.city = city;
		};

		self.init();
	})