/**
 * Created by Administrator on 2016/10/19.
 */
angular.module('badge.controllers',[])

  .controller('tabsCtrl', function ($scope,$greendao,$ionicLoading,$ToastUtils) {

    $scope.allNoRead=0;
    $scope.badge=function () {


      if($scope.allNoRead>99){
        $scope.allNoRead=99+'+'
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

          }

        }
      },function (err) {

      })


    });

    $scope.onTabSelected=function () {
      $ionicLoading.hide();
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



    $scope.notifyNoRead=0;

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
    });



    $scope.onNotifyTabSelected=function () {

      $greendao.queryData('SystemMsgService',"where isread =?","false",function (msg) {
        $scope.notifyNoRead=0;

        if (msg.length>0){
          $scope.notifyNoRead=$scope.notifyNoRead+msg.length;
        }

      },function (msg) {

      });
    };

    $scope.$on('second.notify', function (event) {

      $scope.$apply(function () {

        $greendao.queryData('SystemMsgService',"where isread =?","false",function (msg) {
          $scope.notifyNoRead=0;

          if (msg.length>0){
            $scope.notifyNoRead=$scope.notifyNoRead+msg.length;
          }

        },function (msg) {

        });

      })
    });

    //删除成功
    $scope.$on('lastcount.update', function (event) {

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












  })

