'use strict';

angular.module('csyywx', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ionic', 'angular-md5', 'LocalStorageModule'])
  // .constant('HOST_URL', 'https://m-test.nonobank.com/nonobank-app')
	.constant('HOST_URL', 'https://m.nonobank.com/nnapp')
	.config(function($ionicConfigProvider, localStorageServiceProvider) {
		$ionicConfigProvider.tabs.position('bottom').style('standard');
    localStorageServiceProvider.setPrefix('csyy');
	})
	.constant('$ionicLoadingConfig', {
    template: '<ion-spinner icon="bubbles" class="spinner-assertive"></ion-spinner>'
  })
	.run(function($state, $rootScope, $window, userConfig, utils, WechatService) {
		var userAgent = $window.navigator.userAgent.toLowerCase();
		if(/micromessenger/.test(userAgent)) {
			$rootScope.wechat = true;
		}

		// try auto login
		if(userConfig.isLogined()) {
			userConfig.autoLogin();
		}

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      console.log('sessionId: ' + userConfig.getSessionId());
			console.log(fromState.name + ' --> ' + toState.name);
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
        case 'tabs.setting':
          if(!userConfig.isLogined()) {
            event.preventDefault();
          }
          break;
				case 'tabs.phone':
				case 'tabs.register':
				case 'tabs.login':
					if(userConfig.isLogined()) {
						event.preventDefault();
						$state.go('tabs.home');
					}
          break;

			}
		});
	})
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'app/tabs/tabs.html',
        controller: 'TabsCtrl'
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
    		url: "/phone?inviteCode&userfrom",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/phone/phone.html",
	          controller: 'PhoneCtrl'
	        }
	      }
    	})
    	.state('tabs.register', {
    		url: "/register?phone&inviteCode",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/register/register.html",
	          controller: 'RegisterCtrl'
	        }
	      }
    	})
			.state('tabs.userAgreement', {
				url: '/userAgreement',
				views: {
					'home-tab': {
						templateUrl: 'app/components/agreements/user-agreement.html'
					}
				}
			})
    	.state('tabs.login', {
    		url: "/login?phone&redirect",
	      views: {
	        'home-tab': {
	          templateUrl: "app/components/login/login.html",
	          controller: 'LoginCtrl'
	        }
	      }
    	})
			.state('tabs.forgetPassword', {
				url: '/forgetPassword?phone&type',
				views: {
					'home-tab': {
						templateUrl: 'app/components/forget/forget.html',
						controller: 'ForgetPasswordCtrl'
					}
				}
			})
			.state('tabs.retrievePassword', {
				url: '/retrievePassword?phone',
				views: {
					'home-tab': {
						templateUrl: 'app/components/retrieve/retrieve.html',
						controller: 'RetrievePasswordCtrl'
					}
				}
			})
    	/************************** buy tab ***************************/
    	.state('tabs.serviceAgreement', {
    		url: '/serviceAgreement',
    		views: {
    			'buy-tab': {
    				templateUrl: 'app/components/agreements/service-agreement.html'
    			}
    		}
    	})
    	.state('tabs.payAgreement', {
    		url: '/payAgreement',
    		views: {
    			'buy-tab': {
    				templateUrl: 'app/components/agreements/pay-agreement.html'
    			}
    		}
    	})
      .state('tabs.limit', {
        url: '/limit',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/limit/limit.html',
            controller: 'LimitCtrl'
          }
        }
      })
      .state('tabs.pay', {
        url: '/pay',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/card/card.html',
            controller: 'CardCtrl'
          }
        }
      })
      .state('tabs.paySelectCard', {
        url: '/paySelectCard',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/card/select.html',
            controller: 'SelectCardCtrl'
          }
        }
      })
      .state('tabs.quickpay', {
        url: '/quickpay',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/quickpay/quickpay.html',
            controller: 'QuickpayCtrl'
          }
        }
      })
      .state('tabs.setPayPasswordBuy', {
        url: '/setPayPasswordBuy',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/paypassword/password.html',
            controller: 'PayPasswordCtrl'
          }
        }
      })
			.state('tabs.forgetPasswordBuy', {
				url: '/forgetPasswordBuy?phone&type',
				views: {
					'buy-tab': {
						templateUrl: 'app/components/forget/forget.html',
						controller: 'ForgetPasswordCtrl'
					}
				}
			})
			.state('tabs.retrievePayPassword', {
				url: '/retrievePayPassword',
				views: {
					'buy-tab': {
						templateUrl: 'app/components/retrievepay/retrieve.html',
						controller: 'RetrievePayPasswordCtrl'
					}
				}
			})
      .state('tabs.setSalaryBuy', {
        url: '/setSalaryBuy',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/salary/salary.html',
            controller: 'SetSalaryCtrl'
          }
        }
      })
      .state('tabs.selectItem', {
        url: '/selectItem',
        views: {
          'buy-tab': {
            templateUrl: 'app/components/buy/select.html',
            controller: 'SelectItemCtrl'
          }
        }
      })
    	/************************** info tab ***************************/
    	.state('tabs.balance', {
    		url: '/balance?type',
    		views: {
    			'info-tab': {
    				templateUrl: 'app/components/balance/balance.html',
    				controller: 'BalanceCtrl'
    			}
    		}
    	})
      .state('tabs.experience', {
        url: '/experience?sessionId',
        views: {
          'info-tab': {
            templateUrl: 'app/components/experience/experience.html',
            controller: 'ExperienceCtrl'
          }
        }
      })
      .state('tabs.rule', {
        url: '/rule',
        views: {
          'info-tab': {
            templateUrl: 'app/components/experience/rule.html'
          }
        }
      })
    	.state('tabs.setting', {
    		url: '/setting',
    		views: {
    			'info-tab': {
    				templateUrl: 'app/components/setting/setting.html',
    				controller: 'SettingCtrl'
    			}
    		}
    	})
      .state('tabs.changePassword', {
        url: '/changePassword',
        views: {
          'info-tab': {
            templateUrl: 'app/components/password/password.html',
            controller: 'PasswordCtrl'
          }
        }
      })
      .state('tabs.changePayPassword', {
        url: '/changePayPassword',
        views: {
          'info-tab': {
            templateUrl: 'app/components/paypassword/password.html',
            controller: 'PayPasswordCtrl'
          }
        }
      })
      .state('tabs.setPayPassword', {
        url: '/setPayPassword',
        views: {
          'info-tab': {
            templateUrl: 'app/components/paypassword/password.html',
            controller: 'PayPasswordCtrl'
          }
        }
      })
      .state('tabs.setSalary', {
        url: '/setSalary',
        views: {
          'info-tab': {
            templateUrl: 'app/components/salary/salary.html',
            controller: 'SetSalaryCtrl'
          }
        }
      })
      .state('tabs.about', {
        url: '/about',
        views: {
          'info-tab': {
            templateUrl: 'app/components/about/about.html'
          }
        }
      })
      .state('tabs.feedback', {
        url: '/feedback',
        views: {
          'info-tab': {
            templateUrl: 'app/components/feedback/feedback.html',
            controller: 'FeedbackCtrl'
          }
        }
      })
      .state('tabs.card', {
        url: '/card',
        views: {
          'info-tab': {
            templateUrl: 'app/components/card/card.html',
            controller: 'CardCtrl'
          }
        }
      })
      .state('tabs.selectCard', {
        url: '/selectCard',
        views: {
          'info-tab': {
            templateUrl: 'app/components/card/select.html',
            controller: 'SelectCardCtrl'
          }
        }
      })
      .state('tabs.withdraw', {
        url: '/withdraw',
        views: {
          'info-tab': {
            templateUrl: 'app/components/withdraw/withdraw.html',
            controller: 'WithdrawCtrl'
          }
        }
      })
      .state('tabs.district', {
        url: '/district',
        views: {
          'info-tab': {
            templateUrl: 'app/components/withdraw/district.html',
            controller: 'DistrictCtrl'
          }
        }
      })
      .state('tabs.selectDistrict', {
        url: '/selectDistrict?type',
        views: {
          'info-tab': {
            templateUrl: 'app/components/withdraw/list.html',
            controller: 'SelectDistrictCtrl'
          }
        }
      })

			;
    $urlRouterProvider.otherwise('/tab/home');
  })
;
