
/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('newnotification.controllers', [])
  .controller('newnotificationCtrl', function ($scope,$ToastUtils, $state,$chatarr, $pubionicloading, $api, $timeout, $rootScope, $notify, $mqtt, $ionicScrollDelegate, $ionicSlideBoxDelegate,$greendao,NetData,NotifyApplicationData,$http,$formalurlapi,$stateParams) {

    // 获取
    $scope.applicationLists = [];           // 定义一个变量，接收调接口返回通知应用模块的的数据源
    $scope.showNum = 0;                     // 定义参数，标识要显示的模块
    $scope.notifyNewList = [];             // 全部通知列表数据源
    $scope.notifyNewListTest =[];
    $scope.allAttentionNotifyList = [];   //已关注的通知列表数据源
    $scope.newdex = 0;
    $scope.appstatus = false;             //滑块的状态
    $scope.noReadData = [];               // 未读的通知


    // 接收返回的标识模块的showNum字段
    if($stateParams.obj !== undefined && $stateParams.obj !==null&&$stateParams.obj !== ""){
      $scope.showNum = $stateParams.obj.showNum;
    }else {
      $scope.showNum =0;
    }

    angular.element(document).ready(function () {
      var notifyTabs = $(".bar .notifyTabs");

      for(var i=0;i<notifyTabs.length;i++){
        notifyTabs[i].classList.remove("on");
      }
      if (notifyTabs.length >3){
        notifyTabs[$scope.showNum+3].classList.add("on");
      }else {
        notifyTabs[$scope.showNum].classList.add("on");
      }
    });

    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    //接收消息调用方法
    $mqtt.arriveMsg('');

    //当进入页面以后执行的方法
    $scope.$on('$ionicView.enter', function () {
      $scope.shownetstatus = false;
      $ionicSlideBoxDelegate.enableSlide(false);
      $notify.clearDefaultCount(); // 数据初始化为加载第一页数据
      $notify.clearDefaultAttentionCount(); // 数据初始化为加载第一页数据

      // 重新加载数据
      $mqtt.getUserInfo(function (succ) {
        var userID = succ.userID;
        //获取人员所在部门，点亮图标
        $mqtt.getImcode(function (imcode) {
          var imCode = imcode;
          $notify.allNotifications(userID, imCode);
          $notify.getAttentionNotify(userID, imCode);
        });
      })
    });

    // tab点击后处理的事情
    $scope.tabClick = function ($event, value) {
      // 当前选中的tab
      $scope.showNum = value;
      var currentClickObj = $event.target; // 当前点击对象
      $(currentClickObj).css({
        "background":"#3F51B5",
        "color":"#fff"
      }).siblings().css({
        "background":"#fff",
        "color":"#3F51B5"
      });
    };

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

    // 全部通知的置顶操作
    $scope.goIsTopEvent2 = function (item) {
        var userID;
        var imCode;
        $mqtt.getUserInfo(function (succ) {
          userID = succ.userID;
          $mqtt.getImcode(function (imcode) {
            imCode = imcode;
            setExtMsg(userID,imCode,item,0);
          })
        })
    };

    // 关注通知的置顶操作
    $scope.goIsTopEvent = function (item) {
      var userID;
      var imCode;
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;
          setExtMsg(userID,imCode,item,0);
        })
      })
    };

    // 点击置顶之后要处理的事情
    function setExtMsg(userID,imCode,obj,num) {
      var id = obj.msgId;
      var state;
      var param ={};
      if (num===0){ // 置顶操作
        state = obj.isToped ? false : true;
        param = {Action: "SetExtMsg", id: userID, mepId: imCode, setToped: state, msgId: id};
      }else if(num===1){ // 关注操作
        state = obj.isAttention ? false : true;
        param = {Action: "SetExtMsg", id: userID, mepId: imCode, setAttention: state, msgId: id};
      }

      $http({
        method: 'post',
        timeout: 5000,
        url: $formalurlapi.getBaseUrl(),
        data: param
      }).success(function (data, status) {
        // 将置顶和关注状态和后台后刷新页面
        $state.go('tab.notification',{},{reload:true});

      }).error(function (data, status, err) {

      });
    }

    $scope.goIsAttentionEvent2 = function (item) {
      var userID;
      var imCode;
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;
          setExtMsg(userID,imCode,item,1);
        })
      })
    };

    // 取消关注操作。点击“关注”列表页的关注图标调取的方式,即：取消关注
    $scope.cancelAttention = function (item) {
      // 取消关注并和后台进行交互
      $mqtt.getUserInfo(function (succ) {
        var userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          var imCode = imcode;
          setExtMsg(userID,imCode,item,1);
        })
      });

      // 将取消关注的数据从数据源中删除
        for(var i=0;i<$scope.allAttentionNotifyList.length;i++){
          if ($scope.allAttentionNotifyList[i].msgId === item.msgId){
            $scope.allAttentionNotifyList.splice(i,1);
          }else {
            continue;
          }
        }
    };

    // 网络状态
    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        $rootScope.isConnect = $rootScope.netStatus;
      })
    });

    $scope.$on("allNotifications.update.error", function () {
      $scope.$apply(function () {
        $scope.shownetstatus = true;
      })
    })

    //消息模块消息监听
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

    //根据附件带的url点击进入附件
    $scope.gonet = function (net) {
      $state.go('netconfirm', {
        url: net
      })
    };

    // 上拉加载更多-全部通知
    $scope.loadMoreNotify2 = function () {
      $pubionicloading.showloading('','正在加载...');
      var userID; // userID = 232102
      var imCode; //  imCode = 860982030647083
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        //获取人员所在部门，点亮图标
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;
          $notify.allNotifications(userID, imCode);
        })
      })
    };

    //上拉加载关注更多数据
    $scope.loadAttentionMoreNotify = function () {

      $pubionicloading.showloading('','正在加载...');
      var userID; // userID = 232102
      var imCode; //  imCode = 860982030647083
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        //获取人员所在部门，点亮图标
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;
          $notify.getAttentionNotify(userID, imCode);
        })
      })
    };

    // 获取关注列表数据源
    $scope.$on('attention.update', function (event) {
        $pubionicloading.hide();
        var attentionNotifyList = $notify.getAllAttentionNotify();
        var attentionNotifyListLength = attentionNotifyList.length;

        if(attentionNotifyListLength >= 5){
          $scope.notifyAttentionStatus = true;
        }else{
          $scope.notifyAttentionStatus = false;
        }

        for(var i=0;i<attentionNotifyList.length;i++){
          attentionNotifyList[i].showNum =1; // 自定义一个，作为返回标识用
          $scope.allAttentionNotifyList.push(attentionNotifyList[i]);
        }

        // 函数调用，判断是否加小红点标识
      isNewStatus2($scope.allAttentionNotifyList,$scope.noReadData);

      // 调插件获取 icon 对应的路径集合
      $greendao.loadAllData('QYYIconPathService',function (succ) {

        isNewStatus2($scope.allAttentionNotifyList,succ);  // 全部 -- 根据id，往数据源中追加图片路径字段信息
        applicationsE(succ);  // 函数调用，通知应用

      },function (err) {

      });

      // 添加监听事件，滚动完成
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });

    //  全部通知数据加载时（包括：进入+加载更多）
    $scope.$on('allNotifications.update', function (event, data) {
      $pubionicloading.hide();
      if(data !== null && data !==undefined && data !== ''){
        // 将mqtt推送的新通知添加未读标识，并追加到列表数据源中，
        data.isNewStatus = true;
        data.showNum = 0; // 自定义一个字段，详情返回标识用
        $scope.notifyNewListTest.unshift(data);

        // 将新推送的通知的数据追加到未读数据中
        $scope.noReadData.push(data);

      }else{
        var notifyList = $notify.getAllNotifications(); // 获取应用列表数据源
        var msgTotal = notifyList.length;
        if (msgTotal >= 5 ) {
          $scope.notifyStatus2 = true;
        } else {
          $scope.notifyStatus2 = false;
        }

        for (var i = 0; i < notifyList.length; i++) {
          notifyList[i].showNum = 0; // 自定义一个字段，详情返回标识用
          $scope.notifyNewListTest.push(notifyList[i]);
        }
      }

      // 函数调用，判断是否加小红点标识
      isNewStatus2($scope.notifyNewListTest,$scope.noReadData);

      // 调插件获取 icon 对应的路径集合
      $greendao.loadAllData('QYYIconPathService',function (succ) {

        isNewStatus2($scope.notifyNewListTest,succ);  // 全部 -- 根据id，往数据源中追加图片路径字段信息
        applicationsE(succ);  // 函数调用，通知应用

      },function (err) {

      });

      $scope.$broadcast('scroll.infiniteScrollComplete');

    });

    // 定义一个函数:根据未读通知的 msgId 判断通知是否加小红点标志 or 根据 id，往数据源中追加图片路径字段信息
    function isNewStatus2(obj,targetObj) {
      for(var i=0;i<obj.length;i++){
        for( var j=0;j<targetObj.length;j++){
          if( targetObj[j].MsgId ){
            if( obj[i].msgId === targetObj[j].MsgId){
              obj[i].isNewStatus = true; // 未读标识状态
            }else {
              continue;
            }
          }else if (targetObj[j].path){ // 追加通知logo
            if ( obj[i].from   === targetObj[j].appId ) {
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
    // $scope.go = function (index) {
    //   $ionicSlideBoxDelegate.slide(index);
    // };

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

    // 获取通知应用列表数据
    function applicationsE(notifyIdAppIcons) {
      var userID;
      var imCode;
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        //获取人员所在部门，点亮图标
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;
          // 调用接口拿到后台数据
          NotifyApplicationData.getListInfo(userID,imCode);
          $scope.$on('succeed.update', function (event) {
            $pubionicloading.hide();



            $scope.applicationLists = NotifyApplicationData.getApplicationList(); // 获取应用列表数据源
            addPathToData(notifyIdAppIcons, $scope.applicationLists); // 往应用列表数据源中追加 logo 路径字段
            //  用应用列表数据 appName 查询该条应用下有多少条未读通知，并给个有未读通知状态标识
            for(var i=0;i<$scope.applicationLists.length;i++){
              var appName = $scope.applicationLists[i].appName;
              var noReadCount = 0; // 各个应用下的未读通知数
              for(var j=0;j<$scope.noReadData.length;j++){
                if($scope.noReadData[j].appName === appName){
                  noReadCount++;
                }else {
                  continue;
                }
              }
              $scope.applicationLists[i].noReadCount = noReadCount;
              $scope.applicationLists[i].showNum = 2;
            }

          });
        })
      });
    }


    // 往数据源中追加 logo字段
    function addPathToData(notifyIdAppIcons,target) {
      var l1 = notifyIdAppIcons.length;
      var l2 = target.length;

      // 往通知应用数据源中追加应用logo路径字段，转换时间格式
      if( l1>0&&l2>0 ){
        for(var i=0;i<l2;i++){
          var appId = target[i].appId;
          var whenStr =new Date( target[i].when );
          target[i].when = (whenStr.getMonth() +1)+"-"+whenStr.getDate()+" "+  whenStr.getHours()+":"+whenStr.getMinutes();

          for(var j=0;j< l1;j++){
            if ( appId===notifyIdAppIcons[j].appId ){
              target[i].appIcon=notifyIdAppIcons[j].path;
            }else {
              continue;
            }
          }
        }
      }
    }

    // 跳转页面
    $scope.goApplicationDetail = function (obj) {
      $state.go("applicationDetail",{
        obj:obj
      })
    };


  })

  //跳转进入详情界面的展示
  .controller('notifyDetailCtrl', function ($scope, $stateParams, $ionicHistory, $greendao,$mqtt, $api, $timeout, $pubionicloading, $ToastUtils, $state, $ionicScrollDelegate,$http,$formalurlapi) {

    $scope.notifyObj = $stateParams.obj.bean;
    $scope.showNum = $stateParams.obj.bean.showNum;

    $scope.$on('$ionicView.enter', function () {
      $timeout(function () {
        //只要进入通知详情界面，就将该条通知置为已读
        var newnotifyobj={};
        newnotifyobj.MsgId=$scope.notifyObj.msgId;
        newnotifyobj.appId=$scope.notifyObj.from;
        newnotifyobj.isRead="1";
        newnotifyobj.appName=$scope.notifyObj.fromName;
        $greendao.saveObj('NewNotifyListService',newnotifyobj,function (succ) {
          $greendao.queryData('NewNotifyListService','where IS_READ =?',"0",function (data) {
            //拿到的未读数量展示在tab底部及桌面角标
            cordova.plugins.notification.badge.set(data.length,function (msg) {
              $mqtt.saveInt('badgeNotifyCount',data.length);
            },function (err) {
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
     function NotifyDetailSetExtMsg(userID,imCode,msgId,isState,num) {
      var param ={};
      if (num===0){ // 置顶操作
        param = {
          Action: "SetExtMsg",
          id: userID,
          mepId: imCode,
          setToped: isState,
          msgId: msgId
        };
      }else if(num===1){ // 关注操作
        param = {
          Action: "SetExtMsg",
          id: userID,
          mepId: imCode,
          setAttention: isState,
          msgId: msgId
        };
      }

      $http({
        method: 'post',
        timeout: 5000,
        url: $formalurlapi.getBaseUrl(),
        data: param
      }).success(function (data, status) {
        // 将置顶和关注状态和后台后刷新页面
        console.log("切换按钮数据交互成功？");
      }).error(function (data, status, err) {
        console.log("切换按钮数据交互失败");
      });
    }

    function ChangeState(notifyObj,num) {
      // 修改当前置顶状态
      if(num===0){
        notifyObj.isToped = notifyObj.isToped?false:true;
      }else if(num===1){
        notifyObj.isAttention = notifyObj.isAttention?false:true;
      }

      // 置顶和关注和后台交互
      var userID;
      var imCode;
      var isState;
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;

          if(num===0){
            isState =notifyObj.isToped;
          }else if(num===1){
            isState =notifyObj.isAttention;
          }
          NotifyDetailSetExtMsg(userID,imCode,notifyObj.msgId,isState,num);
        })
      })
    }


    $scope.notifyTop = function (notifyObj,num) {
      ChangeState(notifyObj,num);
    };

    // 添加关注
    $scope.notifyFocus = function (notifyObj,num) {
      ChangeState(notifyObj,num);
    };

    // 详情确认
    $scope.confirmDetail = function (id) {
      $pubionicloading.showloading('', '正在加载...');

      //调用接口确认回复详情
      $timeout(function () {
        $api.setNotifyMsg(id, true, "", "", function (suc) {
          $pubionicloading.hide();
          $scope.notifyObj.isRead = true;

          $timeout(function () {
            viewScroll.scrollTop();
          }, 100);

        }, function (err) {
          $pubionicloading.hide();
          $ToastUtils.showToast("确认失败")
        })
      })
    };

    $scope.openconfirm = function (obj) {

      console.log("查看确认详情：" + JSON.stringify(obj));
      $state.go("confirmornot", {
        obj: obj
      })
    };

    $scope.gonetdetail = function (net) {
      $state.go('netconfirm', {
        url: net
      })
    };

    $scope.backNotify = function (notifyObj) {

      if ($scope.showNum !== 2) {
        $state.go("tab.notification",{
          obj:notifyObj
        })
      }else {

        $state.go('applicationDetail', {
          obj: notifyObj
        })
      }
    }
  })

  // 通知应用列表详情
  .controller('applicationDetailCtrl', function ($scope,$state,$ionicHistory,$stateParams,$ionicSlideBoxDelegate, $mqtt,NotifyApplicationData,$pubionicloading,$greendao) {

    var fromId = $stateParams.obj.appId?$stateParams.obj.appId:$stateParams.obj.from; // 接收上级id
    $scope.appName = $stateParams.obj.appName?$stateParams.obj.appName:$stateParams.obj.fromName;  // 接收应用名称
    $scope.appIcon = $stateParams.obj.appIcon;  // 接收应用 logo 对应的本地路径
    $scope.showNum = $stateParams.obj.showNum;  // 显示模块标识：0：全，1：关注，2：通知应用
    $scope.applicationChild =[];                // 存放请求回来的应用列表数据
    $scope.loadMoreApplication = false; // 是否加载更过
    $scope.noReadData = [];
    var targetObj={};

    //当进入页面以后执行的方法
    $scope.$on('$ionicView.enter', function () {

      $ionicSlideBoxDelegate.enableSlide(false);
      NotifyApplicationData.clearDefaultCount();// 数据初始化为加载第一页数据
      // 重新加载数据
      $mqtt.getUserInfo(function (succ) {
        var userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          var imCode = imcode;
          NotifyApplicationData.getApplicationChildE(userID, imCode, fromId);
        });
      })
    });

    // 进来通知界面就统计数据库通知的未读数量
    $greendao.queryData('NewNotifyListService','where IS_READ =?',"0",function (data) {
      $scope.noReadData = data;
    },function (err) {

    });

    $scope.$on('getApplicationChildE.succeed.update', function (event) {
      $pubionicloading.hide();

      var applicationList = NotifyApplicationData.applicationChild(); // 获取应用列表数据源

      applicationList.forEach(function (item) {
        // 修改时间格式
        var whenStr =new Date(item.when);
        item.when = (whenStr.getMonth() +1)+"-"+whenStr.getDate()+" "+  whenStr.getHours()+":"+whenStr.getMinutes();

        // 追加logo地址
        item.appIcon =  $scope.appIcon;

        // 追加显示模块标志数字2字段
        item.showNum = 2;
      });

      if ($scope.noReadData.length>0){
        for (var i=0;i<$scope.noReadData.length;i++){
          var MsgId = $scope.noReadData[i].MsgId;
          for (var j=0;j<applicationList.length;j++){
            if (MsgId === applicationList[j].msgId){
              applicationList[j].isNewNotify = true;
            }else {
               continue;
            }
          }
        }
      }else {
        applicationList = applicationList;
      }

      // 根据请求回来的数据的个数，判断是否加载更多操作，>=5时，加载更多，反之，取消加载更多操作。
      if (applicationList.length >= 5 ) {
        $scope.loadMoreApplication = true;
      } else {
        $scope.loadMoreApplication = false;
      }


      for (var i = 0; i < applicationList.length; i++) {
        $scope.applicationChild.push(applicationList[i]);
      }

      targetObj = {
        "showNum" :applicationList[0].showNum,
        "appId":applicationList[0].appId,
        "appIcon":applicationList[0].appIcon,
        "appName":applicationList[0].appName
      };

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });

    $scope.goDetail = function (obj ) {
      $state.go('notifyDetail', {
        obj: {
          "bean": obj
        }
      })
    };

    // 上拉加载更多
    $scope.loadMoreApplicationEvent = function () {
      $pubionicloading.showloading('','正在加载...');
      var userID;
      var imCode;
      $mqtt.getUserInfo(function (succ) {
        userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          imCode = imcode;
          NotifyApplicationData.getApplicationChildE(userID, imCode, fromId);
        })
      })
    };

    // 返回操作调取的方法
    $scope.backApp = function () {
      $state.go("tab.notification",{obj:targetObj});
    }

  })

  .controller('confirmornotCtrl', function ($scope,$state, $stateParams, $api, $ToastUtils, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, $ionicHistory,$http,$formalurlapi,$rootScope,$mqtt,NotifyApplicationData,$pubionicloading) {

    console.log("点击查看确认详情传递的数据：" + $stateParams.obj);
    $scope.obj = $stateParams.obj;
    $scope.msgid = $stateParams.obj.msgId;


    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');

    $scope.index = 0;

    $scope.$on('$ionicView.enter', function () {
      $ionicSlideBoxDelegate.enableSlide(false);

      $mqtt.getUserInfo(function (succ) {
        var userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          var imCode = imcode;
          NotifyApplicationData.getMsgReadListE(userID, imCode, $scope.msgid,false);
          $scope.$on('getMsgReadListE.succeed.update', function (event) {
            $pubionicloading.hide();
            $scope.noNotifyUser = NotifyApplicationData.getMsgReadList();
          });
        });
      })
    });

    // tab切换
    $scope.goConfirm = function (index) {
      $ionicSlideBoxDelegate.slide(index);
    };

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
    };


    $scope.alreadyNofiy = function () {

      $mqtt.getUserInfo(function (succ) {
        var userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          var imCode = imcode;
          NotifyApplicationData.getMsgReadListE(userID, imCode, $scope.msgid,true);

          $scope.$on('getMsgReadListE.succeed.update', function (event) {
            $pubionicloading.hide();
            $scope.alreadyUser = NotifyApplicationData.getMsgReadList();
          });

        });
      })
    };

    $scope.noNotify = function () {

      $mqtt.getUserInfo(function (succ) {
        var userID = succ.userID;
        $mqtt.getImcode(function (imcode) {
          var imCode = imcode;
          NotifyApplicationData.getMsgReadListE(userID, imCode, $scope.msgid,false);
          $scope.$on('getMsgReadListE.succeed.update', function (event) {
            $pubionicloading.hide();
            $scope.noNotifyUser = NotifyApplicationData.getMsgReadList();
          });
        });
      })
    };

    $scope.backAny = function (obj) {
      // $ionicHistory.goBack();//
      $state.go('notifyDetail', {
        obj: {
          "bean": obj
        }
      })
    };
  })
  .controller('netconfirmCtrl', function ($scope, $stateParams, $sce) {
    $scope.neturl = $sce.trustAsResourceUrl($stateParams.url);

  })







