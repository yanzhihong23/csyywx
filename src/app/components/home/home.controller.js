'use strict';

angular.module('csyywx')
  .controller('HomeCtrl', function ($scope, $ionicSlideBoxDelegate) {
    $scope.banners = [{
      href: '',
      src: 'assets/images/banner001.jpg',
      alt: ''
    }, {
      href: 'http://www.nonobank.com',
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