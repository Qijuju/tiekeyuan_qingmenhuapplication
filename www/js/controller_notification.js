/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('notification.controllers', [])


  .controller('notificationCtrl', function ($scope,$state) {

    $scope.gonotificationDetail = function () {
      $state.go("notificationDetail");
    }
  })

.controller('notificationDetailCtrl', function ($scope,$state) {

  $scope.goback = function () {
    $state.go("tab.notification");
  }
  
})


