/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('newnotification.controllers', [])
  .controller('newnotificationCtrl', function ($scope,$ToastUtils, $state,$chatarr, $pubionicloading, $api, $timeout, $rootScope, $notify, $mqtt, $ionicScrollDelegate, $ionicSlideBoxDelegate, $greendao, FinshedApp) {


    $scope.showNum = 0;
    //  tabs切换，重置当前点击对象及兄弟元素的样式
    $scope.tabClick = function ($event, value) {

      var currentClickObj = $event.target;
      $(currentClickObj).css({
        "background":"#3F51B5",
        "color":"#fff"
      }).siblings().css({
        "background":"#fff",
        "color":"#3F51B5"
      });

      // 根据value值，改变showNum的值，进而显示不同的页面
      $scope.showNum = value;

    };

    // 全部通知列表数据源
    $scope.notifyNewList = [];

    //已关注的通知列表数据源
    $scope.allAttentionNotifyList = [];

    //进来通知界面就统计数据库通知的未读数量
    $greendao.queryData('NewNotifyListService','where IS_READ =?',"0",function (data) {
      //拿到的未读数量展示在tab底部及桌面角标
      cordova.plugins.notification.badge.set(data.length,function (succ) {
        $mqtt.saveInt('badgeNotifyCount',data.length);
      },function (err) {
      });

      // 未读的通知
      $scope.noReadData = data;
    },function (err) {

    });

    // 置顶操作
    $scope.goIsTopEvent = function (item) {
      var id = item.MsgId;
      var istop = item.IsToped  ? 'F' : 'T';

      $api.setNotifyMsg(id, false, istop, "", function (suc) {
        if (istop === "T") {
          item.IsToped = true;
        } else if (istop === "F") {
          item.IsToped = false;
        }
        $timeout(function () {
          // 消息置顶
          viewScroll.scrollTop();

          // 刷新页面(可能存在:从详情页返回全部通知列表页面时刷新两遍的问题？？待解决)
          $state.go('tab.notification',{},{reload:true});

        }, 100);
      }, function (err) {
        $ToastUtils.showToast("置顶更改失败");
        if (istop === "T") {
          item.IsToped = false;

        } else if (istop === "F") {
          item.IsToped = true;
        }

        $timeout(function () {
          // 消息置顶
          viewScroll.scrollTop();
          // 刷新页面
          $state.go('tab.notification',{},{reload:true});


        },100);
      })
    };

    // 点击“全部”列表页的“关注图标”调取的方式,即：添加关注 or 取消关注。
    $scope.goIsAttentionEvent = function (item) {
      var id = item.MsgId;
      var isattention = item.IsAttention  ? 'F' : 'T';
      $api.setNotifyMsg(id, false, "", isattention, function (suc) {
        if (isattention === "T") { // 添加关注
          item.IsAttention = true;
        } else if (isattention === "F") { //  取消关注
          item.IsAttention = false;
        }
        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

        // “关注列表”---将关注的一条数据追加到关注列表中
        if (item.isNewStatus !== null && item.isNewStatus === true){
          $scope.allAttentionNotifyList.unshift(item);
        }else {
          $scope.allAttentionNotifyList.push(item);
        }

      }, function (err) {
        $ToastUtils.showToast("关注更改失败");
        if (isattention === "T") {
          item.IsAttention = false;
        } else if (isattention === "F") {
          item.IsAttention = true;
        }
        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

      })
    }

    // 点击“关注”列表页的关注图标调取的方式,即：取消关注
    $scope.cancelAttention = function (item) {
      var id = item.MsgId;
      var isattention = item.IsAttention  ? 'F' : 'T';
      $api.setNotifyMsg(id, false, "", isattention, function (suc) {
        // 取消关注
        item.IsAttention = false;

        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

        //  将取消关注的一条数据从关注列表中删除
        for(var i=0;i<$scope.allAttentionNotifyList.length;i++){
          if ($scope.allAttentionNotifyList[i].MsgId === id){
            var deleteIndex = i;
            $scope.allAttentionNotifyList.splice(i,1);
          }
        }

        // 修改全部通知列表数据源本条数据的关注状态
        for(var i=0;i<$scope.notifyNewList.length;i++){
          if ($scope.notifyNewList[i].MsgId === id){
            $scope.notifyNewList[i].IsAttention = false;
          }
        }


      }, function (err) {
        $ToastUtils.showToast("关注更改失败");
        if (isattention === "T") {
          item.IsAttention = false;
        } else if (isattention === "F") {
          item.IsAttention = true;
        }
        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);
      })
    };

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

    //根據附件帶的url點擊進入附件
    $scope.gonet = function (net) {

      $state.go('netconfirm', {
        url: net
      })
    };

    //上拉加载全部所有数据
    $scope.loadMoreNotify = function () {
      $pubionicloading.showloading('','正在加载...');
      $notify.allNotify();
    };

    //上拉加载关注更多数据
    $scope.loadAttentionMoreNotify = function () {
      $pubionicloading.showloading('','正在加载...');
      $notify.getAttentionNotify();
    };

    // 获取“关注通知列表”
    $scope.$on('attention.update', function (event) {

      $scope.$apply(function () {
        $pubionicloading.hide();
        var AttentionNotifyList = $notify.getAllAttentionNotify().msgList;
        var attentionTotal = $notify.getAllAttentionNotify().msgTotal;

        if(attentionTotal > 5){
          $scope.notifyAttentionStatus = true;
        }else{
          $scope.notifyAttentionStatus = false;
        }

        for(var i=0;i<AttentionNotifyList.length;i++){
          $scope.allAttentionNotifyList.push(AttentionNotifyList[i]);
        }

        // 函数调用，判断是否加小红点标识
        isNewStatus($scope.allAttentionNotifyList,$scope.noReadData);

      })
    });

    // 接收的新通知
    $scope.$on('allnotify.update', function (event,data) {

      console.log("加载更多的事件监听："+JSON.stringify(data));
      $scope.$apply(function () {
        $pubionicloading.hide();
        $scope.shownetstatus = false;
        if(data !== null && data !==undefined && data !== ''){
          // 将新接收的通知数据追加到列表数据源中
          $scope.notifyNewList.unshift(data);

          // 将新推送的通知的数据追加到未读数据中
          $scope.noReadData.push(data);
        }else{
          var notifyList= $notify.getAllNotify().msgList;
          var msgTotal = notifyList.length;

          console.log("else上拉加载更多拿到的数据："+ msgTotal);

          if (msgTotal >= 5 ) {
            $scope.notifyStatus = true;
          } else if (msgTotal < 5) {
            $scope.notifyStatus = false;
          }
          console.log("else状态：" + $scope.notifyStatus);

          for (var i = 0; i < notifyList.length; i++) {
            $scope.notifyNewList.push(notifyList[i]);
          }
        }

        // 函数调用，判断是否加小红点标识
        isNewStatus($scope.notifyNewList,$scope.noReadData);


        // 调插件获取 icon 对应的路径集合
        $greendao.loadAllData('QYYIconPathService',function (succ) {
          // 全部 -- 根据id，往数据源中追加图片路径字段信息
          isNewStatus($scope.notifyNewList,succ);

          // 关注 -- 根据id，往数据源中追加图片路径字段信息
          isNewStatus($scope.allAttentionNotifyList,succ);

          // 刷新页面
           $scope.$apply();

        },function (err) {

        });
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');

    });

    // 定义一个函数:根据未读通知的 msgId 判断通知是否加小红点标志 or 根据 id，往数据源中追加图片路径字段信息
    function isNewStatus(obj,targetObj) {

      for(var i=0;i<obj.length;i++){
        for( var j=0;j<targetObj.length;j++){
          if( targetObj[j].MsgId ){
            if( obj[i].MsgId === targetObj[j].MsgId){
              obj[i].isNewStatus = true; // 未读
            }else {
              continue;
            }
          }else if (targetObj[j].path){
            if ( obj[i].FromID   === targetObj[j].appId ) {
              obj[i].appIcon = targetObj[j].path;
            }else {
              continue;
            }
          }else {
            return;
          }
        }
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
      $notify.clearDefaultAttentionCount();
      $notify.allNotify();
      $notify.getAttentionNotify();
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
    };

    $scope.go = function (index) {
      $ionicSlideBoxDelegate.slide(index);
    };

    // 跳入详情
    $scope.goNotifyDetail = function (obj ) {
      if(obj.appIcon ){
        $state.go('notifyDetail', {
          obj: {
            "bean": obj
          }
        })
      }else {
        obj.appIcon = "img/notifyDefaultLogo.png";
        $state.go('notifyDetail', {
          obj: {
            "bean": obj
          }
        })
      }
    };

  })

  //跳转进入详情界面的展示
  .controller('notifyDetailCtrl', function ($scope, $stateParams, $ionicHistory, $greendao,$mqtt, $api, $timeout, $pubionicloading, $ToastUtils, $state, $ionicScrollDelegate, FinshedApp) {

    $scope.notifyObj = $stateParams.obj.bean;

    // var fromId = $scope.notifyObj.FromID;
    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {
        //只要进入通知详情界面，就将该条通知置为已读
        var newnotifyobj={};
        newnotifyobj.MsgId=$scope.notifyObj.MsgId;
        newnotifyobj.appId=$scope.notifyObj.FromID;
        newnotifyobj.isRead="1";
        newnotifyobj.appName=$scope.notifyObj.FromName;
        $greendao.saveObj('NewNotifyListService',newnotifyobj,function (succ) {
          $greendao.queryData('NewNotifyListService','where IS_READ =?',"0",function (data) {
            //拿到的未读数量展示在tab底部及桌面角标
            cordova.plugins.notification.badge.set(data.length,function (msg) {
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

    /**
     *暂时不要先注释
     * @param id
     * @param istop
     */
    // $scope.showlevel = $scope.notifyObj.Level;
    //
    // if ($scope.notifyObj.Level == 0) {
    //   $scope.levelName = "一般";
    // } else if ($scope.notifyObj.Level == 1) {
    //   $scope.levelName = "一般紧急";
    // } else if ($scope.notifyObj.Level == 2) {
    //   $scope.levelName = "非常紧急";
    // } else {
    //   $scope.levelName = "超级紧急";
    // }




    //通知置顶
    $scope.notifyTop = function (id, istop) {

      $api.setNotifyMsg(id, false, istop, "", function (suc) {

        if (istop === "T") {
          $scope.notifyObj.IsToped = true;


        } else if (istop === "F") {
          $scope.notifyObj.IsToped = false;

        }

        $timeout(function () {
          viewScroll.scrollTop();
        }, 100);

      }, function (err) {
        $ToastUtils.showToast("置顶更改失败");
        if (istop === "T") {
          $scope.notifyObj.IsToped = false;


        } else if (istop === "F") {
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
        if (isattention == "T") { // 添加关注
          $scope.notifyObj.IsAttention = true;

        } else if (isattention == "F") { //  取消关注
          $scope.notifyObj.IsAttention = false;
        }
        $timeout(function () {
          viewScroll.scrollTop();

        }, 100);

      }, function (err) {
        $ToastUtils.showToast("关注更改失败");
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
        "id": nihao
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







