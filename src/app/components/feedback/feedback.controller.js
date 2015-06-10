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
					utils.goBack();
				}
			});
		};
	})
;