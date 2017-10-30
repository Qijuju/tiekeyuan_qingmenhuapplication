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
      }else {
        return $scope.allNoRead;
      }


    }



    $scope.$on('msgs.update', function (event) {

      $scope.$apply(function () {
       $greendao.loadAllData('ChatListService',function (msg) {
       $scope.allNoRead=0;
       if (msg.length>0){
       for(var i=0;i<msg.length;i++){
       $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
       }

       // $ToastUtils.showToast($scope.allNoRead)
       }


       },function (err) {

       })


      })

    });

    $scope.$on('noread.update', function (event) {

      $greendao.loadAllData('ChatListService',function (msg) {
        $scope.allNoRead=0;

        if (msg.length>0){
          for(var i=0;i<msg.length;i++){
            $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
            // console.log("底部消息tab数量显示"+$scope.allNoRead);
          }

        }
      },function (err) {

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


    //实时刷新通知数量显示在tab底部
    $scope.$on('allnotify.update', function (event, data) {
      $scope.$apply(function () {
        $greendao.queryData('NewNotifyListService', 'where IS_READ =?', "0", function (msg) {
          $scope.NotifyNoRead = 0;
          if (msg.length > 0) {
            $scope.NotifyNoRead = $scope.NotifyNoRead + msg.length;
            console.log("及时推送"+$scope.NotifyNoRead);
            $mqtt.saveInt("badgeNotifyCount",$scope.NotifyNoRead);
          }
        }, function (err) {
        });
      });
    })




    $scope.NotifyNoRead=0;
    /**新版通知数量显示**/
    $scope.notifyBadge=function () {
      // $mqtt.getInt('badgeNotifyCount',function (count) {
      //   console.log("啦啦啦"+$scope.NotifyNoRead);
      //   $scope.NotifyNoRead=count;
      //   if($scope.NotifyNoRead>99){
      //     $scope.NotifyNoRead=99+'+';
      //   }
      // },function (err) {
      // });
      $greendao.queryData('NewNotifyListService', 'where IS_READ =?', "0", function (msg) {
        $scope.NotifyNoRead=0;
        if (msg.length > 0) {
          $scope.NotifyNoRead = $scope.NotifyNoRead + msg.length;
          $mqtt.saveInt("badgeNotifyCount",$scope.NotifyNoRead);
          $mqtt.getInt("badgeNotifyCount",function (succ) {
            console.log("在badge方法中取出保存的int值"+succ);
          },function (err) {
          });

        }
      }, function (err) {
      });
      console.log("初始化时最后要返回的count值"+$scope.NotifyNoRead);
      return $scope.NotifyNoRead;
    }

    //点击选中通知模块的tab时
    $scope.onNotifyTabSelected=function () {
      $greendao.queryData('NewNotifyListService', 'where IS_READ =?', "0", function (msg) {
        $scope.NotifyNoRead = 0;
        if (msg.length > 0) {
          $scope.NotifyNoRead = $scope.NotifyNoRead + msg.length;
          console.log("底部tab11111数量显示"+$scope.NotifyNoRead);
          $mqtt.saveInt("badgeNotifyCount",$scope.NotifyNoRead);
          $mqtt.getInt("badgeNotifyCount",function (succ) {
            console.log("取出保存的int值"+succ);
          },function (err) {
          });
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

