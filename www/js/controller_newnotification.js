/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('newnotification.controllers', [])

  .controller('newnotificationCtrl', function ($scope,$ToastUtils, $state,$chatarr, $pubionicloading, $api, $timeout, $rootScope, $notify, $mqtt, $ionicScrollDelegate, $ionicSlideBoxDelegate, $greendao, FinshedApp) {

    // 定义 icon 对应的路径集合数组
    $scope.appIcons = new Array();

    // 获取通知模块的 logo 的路径集合
    $scope.appIcons = $rootScope.notificationAppIcons;

    //进来通知界面就统计数据库通知的未读数量
    $greendao.queryData('NewNotifyListService','where IS_READ =?',"0",function (data) {
      //拿到的未读数量展示在tab底部及桌面角标
      cordova.plugins.notification.badge.set(data.length,function (succ) {
        $mqtt.saveInt('badgeNotifyCount',data.length);
      },function (err) {
        // alert("失败"+err);
      });
    },function (err) {

    });
    // 通知置顶操作
    $scope.goIsTopEvent = function (item) {
      var id = item.MsgId;
      var istop = item.IsToped  ? 'F' : 'T';

      $api.setNotifyMsg(id, false, istop, "", function (suc) {
        if (istop == "T") {
          item.IsToped = true;
        } else if (istop == "F") {
          item.IsToped = false;
        }
        $timeout(function () {
          // 消息置顶
          viewScroll.scrollTop();
          // 刷新页面
          $state.go('tab.notification',{},{reload:true});
        }, 100);
      }, function (err) {
        $ToastUtils.showToast("置顶更改失败");
        if (istop == "T") {
          item.IsToped = false;

        } else if (istop == "F") {
          item.IsToped = true;
        }

        $timeout(function () {
          // 消息置顶
          viewScroll.scrollTop();
          // 刷新页面
          $state.go('tab.notification',{},{reload:true});

        }, 100);
      })
    };

    // 添加关注操作
    $scope.goIsAttentionEvent = function (item) {

      var id = item.MsgId;
      var isattention = item.IsAttention  ? 'F' : 'T';

        $api.setNotifyMsg(id, false, "", isattention, function (suc) {
          if (isattention == "T") {
            item.IsAttention = true;
          } else if (isattention == "F") {
            item.IsAttention = false;
          }
        }, function (err) {
          $ToastUtils.showToast("关注更改失败");
          if (isattention == "T") {
            item.IsAttention = false;
          } else if (isattention == "F") {
            item.IsAttention = true;
          }
        })
    }


    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect = $rootScope.netStatus;
      })
    });

    $scope.$on("allnotify.update.error", function () {
      $scope.$apply(function () {
        $scope.shownetstatus = true;
      })
    })

    //消息模塊消息監聽
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        $greendao.queryByConditions('ChatListService', function (data) {
          $chatarr.setData(data);
          $scope.items = data;
        }, function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    // 通知数据源
    $scope.notifyNewList = [];

    //根據附件帶的url點擊進入附件
    $scope.gonet = function (net) {

      $state.go('netconfirm', {
        url: net
      })
    };

    // 接收的新通知
    $scope.$on('allnotify.update', function (event,data) {
      $scope.$apply(function () {
        $scope.shownetstatus = false;
        if(data != null && data !=undefined && data != ''){
          $scope.notifyNewList.unshift(data);
        }else{
          var notifyList = $notify.getAllNotify().msgList;

          $scope.lastCount = notifyList.length;
          if ($scope.lastCount == 5) {
            $scope.notifyStatus = true;
          } else if ($scope.lastCount < 5) {
            $scope.notifyStatus = false;
          }

          for (var i = 0; i < notifyList.length; i++) {
            $scope.notifyNewList.push(notifyList[i]);
          }
        }
        // // // 根据id，往数据源中追加图片路径字段信息
        // //进来通知界面取出icon对应的路径集合
        // $greendao.loadAllData('QYYIconPathService',function (succ) {
        //
        //   // 获取 icon 对应的路径集合
        //   $scope.appIcons = succ;


          // 循环遍历数据源，根据id查找相应的图片信息。有的话，设置为相应的图片信息；没有的话，设置一个默认显示图片的路径。
          for (var i = 0; i < $scope.notifyNewList.length; i++) {
            var fromId = $scope.notifyNewList[i].FromID;

            // 查找数据源，设置图片信息
            for (var j = 0; j < $scope.appIcons.length; j++) {
              if (  $scope.appIcons[j].appId === fromId ) {
                $scope.notifyNewList[i].appIcon = $scope.appIcons[j].path;
              }else {
              }
            }
          }
        //
        //
        //
        // },function (err) {
        //
        // });
      })
      $timeout(function () {
      }, 100);
    });

    $scope.loadMoreNotify = function () {
      if ($notify.getAllNotify().msgLeave === 0) {
        $scope.notifyStatus = false;
        return;
      } else {
        $notify.allNotify();
      }
    }

    $scope.newdex = 0;
    //滑块的状态
    $scope.appstatus = false;
    //当进入页面以后执行的方法
    $scope.$on('$ionicView.enter', function () {
      $scope.shownetstatus = false;
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
        viewScroll.scrollTop();
      } else if (index == 0 && $scope.appstatus == false) {
        $scope.go(0)
      }
    }

    $scope.go = function (index) {
      $ionicSlideBoxDelegate.slide(index);
    }

    //从全部跳入详情
    $scope.goNotifyDetail = function (obj) {
      $state.go('notifyDetail', {
        obj: {
          "bean": obj
        }
      })
    };
  })



  //跳转进入详情界面的展示
  .controller('notifyDetailCtrl', function ($scope, $stateParams, $ionicHistory, $greendao,$mqtt, $api, $timeout, $pubionicloading, $ToastUtils, $state, $ionicScrollDelegate, FinshedApp) {

    $scope.notifyObj = $stateParams.obj.bean;
    var fromId = $scope.notifyObj.FromID;
    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {
        //只要进入通知详情界面，就将该条通知置为已读
        var newnotifyobj={};
        newnotifyobj.msgId=$scope.notifyObj.MsgId;
        newnotifyobj.appId=$scope.notifyObj.FromID;
        newnotifyobj.isRead="1";
        newnotifyobj.appName=$scope.notifyObj.FromName;
        $greendao.saveObj('NewNotifyListService',newnotifyobj,function (succ) {
          console.log("更新数据库表"+JSON.stringify(succ));
          $greendao.queryData('NewNotifyListService','where IS_READ =?',"0",function (data) {
            //拿到的未读数量展示在tab底部及桌面角标
            cordova.plugins.notification.badge.set(data.length,function (msg) {
              console.log("进入详情界面"+data.length);
              $mqtt.saveInt('badgeNotifyCount',data.length);
            },function (err) {
              // alert("失败"+err);
            });
          },function (err) {

          });
        },function (err) {
        });
      },100);
    });


    // 根据id，往数据源中追加图片路径字段信息
    var finshedAppsArr = FinshedApp.all();  // 取出原始数据源信息

    // 查找数据源，设置图片信息
    for (var j = 0; j < finshedAppsArr.length; j++) {
      if (finshedAppsArr[j].appId == fromId) {
        $scope.notifyObj.appIcon = finshedAppsArr[j].appIcon;
      }
    }


    $scope.showlevel = $scope.notifyObj.Level;

    if ($scope.notifyObj.Level == 0) {
      $scope.levelName = "一般";
    } else if ($scope.notifyObj.Level == 1) {
      $scope.levelName = "一般紧急";
    } else if ($scope.notifyObj.Level == 2) {
      $scope.levelName = "非常紧急";
    } else {
      $scope.levelName = "超级紧急";
    }




    //通知置顶
    $scope.notifyTop = function (id, istop) {

      $api.setNotifyMsg(id, false, istop, "", function (suc) {

        if (istop == "T") {
          $scope.notifyObj.IsToped = true;


        } else if (istop == "F") {
          $scope.notifyObj.IsToped = false;

        }

        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

      }, function (err) {
        $ToastUtils.showToast("置顶更改失败")
        if (istop == "T") {
          $scope.notifyObj.IsToped = false;


        } else if (istop == "F") {
          $scope.notifyObj.IsToped = true;

        }

        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

      })
    }

    //添加关注
    $scope.notifyFocus = function (id, isattention) {

      $api.setNotifyMsg(id, false, "", isattention, function (suc) {
        if (isattention == "T") {
          $scope.notifyObj.IsAttention = true;


        } else if (isattention == "F") {
          $scope.notifyObj.IsAttention = false;

        }


        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      }, function (err) {
        $ToastUtils.showToast("关注更改失败")
        if (isattention == "T") {
          $scope.notifyObj.IsAttention = false;


        } else if (isattention == "F") {
          $scope.notifyObj.IsAttention = true;

        }


        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);


      })

    }


    //详情确认
    $scope.confirmDetail = function (id) {
      $pubionicloading.showloading('', '正在加载...');

      //调用接口确认回复详情
      $timeout(function () {
        $api.setNotifyMsg(id, true, "", "", function (suc) {
          $pubionicloading.hide();
          $scope.notifyObj.IsReaded = true;

          $timeout(function () {
            viewScroll.scrollTop();
          }, 100);

        }, function (err) {
          $pubionicloading.hide();
          $ToastUtils.showToast("确认失败")
        })
      })
    };

    $scope.openconfirm = function (id) {
      $state.go("confirmornot", {
        id: id
      })
    }

    $scope.gonetdetail = function (net) {
      $state.go('netconfirm', {
        url: net,
      })
    }


    $scope.backNotify = function () {
      $ionicHistory.goBack();
    };

  })





  //应用列表的详情

  .controller('notifyApplicationCtrl', function ($scope, $stateParams, $greendao, $state, $pubionicloading, $timeout, $ionicHistory) {

    $scope.hahaha = $stateParams.isfirm;


    $pubionicloading.showloading('', '正在加载...');


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

          $pubionicloading.hide();
          $scope.appmsg = msg;

        }, function (err) {

        });
      });


    });


    $scope.backApp = function () {
      $ionicHistory.goBack();
    }


  })

  .controller('confirmornotCtrl', function ($scope, $stateParams, $api, $ToastUtils, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, $ionicHistory) {

    $scope.msgid = $stateParams.id;

    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.index = 0;

    $scope.$on('$ionicView.enter', function () {

      $ionicSlideBoxDelegate.enableSlide(false);

      $api.getMsgReadList($scope.msgid, false, function (suc) {
        $scope.noNotifyUser = suc.userList;
        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      }, function (err) {
        $ToastUtils.showToast("获取失败")

      })


    })


    $scope.goConfirm = function (index) {
      $ionicSlideBoxDelegate.slide(index);
    }

    $scope.go_confirm = function (index) {


      if (index == 0) {
        $scope.index = 0;
        document.getElementById("rightbt").style.borderBottomColor = "#ffffff";
        document.getElementById("leftbt").style.borderBottomColor = "#6c9aff";
        document.getElementById("leftbt").style.borderWidth = "3px";
        $scope.noNotify();


      }

      if (index == 1) {
        $scope.index = 1;
        document.getElementById("leftbt").style.borderBottomColor = "#ffffff";
        document.getElementById("rightbt").style.borderBottomColor = "#6c9aff";
        document.getElementById("rightbt").style.borderWidth = "3px";

        $scope.alreadyNofiy();

      }

    }


    $scope.alreadyNofiy = function () {
      $api.getMsgReadList($scope.msgid, true, function (suc) {

        $scope.alreadyUser = suc.userList;

        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);
      }, function (err) {

        $ToastUtils.showToast("获取失败")
      })

    }

    $scope.noNotify = function () {
      $api.getMsgReadList($scope.msgid, false, function (suc) {

        $scope.noNotifyUser = suc.userList;
        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      }, function (err) {
        $ToastUtils.showToast("获取失败")

      })
    }


    $scope.backAny = function () {
      $ionicHistory.goBack();
    }


  })


  .controller('netconfirmCtrl', function ($scope, $stateParams, $sce) {
    $scope.neturl = $sce.trustAsResourceUrl($stateParams.url);

  })







