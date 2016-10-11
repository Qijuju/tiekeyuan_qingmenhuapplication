/**
 * Created by Administrator on 2016/9/22.
 */
angular.module('fileandpicture.controllers', [])

  .controller('personpictureCtrl', function ($scope, $state,$ionicHistory,$GridPhoto) {
    

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


  })

  .controller('personfileCtrl', function ($scope, $state,$ionicHistory,$greendao,$api,$stateParams) {

    $scope.ssionid=$stateParams.sessionid;
    $greendao.queryByFilepic($scope.ssionid,"file",function (msg) {
        $scope.filelist=msg;
    },function (err) {

    });
    $scope.openFileDetail=function (filepath,fileid) {
      $api.openFileByPath(filepath,fileid, function (suc) {

      },function (err) {
      });
    }

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
