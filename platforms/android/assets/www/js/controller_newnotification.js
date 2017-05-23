/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('newnotification.controllers', [])


  .controller('newnotificationCtrl', function ($scope, $state,  $ionicLoading,$api, $timeout, $rootScope,$notify,$mqtt,$ionicScrollDelegate,$ionicSlideBoxDelegate) {


    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect=$rootScope.netStatus;
      })
    });

    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $greendao.queryByConditions('ChatListService',function (data) {
          $chatarr.setData(data);
          $scope.items=data;
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    $scope.notifyNewList=[];

    /*$ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });
*/
    $scope.gonet=function (net) {

      $state.go('netconfirm',{
        url:net,
      })

    };

    $scope.$on('allnotify.update', function (event) {
      $scope.$apply(function () {

       $scope.notifyjson= $notify.getAllNotify();
       var notifyList= $notify.getAllNotify().msgList;

       $scope.lastCount= $notify.getAllNotify().msgList.length;


        if ($scope.lastCount==5){
          $scope.notifyStatus=true;

        }else if($scope.lastCount<5) {
          $scope.notifyStatus=false;

        }

        for (var i = 0; i <notifyList.length; i++) {

          $scope.notifyNewList.push(notifyList[i]);
        }

        $scope.$broadcast('scroll.infiniteScrollComplete');


      })
    });



    $scope.loadMoreNotify=function () {
      if($notify.getAllNotify().msgLeave==0){
        $scope.notifyStatus=false;
        return;
      }else {
        $notify.allNotify();
      }
    }









    //初始状态
/*
    $scope.startA = false;
*/
/*
    $scope.titleAll = ['通知', '应用'];
*/
    $scope.newdex = 0;
    //滑块的状态
    $scope.appstatus = false;


    //当滑动时候改变title的值
   /* $scope.go_changed = function (index) {
      if (index == 0 || index == 1) {
        $scope.newdex = 0
        if (index == 0) {
          $scope.appstatus = false;

        } else if (index == 1) {
          $scope.appstatus = true;

        }
      }
    }*/


    //当进入页面以后执行的方法
    $scope.$on('$ionicView.enter', function () {
      $ionicSlideBoxDelegate.enableSlide(false);
      $notify.clearDefaultCount();
      $notify.allNotify();


    });


    //点击滑块执行的方法
    $scope.changeSlide = function (index) {

      if (!$scope.appstatus) {
        $scope.appstatus = true;
      } else {
        $scope.appstatus = false;
      }
      if (index == 0 && $scope.appstatus == true) {
        //已确认模块改成关注模块(Liuxw
        $scope.go(1)

      } else if (index == 0 && $scope.appstatus == false) {
        $scope.go(0)

      }

    }


    /*//打开下拉列表
    $scope.openNext = function () {
      if (!$scope.startA) {
        $scope.startA = true
      } else {
        $scope.startA = false
      }
    };
*/
    /*//点击界面的任何地方，或者活动时候就把他们隐藏
    $scope.clickAny = function () {
      $scope.startA = false
    };*/

   /* //跳转到默认的全部  index 是0；
    $scope.goAll = function (index) {

      $scope.appstatus = false;
      $scope.startA = false;
      $scope.newdex = 0;

      $ionicSlideBoxDelegate.slide(index);


    };
*/
    $scope.go=function (index) {

      $ionicSlideBoxDelegate.slide(index);

    }

   /* //全部已经确认  index 是 1
    $scope.goConfirmAll = function (index) {

      //$scope.appstatus=true;
      $scope.startA = false;
      $scope.newdex = 0;
      $ionicSlideBoxDelegate.slide(index);

    };


    //我的应用(未确认) index 是2
    $scope.goApp = function (index) {

      $scope.appstatus = false;

      $scope.startA = false;
      $scope.newdex = 1;

      $ionicSlideBoxDelegate.slide(index);


    };
    //我的应用(已经确认) index 是3
    $scope.goConfirmApp = function (index) {

      //$scope.appstatus=true;
      $scope.startA = false;
      $scope.newdex = 1;

      $ionicSlideBoxDelegate.slide(index);

    };

    //我的关注划分(关注未确认)    index 是4
    $scope.goFocus = function (index) {


      $scope.startA = false;
      // $scope.appstatus=false;
      // $scope.newdex=2; //之前是2,false  后改成 0 true
      $scope.appstatus = true;
      $scope.newdex = 0;
      $ionicSlideBoxDelegate.slide(index);

    };
    // 我的关注划分(关注已经确认) index 是5
    $scope.goConfirmFocus = function (index) {


      //$scope.appstatus=true;
      $scope.startA = false;
      $scope.newdex = 2;

      $ionicSlideBoxDelegate.slide(index);


    };*/

    $scope.$on('newnotify.update', function (event,msg) {


      $scope.notifyNewList.unshift(msg)
      $timeout(function () {
        viewScroll.scrollTop();
      }, 100);

      //应用列表的展示
      $greendao.queryNotifyCount("1", function (msg) {
        $scope.gongwen = msg.length;

      }, function (err) {

      })
      $greendao.queryNotifyCount("15", function (msg) {
        $scope.banhezhan = msg.length;

      }, function (err) {

      })
      $greendao.queryNotifyCount("16", function (msg) {
        $scope.shiyanshi = msg.length;

      }, function (err) {

      })
      $greendao.queryNotifyCount("18", function (msg) {
        $scope.weiyan = msg.length;

      }, function (err) {

      })


    });


    //从全部跳入详情
    $scope.goNotifyDetail = function (obj) {
      $state.go('notifyDetail',{
        obj:{
          "bean":obj
        }
      })
    };



    //公有方法：点击确认以后更改数据库/数组的item
    $scope.updateitemdata = function (id, array) {
      for (var i = 0; i <= array.length - 1; i++) {
        if (array[i]._id === id) {
          array[i].isread = 'true';
          array[i].isconfirm = 'true';
          $greendao.saveObj('SystemMsgService', array[i], function (succ) {
            $rootScope.$broadcast('newnotify.update');
          }, function (err) {
          });
        }
      }
    }
    //详情确认
    $scope.mainconfirm = function (id, flag) {
      if (flag === 'today') {
        $scope.updateitemdata(id, $scope.todayTime);
      } else if (flag === 'week') {
        $scope.updateitemdata(id, $scope.weektimeday);
      } else if (flag === 'ago') {
        $scope.updateitemdata(id, $scope.otherDay);
      }
    };

    //公有方法：更改关注状态的数据库/数组
    $scope.updatefocusitem = function (id, array) {
      for (var i = 0; i <= array.length - 1; i++) {
        if (array[i]._id === id) {
          array[i].isfocus = !array[i].isfocus;
          $greendao.saveObj('SystemMsgService', array[i], function (succ) {
            $rootScope.$broadcast('newnotify.update');
          }, function (err) {
          });
        }
      }
    }

    //点击关注按钮，修改关注状态事件
    $scope.onchangefocus = function (id, flag) {
      if (flag === 'today') {
        $scope.updatefocusitem(id, $scope.todayTime);
      } else if (flag === 'week') {
        $scope.updatefocusitem(id, $scope.weektimeday);
      } else if (flag === 'ago') {
        $scope.updatefocusitem(id, $scope.otherDay);
      }
    };


    $scope.gotoFocus = function (id, isfirm) {
      if (isfirm == 0) {
        switch (id) {
          case '1':
            $state.go("notifyApplication", {
              id: id,
              isfirm: isfirm
            })

            break;
          case '15':
            $state.go("notifyApplication", {
              id: id,
              isfirm: isfirm
            })
            break;
          case '16':
            $state.go("notifyApplication", {
              id: id,
              isfirm: isfirm
            })
            break;
          case '18':
            $state.go("notifyApplication", {
              id: id,
              isfirm: isfirm
            })
            break;
        }
      } else {
        $state.go("notifyApplication", {

          id: id,
          isfirm: isfirm
        })
      }

    }

  })








  //跳转进入详情界面的展示
  .controller('notifyDetailCtrl', function ($scope, $stateParams, $ionicHistory, $greendao, $api, $timeout, $ionicLoading, $ToastUtils,$state,$ionicScrollDelegate) {

    $scope.notifyObj =$stateParams.obj.bean;
    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');


    if ($scope.notifyObj.Level ==0 ) {
      $scope.levelName = "一般";
    } else if ($scope.notifyObj.Level ==1 ) {
      $scope.levelName = "一般紧急";
    } else if ($scope.notifyObj.Level ==2 ) {
      $scope.levelName = "非常紧急";
    } else {
      $scope.levelName = "超级紧急";
    }






    //通知置顶
    $scope.notifyTop = function (id,istop) {



      $api.setNotifyMsg(id,false,istop,"",function (suc) {

        if(istop=="T"){
          $scope.notifyObj.IsToped=true;


        }else if (istop=="F")
        {
          $scope.notifyObj.IsToped=false;

        }

        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

      },function (err) {
       $ToastUtils.showToast("置顶更改失败")
        if(istop=="T"){
          $scope.notifyObj.IsToped=false;


        }else if (istop=="F")
        {
          $scope.notifyObj.IsToped=true;

        }

        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

      })

    }

    //添加关注
    $scope.notifyFocus = function (id,isattention) {

      $api.setNotifyMsg(id,false,"",isattention,function (suc) {
        if(isattention=="T"){
          $scope.notifyObj.IsAttention=true;


        }else if (isattention=="F")
        {
          $scope.notifyObj.IsAttention=false;

        }



        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      },function (err) {
        $ToastUtils.showToast("关注更改失败")
        if(isattention=="T"){
          $scope.notifyObj.IsAttention=false;


        }else if (isattention=="F")
        {
          $scope.notifyObj.IsAttention=true;

        }



        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);


      })

    }


    //详情确认
    $scope.confirmDetail = function (id) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 100,
        showDelay: 0
      });

      //调用接口确认回复详情
      $timeout(function () {
        $api.setNotifyMsg(id,true,"","",function (suc) {
          $ionicLoading.hide();
          $scope.notifyObj.IsReaded=true;

          $timeout(function () {
            viewScroll.scrollTop();

          }, 100);

        },function (err) {
          $ionicLoading.hide();
          $ToastUtils.showToast("确认失败")

        })


      })




    };

    $scope.openconfirm=function (id) {
      $state.go("confirmornot",{
        id:id,
      })
    }

    $scope.gonetdetail=function (net) {
      $state.go('netconfirm',{
        url:net,
      })
    }




    $scope.backNotify = function () {
      $ionicHistory.goBack();
    };

  })





  //应用列表的详情

  .controller('notifyApplicationCtrl', function ($scope, $stateParams, $greendao, $state, $ionicLoading, $timeout, $ionicHistory) {

    $scope.hahaha = $stateParams.isfirm;


    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });


    $scope.ididididi = $stateParams.id;
    if ($scope.ididididi == 1) {
      $scope.appname = "公文处理";
    } else if ($scope.ididididi == 15) {
      $scope.appname = "拌和站";
    } else if ($scope.ididididi == 16) {
      $scope.appname = "试验室";
    } else if ($scope.ididididi == 18) {
      $scope.appname = "围岩量测";
    }

    $scope.appGoNotifyDetail = function (nihao) {
      $state.go('notifyDetail', {
        "id": nihao,
      });
    }

    //当进入页面以后执行的方法


    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {

        $greendao.queryByConditions("SystemMsgService", function (msg) {

          $ionicLoading.hide();
          $scope.appmsg = msg;

        }, function (err) {

        });
      });


    });


    $scope.backApp = function () {
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

  .controller('confirmornotCtrl', function ($scope, $stateParams,$api,$ToastUtils,$ionicScrollDelegate,$timeout,$ionicSlideBoxDelegate,$ionicHistory) {

    $scope.msgid=$stateParams.id;

    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.index=0;

    $scope.$on('$ionicView.enter', function () {

      $ionicSlideBoxDelegate.enableSlide(false);

      $api.getMsgReadList($scope.msgid,false,function (suc) {
        $scope.noNotifyUser=suc.userList;
        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      },function (err) {
        $ToastUtils.showToast("获取失败")

      })



    })



    $scope.goConfirm=function (index) {
      $ionicSlideBoxDelegate.slide(index);
    }

    $scope.go_confirm=function (index) {


      if (index==0){
        $scope.index =0;
        document.getElementById("rightbt").style.borderBottomColor="#ffffff";
        document.getElementById("leftbt").style.borderBottomColor="#6c9aff";
        document.getElementById("leftbt").style.borderWidth="3px";
        $scope.noNotify();


      }

      if(index==1){
        $scope.index =1;
        document.getElementById("leftbt").style.borderBottomColor="#ffffff";
        document.getElementById("rightbt").style.borderBottomColor="#6c9aff";
        document.getElementById("rightbt").style.borderWidth="3px";

        $scope.alreadyNofiy();

      }

    }



    $scope.alreadyNofiy=function () {
      $api.getMsgReadList($scope.msgid,true,function (suc) {

        $scope.alreadyUser=suc.userList;

        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);
      },function (err) {

        $ToastUtils.showToast("获取失败")
      })

    }

    $scope.noNotify=function () {
      $api.getMsgReadList($scope.msgid,false,function (suc) {

        $scope.noNotifyUser=suc.userList;
        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      },function (err) {
        $ToastUtils.showToast("获取失败")

      })
    }


    $scope.backAny=function () {
      $ionicHistory.goBack();
    }




  })



  .controller('netconfirmCtrl', function ($scope, $stateParams,$sce) {


   //$scope.neturl=$stateParams.url;
    //$scope.neturl="https://www.baidu.com";
    $scope.neturl=$sce.trustAsResourceUrl($stateParams.url);

    // alert( $scope.neturl)


  })







