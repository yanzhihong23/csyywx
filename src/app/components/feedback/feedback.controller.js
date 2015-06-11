'use strict';

angular.module('csyywx')
	.controller('FeedbackCtrl', function($scope, $ionicLoading, userConfig, CommonApi, utils) {
		var sessionId = userConfig.getSessionId();

		$scope.form = {
			feedback: ''
		};

		$scope.submit = function() {
			$ionicLoading.show();
			CommonApi.addFeedback({
				sessionId: sessionId,
				message: $scope.form.feedback
			}).success(function(data) {
				$ionicLoading.hide();
				if (+data.flag === 1) {
					utils.alert({
						title: '反馈成功',
						content: '谢谢壮士的热心反馈',
						callback: function() {
							utils.goBack();
						}
					})
				}
			});
		};
	})
;