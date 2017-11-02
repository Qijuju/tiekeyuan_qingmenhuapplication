/**
 * Created by Administrator on 2016/10/19.
 */
angular.module('badge.controllers',[])

  .controller('tabsCtrl', function ($scope,$greendao,$pubionicloading,$mqtt,$ToastUtils,$rootScope) {

    // 门户新闻列表通知
    $rootScope.menHuTitle = "门户";


    $scope.allNoRead=0;
    $scope.badge=function () {
      if($scope.allNoRead>99){
        $scope.allNoRead=99+'+';
        return $scope.allNoRead;
      }
      return $scope.allNoRead;
    }



    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
       $greendao.loadAllData('ChatListService',function (msg) {
       $scope.allNoRead=0;
       if (msg.length>0){
       for(var i=0;i<msg.length;i++){
       $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
       }
       }
       },function (err) {

       })
      })
    });

    $scope.onTabSelected=function () {
      $pubionicloading.hide();
      $greendao.loadAllData('ChatListService',function (msg) {
        $scope.allNoRead=0;
        if (msg.length>0){
          for(var i=0;i<msg.length;i++){
            $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
          }
        }
      },function (err) {

      })
    };




    $scope.NotifyNoRead=0;
    /**新版通知数量显示**/
    $scope.notifyBadge=function () {
      $mqtt.getInt('badgeNotifyCount',function (count) {
        console.log("切换账号取出来的count值"+count);
        $scope.NotifyNoRead=count;
        if($scope.NotifyNoRead>99){
          $scope.NotifyNoRead=99+'+';
        }
        cordova.plugins.notification.badge.set($scope.NotifyNoRead,function (succ) {
          $mqtt.saveInt('badgeNotifyCount',$scope.NotifyNoRead);
        },function (err) {
          // alert("失败"+err);
        });
      },function (err) {
      });
      // $scope.apply();
      return $scope.NotifyNoRead;
    }

    //实时刷新通知数量显示在tab底部
    $scope.$on('allnotify.update', function (event, data) {
      $scope.$apply(function () {
        $mqtt.getInt('badgeNotifyCount',function (count) {
          $scope.NotifyNoRead=count;
          if($scope.NotifyNoRead>99){
            $scope.NotifyNoRead=99+'+';
          }
        },function (err) {
        });
      });
    })

    //点击选中通知模块的tab时
    $scope.onNotifyTabSelected=function () {
      $greendao.queryData('NewNotifyListService', 'where IS_READ =?', "0", function (msg) {
        $scope.NotifyNoRead = 0;
        if (msg.length > 0) {
          $scope.NotifyNoRead = $scope.NotifyNoRead + msg.length;
          console.log("切换账号取出来的count值===进入通知模块"+$scope.NotifyNoRead);
          $mqtt.saveInt("badgeNotifyCount",$scope.NotifyNoRead);
        }
      }, function (err) {
      });
    };



    /**老版通知的未读数量显示**/

    /*$scope.notifyNoRead=0;

     $scope.notifyBadge=function () {

     return $scope.notifyNoRead;
     }

     $scope.$on('newnotify.update', function (event) {

     $scope.$apply(function () {

     $greendao.queryData('SystemMsgService',"where isread =?","false",function (msg) {
     $scope.notifyNoRead=0;

     if (msg.length>0){
     $scope.notifyNoRead=$scope.notifyNoRead+msg.length;
     }

     },function (msg) {

     });
     })
     });*/


    /**暂时用不到**/
    // $scope.$on('second.notify', function (event) {
    //
    //   $scope.$apply(function () {
    //
    //     $greendao.queryData('SystemMsgService',"where isread =?","false",function (msg) {
    //       $scope.notifyNoRead=0;
    //
    //       if (msg.length>0){
    //         $scope.notifyNoRead=$scope.notifyNoRead+msg.length;
    //       }
    //
    //     },function (msg) {
    //
    //     });
    //
    //   })
    // });

    //删除成功(现在通知模块没有删除功能)
    // $scope.$on('lastcount.update', function (event) {
    //
    //   $scope.$apply(function () {
    //     $greendao.loadAllData('ChatListService',function (msg) {
    //       $scope.allNoRead=0;
    //       if (msg.length>0){
    //         for(var i=0;i<msg.length;i++){
    //           $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
    //         }
    //       }
    //     },function (err) {
    //
    //     })
    //   })
    // });
  })

