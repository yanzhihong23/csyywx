'use strict';

angular.module('csyywx')
  .controller('HomeCtrl', function ($scope, $ionicSlideBoxDelegate) {
    $scope.banners = [{
      href: '',
      src: 'assets/images/banner001.jpg',
      alt: ''
    }, {
      href: '',
      src: 'assets/images/banner002.jpg',
      alt: ''
    }];

    $scope.$on('$ionicView.afterEnter', function(){
      console.log("------ update slide box ------");

      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.start();
    });
  })
;