/**
 * Created by Administrator on 2017/2/21.
 */
angular.module('work.controllers',[])
.controller('WorkCtrl',function ($mqtt,$scope) {
  $mqtt.getUserInfo(function (succ) {
    $scope.data=succ;
  },function (err) {
    
  });
})
