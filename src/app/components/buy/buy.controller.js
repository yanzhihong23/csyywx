'use strict';

angular.module('csyywx')
	.controller('BuyCtrl', function($scope, UserApi) {
		UserApi.checkUser({phone: '13918320423'})
	})