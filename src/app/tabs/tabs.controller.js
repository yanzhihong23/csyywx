'use strict';

angular.module('csyywx')
  .controller('TabsCtrl', function ($scope, $rootScope, $state) {
		var reset = function() {
    	$rootScope.hideTabs = !/tabs.home|tabs.info|tabs.buy/.test($state.current.name);
    };

    $rootScope.$on('$ionicView.beforeEnter', function() {
      reset();
    });

    $rootScope.$on('$ionicView.afterEnter', function() {
      reset();
    });
  });
