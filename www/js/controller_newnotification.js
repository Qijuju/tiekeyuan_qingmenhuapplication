/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('newnotification.controllers', [])


  .controller('newnotificationCtrl', function ($scope,$state,$ionicSlideBoxDelegate,$greendao,$ionicLoading,$timeout) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });


    //初始状态
    $scope.startA=false;
    $scope.titleAll=['全部','应用','关注'];
    $scope.newdex=0;
    //滑块的状态
    $scope.appstatus=false;

    //当滑动时候改变title的值
    $scope.go_changed=function (index) {
      if(index==0||index==1){
        $scope.newdex=0
        if(index==0){
          $scope.appstatus=false;

        }else if (index==1){
          $scope.appstatus=true;

        }
      }else if(index==2||index==3){
        $scope.newdex=1
        if(index==2){
          $scope.appstatus=false;

        }else if (index==3){
          $scope.appstatus=true;

        }
      }else if(index==4||index==5){
        $scope.newdex=2
        if(index==4){
          $scope.appstatus=false;

        }else if (index==5){
          $scope.appstatus=true;

        }
      }
    }

    //当进入页面以后执行的方法
    $scope.$on('$ionicView.enter', function () {
      $ionicSlideBoxDelegate.enableSlide(false);
      $timeout(function () {
        $greendao.loadAllData('ModuleCountService',function (data) {
          $scope.applist=data[0];
        },function (err) {

        });
        $greendao.queryByConditions("SystemMsgService",function (msg) {
          $ionicLoading.hide();
          $scope.allin=msg;
        },function (err) {

        });
      });



    });


    //点击滑块执行的方法
    $scope.changeSlide=function (index) {

      if(!$scope.appstatus){
        $scope.appstatus=true;
      }else {
        $scope.appstatus=false;


      }


      if(index==0 && $scope.appstatus==true){
        $scope.goConfirmAll(1)
      }else if (index==0 && $scope.appstatus==false){
        $scope.goAll(0)
      }else if (index==1 && $scope.appstatus==true){
        $scope.goConfirmApp(3)

      }else if (index==1 && $scope.appstatus==false){
        $scope.goApp(2)
      }else if (index==2 && $scope.appstatus==true){
        $scope.goConfirmFocus(5)
      }else if (index==2 && $scope.appstatus==false){
        $scope.goFocus(4)

      }

    }


    //打开下拉列表
    $scope.openNext=function () {
      if (!$scope.startA){
        $scope.startA=true
      }else {
        $scope.startA=false
      }
    };

    //点击界面的任何地方，或者活动时候就把他们隐藏
    $scope.clickAny=function () {
      $scope.startA=false
    };

    //跳转到默认的全部  index 是0；
    $scope.goAll=function (index) {
      $scope.appstatus=false;
      $scope.startA=false;
      $scope.newdex=0;

      $ionicSlideBoxDelegate.slide(index);


    };

    //全部已经确认  index 是 1
    $scope.goConfirmAll=function (index) {

      //$scope.appstatus=true;
      $scope.startA=false;
      $scope.newdex=0;
      $ionicSlideBoxDelegate.slide(index);

    };




    //我的应用(未确认) index 是2
    $scope.goApp=function (index) {

      $scope.appstatus=false;

      $scope.startA=false;
      $scope.newdex=1;

      $ionicSlideBoxDelegate.slide(index);


    };
    //我的应用(已经确认) index 是3
    $scope.goConfirmApp=function (index) {

      //$scope.appstatus=true;
      $scope.startA=false;
      $scope.newdex=1;

      $ionicSlideBoxDelegate.slide(index);

    };

    //我的关注划分(关注未确认)    index 是4
    $scope.goFocus=function (index) {

      $scope.appstatus=false;
      $scope.startA=false;
      $scope.newdex=2;

      $ionicSlideBoxDelegate.slide(index);

    };
    // 我的关注划分(关注已经确认) index 是5
    $scope.goConfirmFocus=function (index) {


      //$scope.appstatus=true;
      $scope.startA=false;
      $scope.newdex=2;

      $ionicSlideBoxDelegate.slide(index);



    };

    $scope.$on('newnotify.update', function (event) {
      $scope.$apply(function () {
        //数据库中查找全部的消息
        $greendao.queryByConditions("SystemMsgService",function (msg) {

          $scope.allin=msg;

        },function (err) {

        });

        $greendao.loadAllData('ModuleCountService',function (data) {
          // alert("模块应用列表的长度"+data.length);
          $scope.applist=data[0];
        },function (err) {

        });

      })
    });

    //从全部跳入详情
    $scope.goNotifyDetail=function (id) {


      $state.go('notifyDetail',{
        "id":id,
      });
    };

    //删除一条通知
    $scope.deleteNotify=function (id) {

      $timeout(function () {
        $greendao.deleteDataByArg("SystemMsgService",id,function (msg) {
          $greendao.queryByConditions("SystemMsgService",function (msg) {
            $ionicLoading.hide();
            $scope.allin=msg;

          },function (err) {

          });
        },function (err) {

        })
      });


    }

    $scope.gotoFocus=function (id) {
      switch (id){
        case '1':
          $greendao.loadAllData('ModuleCountService',function (data) {
            var newMsg={};
            newMsg.id=data[0].id;
            newMsg.name=data[0].name;
            newMsg.count1=0;
            newMsg.count2=data[0].count2;
            newMsg.count3=data[0].count3;
            newMsg.count4=data[0].count4;
            newMsg.type=data[0].type;

            $greendao.saveObj("ModuleCountService",newMsg,function (msg) {
              $state.go("notifyApplication",{
                id:id
              })
            },function (err) {

            });

          },function (err) {

          });
          break;
        case '15':
          $greendao.loadAllData('ModuleCountService',function (data) {
            var newMsg={};
            newMsg.id=data[0].id;
            newMsg.name=data[0].name;
            newMsg.count1=data[0].count1;
            newMsg.count2=0;
            newMsg.count3=data[0].count3;
            newMsg.count4=data[0].count4;
            newMsg.type=data[0].type;

            $greendao.saveObj("ModuleCountService",newMsg,function (msg) {
              $state.go("notifyApplication",{
                id:id
              })
            },function (err) {

            });

          },function (err) {

          });
          break;
        case '16':
          $greendao.loadAllData('ModuleCountService',function (data) {
            var newMsg={};
            newMsg.id=data[0].id;
            newMsg.name=data[0].name;
            newMsg.count1=data[0].count1;
            newMsg.count2=data[0].count2;
            newMsg.count3=0;
            newMsg.count4=data[0].count4;
            newMsg.type=data[0].type;

            $greendao.saveObj("ModuleCountService",newMsg,function (msg) {
              $state.go("notifyApplication",{
                id:id
              })
            },function (err) {

            });

          },function (err) {

          });
          break;
        case '18':
          $greendao.loadAllData('ModuleCountService',function (data) {
            var newMsg={};
            newMsg.id=data[0].id;
            newMsg.name=data[0].name;
            newMsg.count1=data[0].count1;
            newMsg.count2=data[0].count2;
            newMsg.count3=data[0].count3;
            newMsg.count4=0;
            newMsg.type=data[0].type;

            $greendao.saveObj("ModuleCountService",newMsg,function (msg) {
              $state.go("notifyApplication",{
                id:id
              })
            },function (err) {

            });

          },function (err) {

          });
          break;

      }
    }

  })




  //跳转进入详情界面的展示
  .controller('notifyDetailCtrl', function ($scope,$stateParams,$ionicHistory,$greendao) {

    $scope.id=$stateParams.id;

    $greendao.loadDataByArg("SystemMsgService",$scope.id,function (msg) {

        $scope.allDetail=msg;
        if(msg.istop==0){
          $scope.isTopStatus=false;

        }else {
          $scope.isTopStatus=true;
        }
        if(msg.isfocus=="false"){
          $scope.isFoucStatus=false;
        }else {
          $scope.isFoucStatus=true;

        }

    },function (err) {

    });

    //通知置顶
    $scope.notifyTop=function () {

      if(!$scope.isTopStatus){
        $scope.isTopStatus=true;
      }else {
        $scope.isTopStatus=false;
      }

    }

    //添加关注
    $scope.notifyFocus=function () {
      if(!$scope.isFoucStatus){
        $scope.isFoucStatus=true;
      }else {
        $scope.isFoucStatus=false;
      }
    }


    $scope.$on('$ionicView.leave', function () {

      $greendao.loadDataByArg("SystemMsgService",$scope.id,function (message) {

        var newNotify={};
        newNotify._id=message._id;
        newNotify.sessionid=message.sessionid;
        newNotify.type=message.type;
        newNotify.from=message.from;
        newNotify.message=message.message;
        newNotify.messagetype=message.messagetype;
        newNotify.platform=message.platform;
        newNotify.when=message.when;
        newNotify.isFailure=message.isFailure;
        newNotify.isDelete=message.isDelete;
        newNotify.imgSrc=message.imgSrc;
        newNotify.username=message.username;
        newNotify.senderid=message.senderid;
        newNotify.msglevel=message.msglevel;
        newNotify.isread="true";

        if($scope.isFoucStatus){
          newNotify.isfocus="true";

        }else {
          newNotify.isfocus="false";

        }


        if($scope.isTopStatus){
          newNotify.istop=100;
        }else {
          newNotify.istop=0;
        }
        $greendao.saveObj("SystemMsgService",newNotify,function (suc) {

        },function (err) {

        })

      },function (err) {

      });

    });






    $scope.backNotify=function () {
      $ionicHistory.goBack();
    };

  })





  //应用列表的详情

  .controller('notifyApplicationCtrl', function ($scope,$stateParams,$greendao,$state,$ionicLoading,$timeout,$ionicHistory) {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });


    $scope.ididididi=$stateParams.id;
    if($scope.ididididi==1){
      $scope.appname="公文处理";
    }else if ($scope.ididididi==15){
      $scope.appname="拌和站";
    }else if ($scope.ididididi==16){
      $scope.appname="试验室";
    }else if ($scope.ididididi==18){
      $scope.appname="围岩量测";
    }

    $scope.appGoNotifyDetail=function (nihao) {
      $state.go('notifyDetail',{
        "id":nihao,
      });
    }

    //当进入页面以后执行的方法


    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {

        $greendao.queryByConditions("SystemMsgService",function (msg) {
          $ionicLoading.hide();
          $scope.appmsg=msg;
        },function (err) {

        });
      });



    });



    $scope.backApp=function () {
      $ionicHistory.goBack();
    }


    /*$scope.$on('newnotify.update', function (event) {
      $scope.$apply(function () {
        $greendao.queryByConditions("SystemMsgService",function (msg) {

          $scope.appmsg=msg;

        },function (err) {

        });
      })
    });
*/











  })





