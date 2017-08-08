/**
 * Created by Administrator on 2017/5/22.
 */
/**
 * Created by Administrator on 2017/5/11.
 */
angular.module('fountion.controllers', [])
  .controller('founctionCtrl', function ($mqtt, $scope, $ToastUtils, $greendao, $stateParams, $cordovaDevice, $chatarr, $state,$timeout,$location,$ionicPlatform,$ionicHistory) {

    $scope.$on('$ionicView.enter', function () {
      $mqtt.getUserInfo(function (msg) {
        $scope.UserID = msg.userID;
        $scope.DeptID=msg.deptID;
        $scope.mymypersonname = msg.userName

      }, function (msg) {
        // $ToastUtils.showToast(msg)
      });

    });

//文件群发
    $scope.goMasstexting=function () {
      $greendao.deleteAllData('SelectIdService',function (data) {
        // alert('数据被清空了')
      },function (err) {

      });
      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.UserID;
      selectInfo.name=$scope.mymypersonname;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user';
      selectInfo.parentid=$scope.DeptID;
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      })

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":'',
        "functiontag":'file'
      });
    }

    $scope.goAcount = function () {
      $state.go("tab.account");
    }

  })
