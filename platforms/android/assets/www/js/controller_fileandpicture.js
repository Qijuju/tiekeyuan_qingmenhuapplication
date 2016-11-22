/**
 * Created by Administrator on 2016/9/22.
 */
angular.module('fileandpicture.controllers', [])

  .controller('personpictureCtrl', function ($scope, $state,$ionicHistory,$GridPhoto) {


    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


  })

  .controller('personfileCtrl', function ($scope, $state,$ionicHistory,$greendao,$api,$stateParams,$ionicLoading,$timeout) {

    $scope.ssionid=$stateParams.sessionid;

    //查找今天的
    $greendao.queryTodayFile($scope.ssionid,"file",function (msg) {

      $scope.todayday=msg;

    },function (err) {

    });
    //查找本周的
    $greendao.queryWeekFile($scope.ssionid,"file",function (msg) {

      $scope.weekday=msg;
    },function (err) {

    });
    //查找本月的
    $greendao.queryMonthFile($scope.ssionid,"file",function (msg) {
      $scope.monthday=msg;
    },function (err) {

    });
    //查找以前的
    $greendao.queryLongFile($scope.ssionid,"file",function (msg) {
      $scope.longday=msg;
    },function (err) {

    });



    $scope.openFileDetail=function (filepath,id) {
      $greendao.queryData("MessagesService","where _id =?",id,function (suc) {
        var bigmsg=suc[0];
        $api.openFileByPath(filepath,bigmsg, function (message) {

        },function (err) {

        });
      },function (err) {

      })



    }

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


    $scope.weekInit=false;
    $scope.openWeek=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.weekInit){
          $scope.weekInit=true
        }else {
          $scope.weekInit=false;

        }
        $ionicLoading.hide();

      },400)
    }

    $scope.monthInit=false;
    $scope.openMonth=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.monthInit){
          $scope.monthInit=true
        }else {
          $scope.monthInit=false;

        }
        $ionicLoading.hide();

      },400)


    }

    $scope.longInit=false;
    $scope.openLong=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.longInit){
          $scope.longInit=true
        }else {
          $scope.longInit=false;

        }
        $ionicLoading.hide();

      },400)


    }





















  })

  .controller('grouppictureCtrl', function ($scope, $state,$ionicHistory) {


    $scope.backAny=function () {
      $ionicHistory.goBack();
    }

  })
  
  .controller('groupfileCtrl', function ($scope, $state,$ionicHistory,$greendao,$api,$stateParams,$ionicLoading,$timeout) {

    $scope.ssionid=$stateParams.sessionid;

    //查找今天的
    $greendao.queryTodayFile($scope.ssionid,"file",function (msg) {

      $scope.todayday=msg;

    },function (err) {

    });
    //查找本周的
    $greendao.queryWeekFile($scope.ssionid,"file",function (msg) {

      $scope.weekday=msg;
    },function (err) {

    });
    //查找本月的
    $greendao.queryMonthFile($scope.ssionid,"file",function (msg) {
      $scope.monthday=msg;
    },function (err) {

    });
    //查找以前的
    $greendao.queryLongFile($scope.ssionid,"file",function (msg) {
      $scope.longday=msg;
    },function (err) {

    });



    $scope.openFileDetail=function (filepath,id) {
      $greendao.queryData("MessagesService","where _id =?",id,function (suc) {
        var bigmsg=suc[0];
        $api.openFileByPath(filepath,bigmsg, function (message) {

        },function (err) {

        });
      },function (err) {

      })



    }

    $scope.backAny=function () {
      $ionicHistory.goBack();
    }


    $scope.weekInit=false;
    $scope.openWeek=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.weekInit){
          $scope.weekInit=true
        }else {
          $scope.weekInit=false;

        }
        $ionicLoading.hide();

      },400)
    }

    $scope.monthInit=false;
    $scope.openMonth=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.monthInit){
          $scope.monthInit=true
        }else {
          $scope.monthInit=false;

        }
        $ionicLoading.hide();

      },400)


    }

    $scope.longInit=false;
    $scope.openLong=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.longInit){
          $scope.longInit=true
        }else {
          $scope.longInit=false;

        }
        $ionicLoading.hide();

      },400)


    }





















  })
