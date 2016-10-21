/**
 * Created by Administrator on 2016/10/19.
 */
angular.module('badge.controllers',[])

  .controller('tabsCtrl', function ($scope,$greendao) {

    $scope.allNoRead=0;
    $scope.badge=function () {

      return $scope.allNoRead;
    }



    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $scope.allNoRead=0;
        $greendao.loadAllData('ChatListService',function (msg) {

          if (msg.length>0){
            for(var i=0;i<msg.length;i++){
              $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
            }
          }
        },function (err) {

        })
      })
    });

    $scope.$on('noread.update', function (event) {


        $scope.allNoRead=0;
        $greendao.loadAllData('ChatListService',function (msg) {

          if (msg.length>0){
            for(var i=0;i<msg.length;i++){
              $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
            }
          }
        },function (err) {

        })

    });

    $scope.onTabSelected=function () {

      $scope.allNoRead=0;
      $greendao.loadAllData('ChatListService',function (msg) {

        if (msg.length>0){
          for(var i=0;i<msg.length;i++){
            $scope.allNoRead=$scope.allNoRead+parseInt(msg[i].count, 10);
          }

        }
      },function (err) {

      })
    };


  })

