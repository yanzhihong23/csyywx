'use strict';

angular.module('csyywx')
	.controller('BalanceCtrl', function($scope, $stateParams, $ionicNavBarDelegate, AccountApi, userConfig, balanceService, $filter) {
		var queryType = 0;
		switch($stateParams.type) {
			case 'accumulative':
				$scope.title = '累计收益';
				$scope.balance = balanceService.balance.totalIncome;
				break;
			case 'total':
				$scope.title = '总资产';
				queryType = 1;
				$scope.balance = balanceService.balance.total;
				break;
			case 'regular':
				$scope.title = '定期资产';
				queryType = 2;
				$scope.balance = balanceService.balance.regular;
				break;
			case 'demand':
				$scope.title = '活期资产';
				queryType = 3;
				$scope.balance = balanceService.balance.demand;
				break;
		}

		$ionicNavBarDelegate.title($scope.title);

		if(queryType) {
			AccountApi.getBalanceDetail({
				sessionId: userConfig.getSessionId(),
				queryType: queryType
			}).success(function(data) {
				if(+data.flag === 1) {
					$scope.items = data.data.assetList.map(function(obj) {
						return {
							date: $filter('date')(new Date(obj.investDate), 'yyyy-MM-dd'),
							desc: obj.termDesc,
							amount: obj.investAmount
						};
					});
				}
			});
		} else {
			AccountApi.getLatestIncome({sessionId: userConfig.getSessionId()})
				.success(function(data) {
					if(+data.flag === 1) {
						$scope.items = data.data.interestList.map(function(obj) {
							return {
								date: $filter('date')(new Date(obj.interestDate), 'yyyy-MM-dd'),
								amount: obj.actualInterest
							}
						})
					}
				})
		}
		
	})