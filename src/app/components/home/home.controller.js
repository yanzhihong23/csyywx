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
    $ionicSlideBoxDelegate.update();
    $ionicSlideBoxDelegate.start();
    console.log("update")
  })
;