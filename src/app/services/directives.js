'use strict';

angular.module('csyywx')
	.directive('keyboard', function() {
		return {
			restrict: 'E',
			templateUrl: 'app/templates/keyboard.html',
			link: function(scope, element, attr) {
				angular.element(element).parent().addClass('has-keyboard');
				scope.enter = function(num) {
					scope.$emit('keyboard', num);
				};
			}
		}
	})
	.directive('payPassword', function($timeout) {
		return {
			restrict: 'E',
			// require: 'ngModel',
			templateUrl: 'app/templates/pay-password.html',
			link: function(scope, element, attr) {
				scope.inserts = [];
				for (var i=0; i<6; i++) {
					var insert = {
						show: false,
						number: ''
					};
					scope.inserts.push(insert);
				}

				var insertPassword = (function() {
					scope.ok = false;
					var current = 0;
					var len = scope.inserts.length;
					var timer;

					function getPassword() {
						var p = '';
						for(var i=0; i<len; i++) {
							p += scope.inserts[i].number;
						}

						return p;
					}

					function deleteN(curr) {
						console.log('current', current);
						if (timer) {
							$timeout.cancel(timer);
						}

						scope.ok = false;

						curr.show = false;
						curr.number = '';

						current--;
					}

					function addN(curr, num) {
						scope.ok = false;

						timer = $timeout(function() {
							curr.show = true;
						}, 300);
						curr.number = num;
						current++;
					}

					function reset() {
						scope.inserts.forEach(function(self) {
							deleteN(self);
						});
					}

					function insertNumber(num, callback) {
						if (num === -1) { // delete a number
							if (current) {
								deleteN(scope.inserts[current-1]);
							}
						} else if(num === 'ok') {
							scope.$emit('payPassword', getPassword());
						} else {
							if (current < len) {
								addN(scope.inserts[current], num);
								if (current === len) {
									scope.ok = true;
									if (callback) callback();
								}
							}
						}

					}

					return {
						insertNumber: insertNumber,
						reset: reset
					}

				})();

				scope.$on('keyboard', function(evt, num) {
					insertPassword.insertNumber(num);
				});

				scope.$on('resetPayPassword', function() {
					insertPassword.reset();
				})
			}
		}
	})