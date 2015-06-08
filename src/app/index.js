'use strict';

angular.module('csyywx', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ionic', 'angular-md5', 'LocalStorageModule'])
	.constant('HOST_URL', 'https://m-test.nonobank.com/nonobank-app')
	.config(function($ionicConfigProvider) {
		$ionicConfigProvider.tabs.position('bottom').style('standard');
	})
	.run(function($state, $rootScope, userConfig, utils) {
		// try auto login
		if(!userConfig.isLogined()) {
			userConfig.autoLogin();
		}

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			console.log('sessionId: ' + userConfig.getSessionId())
			switch(toState.name) {
				case 'tabs.buy':
				case 'tabs.info':
					if(!userConfig.isLogined()) {
						event.preventDefault();

						var callMeOffFn = $rootScope.$on('loginSuc', function() {
              utils.disableBack();
              $state.go(toState.name);
              callMeOffFn();
            });

						$state.go('tabs.phone');
					}

					break;
				case 'tabs.phone':
				case 'tabs.register':
				case 'tabs.login':
					if(userConfig.isLogined()) {
						event.preventDefault();
						$state.go('tabs.home');
						break;
					}

			}
		})
	})
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'app/tabs/tabs.html'
      })
      /************************** three main tabs ***************************/
      .state('tabs.home', {
	      url: '/home',
	      views: {
	        'home-tab': {
	          templateUrl: 'app/components/home/home.html',
	          controller: 'HomeCtrl'
	        }
	      }
    	})
    	.state('tabs.buy', {
	      url: '/buy',
	      views: {
	        'buy-tab': {
	          templateUrl: 'app/components/buy/buy.html',
	          controller: 'BuyCtrl'
	        }
	      }
    	})
    	.state('tabs.info', {
	      url: '/info',
	      views: {
	        'info-tab': {
	          templateUrl: 'app/components/info/info.html',
	          controller: 'InfoCtrl'
	        }
	      }
    	})
    	/************************** home tab ***************************/
    	.state('tabs.phone', {
    		url: "/phone",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/phone/phone.html",
	          controller: 'PhoneCtrl'
	        }
	      }
    	})
    	.state('tabs.register', {
    		url: "/register?phone",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/register/register.html",
	          controller: 'RegisterCtrl'
	        }
	      }
    	})
    	.state('tabs.login', {
    		url: "/login?phone",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/login/login.html",
	          controller: 'LoginCtrl'
	        }
	      }
    	})
			;
    $urlRouterProvider.otherwise('/tab/home');
  })
;
