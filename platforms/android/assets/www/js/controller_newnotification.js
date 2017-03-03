/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('newnotification.controllers', [])


  .controller('newnotificationCtrl', function ($scope,$state,$ionicSlideBoxDelegate,$greendao,$ionicLoading,$timeout,$rootScope) {

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.initstate=false;
    $scope.openagain=function () {

      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.initstate){
          $scope.initstate=true
        }else {
          $scope.initstate=false;

        }
        $ionicLoading.hide();

      },400)


    }

    $scope.initweekstate=false;
    $scope.openweeknotify=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      $timeout(function () {
        if(!$scope.initweekstate){
          $scope.initweekstate=true
        }else {
          $scope.initweekstate=false;
        }
        $ionicLoading.hide();

      },400)


    }



    //初始状态
    $scope.startA=false;
    // $scope.titleAll=['通知','应用','关注'];
    $scope.titleAll=['通知','应用'];
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
        //之前4，后改成0（Liuxw)
        // $scope.newdex=4
        $scope.newdex=0
        if(index==4){
          $scope.appstatus=true;//之前false改成ture

        }else if (index==5){
          $scope.appstatus=true;

        }
      }
    }


    //当进入页面以后执行的方法
    $scope.$on('$ionicView.enter', function () {

      $ionicSlideBoxDelegate.enableSlide(false);
      $timeout(function () {

        $greendao.queryByConditions("SystemMsgService",function (msg) {
            if(msg.length==0){
              $ionicLoading.hide();
           }
           //$ionicLoading.hide();
          $scope.allin=msg;

        },function (err) {
          $ionicLoading.hide();

        });

        $greendao.queryByToday(function (msg) {

          $scope.todayTime=msg;
          $greendao.queryByWeek(function (msg) {
            $scope.weektimeday=msg;
            $greendao.queryByYesterday(function (msg) {
              $scope.otherDay=msg;
              $ionicLoading.hide();
            },function (err) {
              $ionicLoading.hide();
            })
          },function (err) {
            $ionicLoading.hide();

          });

        },function (err) {
          $ionicLoading.hide();

        });

        $greendao.queryNotifyCount("1",function (msg) {
          $scope.gongwen=msg.length;

        },function (err) {

        })
        $greendao.queryNotifyCount("15",function (msg) {
          $scope.banhezhan=msg.length;

        },function (err) {

        })
        $greendao.queryNotifyCount("16",function (msg) {
          $scope.shiyanshi=msg.length;

        },function (err) {

        })
        $greendao.queryNotifyCount("18",function (msg) {
          $scope.weiyan=msg.length;

        },function (err) {

        })

      });
      $rootScope.$broadcast('second.notify');




    });


    //点击滑块执行的方法
    $scope.changeSlide=function (index) {


      if(!$scope.appstatus){
        $scope.appstatus=true;
      }else {
        $scope.appstatus=false;
      }
      if(index==0 && $scope.appstatus==true){
        //已确认模块改成关注模块(Liuxw
        // $scope.goConfirmAll(1)
        $scope.goFocus(4);
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


      $scope.startA=false;
      // $scope.appstatus=false;
      // $scope.newdex=2; //之前是2,false  后改成 0 true
      $scope.appstatus=true;
      $scope.newdex=0;
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

        $greendao.queryByToday(function (msg) {

          $scope.todayTime=msg;
          $greendao.queryByWeek(function (msg) {
            $scope.weektimeday=msg;
            $greendao.queryByYesterday(function (msg) {
              $scope.otherDay=msg;

            },function (err) {

            })

          },function (err) {

          });

        },function (err) {

        });


        //应用列表的展示
        $greendao.queryNotifyCount("1",function (msg) {
          $scope.gongwen=msg.length;

        },function (err) {

        })
        $greendao.queryNotifyCount("15",function (msg) {
          $scope.banhezhan=msg.length;

        },function (err) {

        })
        $greendao.queryNotifyCount("16",function (msg) {
          $scope.shiyanshi=msg.length;

        },function (err) {

        })
        $greendao.queryNotifyCount("18",function (msg) {
          $scope.weiyan=msg.length;

        },function (err) {

        })







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
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });

      $timeout(function () {
        $greendao.deleteDataByArg("SystemMsgService",id,function (msg) {
          $greendao.queryByConditions("SystemMsgService",function (msg) {
            $scope.allin=msg;
            $greendao.queryByToday(function (msg) {
              $ionicLoading.hide();
              $scope.todayTime=msg;
              $greendao.queryByWeek(function (msg) {
                $scope.weektimeday=msg;
                $greendao.queryByYesterday(function (msg) {
                  $scope.otherDay=msg;
                  $rootScope.$broadcast('second.notify');

                },function (err) {

                })

              },function (err) {

              });

            },function (err) {

            });



          },function (err) {

          });

          $greendao.queryNotifyCount("1",function (msg) {
            $scope.gongwen=msg.length;

          },function (err) {

          })
          $greendao.queryNotifyCount("15",function (msg) {
            $scope.banhezhan=msg.length;

          },function (err) {

          })
          $greendao.queryNotifyCount("16",function (msg) {
            $scope.shiyanshi=msg.length;

          },function (err) {

          })
          $greendao.queryNotifyCount("18",function (msg) {
            $scope.weiyan=msg.length;

          },function (err) {

          })

        },function (err) {

        })
      });



    }

    $scope.gotoFocus=function (id,isfirm) {
      if(isfirm==0){
        switch (id){
          case '1':
            $state.go("notifyApplication",{
              id:id,
              isfirm:isfirm
            })

            break;
          case '15':
            $state.go("notifyApplication",{
              id:id,
              isfirm:isfirm
            })


            break;
          case '16':
            $state.go("notifyApplication",{
              id:id,
              isfirm:isfirm
            })
            break;
          case '18':
            $state.go("notifyApplication",{
              id:id,
              isfirm:isfirm
            })
            break;

        }
      }else {
        $state.go("notifyApplication",{

          id:id,
          isfirm:isfirm
        })
      }

    }

  })


  //跳转进入详情界面的展示
  .controller('notifyDetailCtrl', function ($scope,$stateParams,$ionicHistory,$greendao,$api,$timeout,$ionicLoading,$ToastUtils) {

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

        if(msg.msglevel=="Level_3"){
          $scope.levelName="超级紧急";
        }else if(msg.msglevel=="Level_2"){
          $scope.levelName="非常紧急";
        }else if(msg.msglevel=="Level_1"){
          $scope.levelName="一般紧急";
        }else {
          $scope.levelName="一般";
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


    //详情确认
    $scope.confirmDetail=function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });
      //调用接口确认回复详情
      $timeout(function () {
        $api.readMessage($scope.allDetail.type,$scope.allDetail.sessionid,$scope.allDetail.when,function (suc) {

          $scope.lastDetail=suc;

          var confirmD={};
          confirmD._id=$scope.allDetail._id;
          confirmD.sessionid=$scope.allDetail.sessionid;
          confirmD.type=$scope.allDetail.type;
          confirmD.from=$scope.allDetail.from;
          confirmD.message=$scope.allDetail.message;
          confirmD.messagetype=$scope.allDetail.messagetype;
          confirmD.platform=$scope.allDetail.platform;
          confirmD.when=suc.sendWhen;
          confirmD.isFailure=$scope.allDetail.isFailure;
          confirmD.isDelete=$scope.allDetail.isDelete;
          confirmD.imgSrc=$scope.allDetail.imgSrc;
          confirmD.username=$scope.allDetail.username;
          confirmD.senderid=$scope.allDetail.senderid;
          confirmD.msglevel=$scope.allDetail.msglevel;
          confirmD.isread="true";
          confirmD.isconfirm="true";

          if($scope.isFoucStatus){
            confirmD.isfocus="true";

          }else {
            confirmD.isfocus="false";

          }

          if($scope.isTopStatus){
            confirmD.istop=100;
          }else {
            confirmD.istop=0;
          }
          $greendao.saveObj("SystemMsgService",confirmD,function (suc) {

            $ionicLoading.hide();
            $scope.allDetail=confirmD;


          },function (err) {

            $ionicLoading.hide();

          })
        },function (err) {
          $ToastUtils.showToast(err)

          $ionicLoading.hide();

        })

      })


    };




    $scope.$on('$ionicView.beforeLeave', function () {

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
        newNotify.isconfirm=message.isconfirm;
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

    $scope.hahaha=$stateParams.isfirm;


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
      $scope.appname="连续梁";
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





