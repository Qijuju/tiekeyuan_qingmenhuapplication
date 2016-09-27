/**
 * Created by Administrator on 2016/9/22.
 */
angular.module('fileandpicture.controllers', [])

  .controller('personpictureCtrl', function ($scope, $state,$ionicHistory) {

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


  })

  .controller('personfileCtrl', function ($scope, $state,$ionicHistory) {

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


  })

  .controller('grouppictureCtrl', function ($scope, $state,$ionicHistory) {


    $scope.backAny=function () {
      $ionicHistory.goBack();
    }

  })
  .controller('groupfileCtrl', function ($scope, $state,$ionicHistory) {

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


  })
