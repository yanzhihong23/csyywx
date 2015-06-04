'use strict';

angular.module('csyywx', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ionic'])
	.config(function($ionicConfigProvider) {
		$ionicConfigProvider.tabs.position('bottom').style('standard');
	})
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'app/tabs/tabs.html'
      })
      .state('tabs.home', {
	      url: "/home",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/home/home.html",
	          controller: 'HomeCtrl'
	        }
	      }
    	})
    	.state('tabs.buy', {
	      url: "/buy",
	      views: {
	        'buy-tab': {
	          templateUrl: "app/components/buy/buy.html",
	          controller: 'BuyCtrl'
	        }
	      }
    	})
    	.state('tabs.info', {
	      url: "/info",
	      views: {
	        'info-tab': {
	          templateUrl: "app/components/info/info.html",
	          controller: 'InfoCtrl'
	        }
	      }
    	})

    $urlRouterProvider.otherwise('/tab/home');
  })
;
