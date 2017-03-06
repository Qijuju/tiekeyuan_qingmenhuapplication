/**
 * Created by Administrator on 2017/2/21.
 */
//工作模块 打包轻门户应用
angular.module('work.controllers', [])
  .controller('WorkCtrl', function ($mqtt, $scope) {

    //获取用户登录后信息
    $mqtt.getUserInfo(function (succ) {
      $scope.data = succ;

    }, function (err) {

    });

  })
