'use strict';

angular.module('csyywx')
  .controller('TabsCtrl', function ($scope, $rootScope, $state) {
    $rootScope.$on('$ionicView.beforeEnter', function() {
      $rootScope.hideTabs = !/tabs.home|tabs.info|tabs.buy/.test($state.current.name);
    });
  });
