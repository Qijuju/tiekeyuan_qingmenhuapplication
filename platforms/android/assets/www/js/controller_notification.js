/**
 * Created by Administrator on 2016/9/8.
 */
angular.module('notification.controllers', ['ionic', 'ionic-datepicker'])
  .controller('notificationsCtrl', function ($scope,$state,$ToastUtils,$ionicSlideBoxDelegate,ionicDatePicker,$mqtt,$greendao,$notifyarr,$rootScope,$slowarr) {
    $scope.index = 0;
    $scope.go = function(index){
      $ionicSlideBoxDelegate.slide(index);
    }
    $scope.go_changed=function(index){
      //第一个页面index=0,第二个页面index=0，第三个页面index=0
      if (index==1){//当选择第二个页面也就是时间页面的时候调用时间选择器
        $scope.index =1;
        $scope.openDatePicker();
        document.getElementById("button1").style.backgroundColor="#ffffff";
        document.getElementById("button2").style.backgroundColor="#6c9aff";
        document.getElementById("button3").style.backgroundColor="#ffffff"
      }
      if(index==0){
        $scope.index =0;
        document.getElementById("button1").style.backgroundColor="#6c9aff";
        document.getElementById("button2").style.backgroundColor="#ffffff";
        document.getElementById("button3").style.backgroundColor="#ffffff"
      }
      if(index==2){
        $scope.index =2;
        document.getElementById("button1").style.backgroundColor="#ffffff";
        document.getElementById("button2").style.backgroundColor="#ffffff";
        document.getElementById("button3").style.backgroundColor="#6c9aff"
      }
    }
    $scope.timeaa = "";
   //日期选择器
    var ipObj1 = {
      callback: function (val) {  //Mandatory
       // alert(val)//点击set返回的日期 1439676000000这个格式的
        //根据时间划分
        $greendao.queryDataByDate(val,'Level_1',function (data) {
          // alert("紧急通知列表的长度"+data.length);
          $notifyarr.setNotifyData(data);
          $scope.fastlist=$notifyarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });

        /**
         * 没有未读时从数据库取数据（一般通知）
         */
        $greendao.querySlowDataByDate(val,'Common',function (data) {
          // alert("一般通知列表的长度"+data.length);
          $slowarr.setNotifyData(data);
          $scope.slowlist=$slowarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });
        $scope.timeaa=val;
        $scope.go(0);
      },
      disabledDates: [            //不可点击日期
      ],
      from: new Date(2012, 1, 1), //日期的范围从什么什么时候开始
      to: new Date(), //日期的范围从什么什么时候结束
      inputDate: new Date(),      //当前选中日期
      mondayFirst: false,          //周一是第一天？
      // disableWeekdays: [0],       //每个星期不可点击的某个星期几【0】代表周日
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
      //根据紧急程度划分
      $greendao.queryData('NotifyListService','where CHAT_TYPE =? ','Level_1',function (data) {
        // alert("紧急通知列表的长度"+data.length);
        $notifyarr.setNotifyData(data);
        $scope.fastlist=$notifyarr.getAllNotifyData();
      },function (err) {
        $ToastUtils.showToast("查询系统通知列表"+err);
      });

      /**
       * 没有未读时从数据库取数据（一般通知）
       */
      $greendao.queryData('SlowNotifyListService','where CHAT_TYPE =? ','Common',function (data) {
        // alert("一般通知列表的长度"+data.length);
        $slowarr.setNotifyData(data);
        $scope.slowlist=$slowarr.getAllNotifyData();
      },function (err) {
        $ToastUtils.showToast("查询系统通知列表"+err);
      });

      /**
       * 根据应用划分
       */
      $greendao.loadAllData('ModuleCountService',function (data) {
        // alert("模块应用列表的长度"+data.length);
        $scope.applist=data;
      },function (err) {

      });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    //从数据库取当前应用的count值
    $scope.sendAPPCount=function (id) {
      switch (id){
        case '1':
          // alert("进来了");
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("公文处理紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("公文处理一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.oacount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setOaCount($scope.oacount);
              // alert("0000000公文处理count"+$scope.oacount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '15':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("拌合站紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("拌合站一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.bhzcount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setBhzCount($scope.bhzcount);
              // alert("拌合站count"+$scope.bhzcount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '16':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("试验室紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("试验室一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.sycount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setSyCount($scope.sycount);
              // alert("试验室count"+$scope.sycount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '17':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("沉降观测紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("沉降观测一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.cjgccount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setCjgcCount($scope.cjgccount);
              // alert("沉降观测count"+$scope.cjgccount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {

            });
          },function (err) {
          });
          break;
      }
    }


    //先监听未读通知消息
    $scope.$on('newnotify.update', function (event) {
      $scope.$apply(function () {
        $scope.fastcount=$mqtt.getFastcount();
        $scope.slowcount=$mqtt.getSlowcount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.fastcount >0 && $scope.type === 'Level_1'){
          // alert("收到紧急系统通知并且保存成功"+$scope.fastcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('NotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有系统通知会话");
              $notifyarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $notifyarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('notifyarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.fastlist=$notifyarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.fastlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            $scope.daytype=data[0].daytype;
            $scope.isSuccess=data[0].isSuccess;
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('NotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.fastcount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              chatitem.isSuccess=$scope.isSuccess;
              chatitem.daytype=$scope.daytype;
              $greendao.saveObj('NotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $notifyarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastfastcount.update');
                $scope.sendAPPCount($scope.id);
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        }else if($scope.slowcount >0 && $scope.type === 'Common'){
          // alert("收到一般系统通知并且保存成功"+$scope.slowcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('SlowNotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有一般通知会话");
              $slowarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $slowarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('slowarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.slowlist=$slowarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.slowlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("yiban未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            $scope.daytype=data[0].daytype;
            $scope.isSuccess=data[0].isSuccess;
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('SlowNotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.slowcount;
             // alert("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              chatitem.isSuccess=$scope.isSuccess;
              chatitem.daytype=$scope.daytype;
              $greendao.saveObj('SlowNotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $slowarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastslowcount.update');
                $scope.sendAPPCount($scope.id);
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        }
        //滑动到底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    })


    /**
     * 通知最后一条信息展示完成以后在列表界面进行刷新
     */
    $scope.$on('lastfastcount.update', function (event) {
      $scope.$apply(function () {
        // alert("进来数据刷新");
        $scope.fastlist=$notifyarr.getAllNotifyData();

      });

    });

    /**
     * 通知最后一条信息展示完成以后在列表界面进行刷新
     */
    $scope.$on('lastslowcount.update', function (event) {
      $scope.$apply(function () {
        // alert("一般进来数据刷新");
        $scope.slowlist=$slowarr.getAllNotifyData();
      });

    });

    /**
     * 更新应用名称表===通知主界面
     */
    $scope.publicNotifyModuleCount=function (id,unread) {
      // alert("进来展示框了吗"+id+unread);
      $greendao.queryData('ModuleCountService','where id =?','1',function (data) {
        var appitem={};
        $scope.getCount=function (id) {
          if(id === '1'){
            appitem.count1=unread;
          }else if (id === '15'){
            appitem.count2=unread;
          }else if(id === '16'){
            appitem.count3=unread;
          }else if(id === '17'){
            appitem.count4=unread;
          }
        }
        if(data.length ===0){
          appitem.id='1';
          appitem.name=$scope.alarmname;
          appitem.count2='0';
          appitem.count3='0';
          appitem.count1='0';
          appitem.count4='0';
          $scope.getCount(id);
          appitem.type=$scope.type;
        }else{
          appitem.id='1';
          appitem.count1=data[0].count1;
          appitem.count2=data[0].count2;
          appitem.count3=data[0].count3;
          appitem.count4=data[0].count4;
          $scope.getCount(id);
          // alert("测试改变后的count值"+appitem.count1+appitem.count2+appitem.count3+appitem.count4);
          appitem.name=data[0].name;
          appitem.type=data[0].type;
        }
        $greendao.saveObj('ModuleCountService',appitem,function (data) {
          $rootScope.$broadcast('newAPP.update');
        },function (err) {

        });
      },function (err) {

      });
    }


    /**
     * 应用模块数据监听
     */
    $scope.$on('appnotify.update',function (event) {
      // alert("进来新的监听啦啥地方");
      $scope.$apply(function () {
        // alert("进来新的监听啦");
        $scope.oacount=$mqtt.getOaCount();
        $scope.bhzcount=$mqtt.getBhzCount();
        $scope.sycount=$mqtt.getSyCount();
        $scope.cjgccount=$mqtt.getCjgcCount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.oacount >0 && $scope.id === '1'){
          // alert("公文处理通知数量》0");
          $scope.unread=$scope.oacount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }else if($scope.bhzcount>0 && $scope.id === '15'){
          // alert("拌合站通知数量》0");
          $scope.unread=$scope.bhzcount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }else if($scope.sycount>0 && $scope.id === '16'){
          // alert("试验室通知数量》0");
          $scope.unread=$scope.sycount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }else if($scope.cjgccount>0 && $scope.id === '17'){
          // alert("沉降观测通知数量》0");
          $scope.unread=$scope.cjgccount;
          $scope.publicNotifyModuleCount($scope.id,$scope.unread);
        }
      });
    });

    /**
     * 应用模块数据改变后实现监听
     **/
    $scope.$on('newAPP.update', function (event) {
      $scope.$apply(function () {
        // alert("一般进来数据刷新");
        $greendao.loadAllData('ModuleCountService',function (data) {
          // alert("模块应用列表的长度"+data.length);
          $scope.applist=data;
        },function (err) {

        });
      });

    });

    //紧急通知进详情
    $scope.gonewDetail = function (id,chatName,chatType) {
      $state.go("notificationDetail",{
        "id":id,
        "name":chatName,
        "type":chatType
      });
    }

    //一般通知进详情
    $scope.gocommonDetail = function (id,chatName,chatType) {
      // alert("一般进了吗？");
      $state.go("notificationDetail",{
        "id":id,
        "name":chatName,
        "type":chatType
      });
    }

      /**
       * 应用模块点击应用图标跳转程度模块展示数据
       */
    $scope.gotozero=function (id) {
      switch (id){
        case '1':
          // alert("jinlai跳转");
          $scope.isOaNotified='true';
          $scope.pubilcChoice();
          break;
        case '15':
          $scope.isBhzNotified='true';
          $scope.pubilcChoice();
          break;
        case '16':
          $scope.isSyNotified='true';
          $scope.pubilcChoice();
          break;
        case '17':
          $scope.isCjgcNotified='true';
          $scope.pubilcChoice();
          break;
      }
    }

    $scope.pubilcChoice=function () {
      /**
       * 根据应用id查询通知列表
       */
      $scope.queryById=function (id) {
        // alert("进来查询了吗");
        switch (id){
          case '1':
            $mqtt.clearOaCount();
            $scope.count=$mqtt.getOaCount();
            $scope.publicNotifyModuleCount('1',$scope.count);
            break;
          case '15':
            $mqtt.clearBhzCount();
            $scope.count=$mqtt.getBhzCount();
            $scope.publicNotifyModuleCount('15',$scope.count);
            break;
          case '16':
            $mqtt.clearSyCount();
            $scope.count=$mqtt.getSyCount();
            $scope.publicNotifyModuleCount('16',$scope.count);
            break;
          case '17':
            $mqtt.clearCjgcCount();
            $scope.count=$mqtt.getCjgcCount();
            $scope.publicNotifyModuleCount('17',$scope.count);
            break;
        }
        $scope.go(0);
        //根据紧急程度划分
        $greendao.queryData('NotifyListService','where id =? ',id,function (data) {
          // alert("紧急通知列表的长度"+data.length);
          $notifyarr.setNotifyData(data);
          $scope.fastlist=$notifyarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });

        /**
         * 没有未读时从数据库取数据（一般通知）
         */
        $greendao.queryData('SlowNotifyListService','where id =? ',id,function (data) {
          // alert("一般通知列表的长度"+data.length);
          $slowarr.setNotifyData(data);
          $scope.slowlist=$slowarr.getAllNotifyData();
        },function (err) {
          $ToastUtils.showToast("查询系统通知列表"+err);
        });
      }


      if($scope.isOaNotified === 'true'){
        // alert("进来公共方法");
        $scope.queryid='1';
        $scope.queryById($scope.queryid);
        $scope.isOaNotified = 'false';
      }else if($scope.isBhzNotified==='true'){
        $scope.queryid='15';
        $scope.queryById($scope.queryid);
        $scope.isBhzNotified='false';
        // $scope.go(0);
      }else if($scope.isSyNotified==='true'){
        $scope.queryid='16';
        $scope.queryById($scope.queryid);
        $scope.isSyNotified='false';
        // $scope.go(0);
      }else if($scope.isCjgcNotified==='true'){
        $scope.queryid='17';
        $scope.queryById($scope.queryid);
        $scope.isCjgcNotified='false';
        // $scope.go(0);
      }
    }
  })

  //单个系统通知详情界面控制器
  .controller('newnotificationDetailCtrl', function ($scope,$state,$greendao,$mqtt,$notifyarr,$rootScope,$stateParams,$ToastUtils,$timeout,$slowarr) {
    /**
     * 从通知会话列表跳转带参
     */
    $scope.id=$stateParams.id;
    $scope.chatName=$stateParams.name;
    $scope.chatType=$stateParams.type;
    // alert("跳转界面"+$scope.id+$scope.chatName+$scope.chatType);

    if($scope.chatType === 'Common'){

    }else if($scope.chatType === 'Level_1'){

    }
    $greendao.queryNewNotifyChat($scope.chatType,$scope.id,function (data) {
      // alert("进来通知详情界面"+data.length);
      $scope.sysmsglist=data;
    },function (err) {
      $ToastUtils.showToast(err+"查询报警信息失败");
    });

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    //从数据库取当前应用的count值
    $scope.sendAPPDetailCount=function (id) {
      switch (id){
        case '1':
          // alert("进来了");
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("公文处理紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("公文处理一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.oacount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setOaCount($scope.oacount);
              // alert("0000000公文处理count"+$scope.oacount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '15':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("拌合站紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("拌合站一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.bhzcount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setBhzCount($scope.bhzcount);
              // alert("拌合站count"+$scope.bhzcount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '16':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("试验室紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("试验室一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.sycount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setSyCount($scope.sycount);
              // alert("试验室count"+$scope.sycount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
        case '17':
          $greendao.queryData('NotifyListService', 'where id=?',$scope.id,function (data) {
            if(data.length>0){
              $scope.fastcount=data[0].count;
              // alert("沉降观测紧急count随机测试紧急"+$scope.fastcount);
            }else{
              $scope.fastcount =0;
            }
            $greendao.queryData('SlowNotifyListService', 'where id=?',$scope.id,function (data) {
              if(data.length>0){
                $scope.slowcount=data[0].count;
                // alert("沉降观测一般count随机测试一般"+$scope.slowcount);
              }else{
                $scope.slowcount =0;
              }
              $scope.cjgccount=parseInt($scope.fastcount)+parseInt($scope.slowcount);
              $mqtt.setCjgcCount($scope.cjgccount);
              // alert("沉降观测count"+$scope.cjgccount);
              $rootScope.$broadcast('appnotify.update');
            },function (err) {
            });
          },function (err) {
          });
          break;
      }
    }



    //先监听未读通知消息
    $scope.$on('newnotify.update', function (event) {
      $scope.$apply(function () {
        $scope.fastcount=$mqtt.getFastcount();
        $scope.slowcount=$mqtt.getSlowcount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.fastcount >0  && $scope.type === 'Level_1' ){
          // alert("收到紧急系统通知并且保存成功"+$scope.fastcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('NotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有系统通知会话");
              $notifyarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $notifyarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('notifyarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.fastlist=$notifyarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.fastlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            $scope.daytype=data[0].daytype;
            $scope.isSuccess=data[0].isSuccess;
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('NotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.fastcount;
              // $ToastUtils.showToast("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              chatitem.isSuccess=$scope.isSuccess;
              chatitem.daytype=$scope.daytype;
              $greendao.saveObj('NotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $notifyarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastfastcount.update');
                $scope.sendAPPDetailCount($scope.id);
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        }else if($scope.slowcount >0  && $scope.type === 'Common' ){
          // alert("收到一般系统通知并且保存成功"+$scope.slowcount+"消息类型"+$scope.type+$scope.id);
          $greendao.queryData('SlowNotifyListService','where id =?',$scope.id,function (data) {
            // alert("系统通知会话列表长度"+data.length);
            if(data.length === 0){
              // alert("没有一般通知会话");
              $slowarr.getNotifyIdChatName($scope.id, $scope.alarmname);
              $rootScope.isNotifySend ='true';
              if($rootScope.isNotifySend === 'true'){
                // alert("进入创建会话段");
                $slowarr.createNotifyData($rootScope.isNotifySend, $scope.type);
                $scope.$on('slowarr.update', function (event) {
                  $scope.$apply(function () {
                    $scope.slowlist=$slowarr.getAllNotifyData();
                    // alert("监听以后的长度"+$scope.slowlist.length);
                  });
                });
                $rootScope.isNotifySend = 'false';
              }
            }
          },function (err) {

          });

          //取出与‘ppp’的聊天记录最后一条
          $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1', $scope.id, function (data) {
            // alert("yiban未读消息时取出消息表中最后一条数据"+data.length);
            $scope.lastText = data[0].message;//最后一条消息内容
            // alert("最后一条消息"+$scope.lastText);
            $scope.lastDate = data[0].when;//最后一条消息的时间id
            $scope.srcName = data[0].username;//消息来源人名字
            $scope.srcId = data[0].senderid;//消息来源人id
            // alert($scope.srcName + "用户名1"+$scope.srcId);
            $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
            $scope.msglevel=data[0].msglevel;//紧急程度
            $scope.daytype=data[0].daytype;
            $scope.isSuccess=data[0].isSuccess;
            //取出‘ppp’聊天对话的列表数据并进行数据库更新
            $greendao.queryData('SlowNotifyListService', 'where id=?', $scope.id, function (data) {
              $scope.unread = $scope.slowcount;
              // alert("未读消息时取出消息表中最后一条数据" + data.length + $scope.unread);
              var chatitem = {};
              chatitem.id = data[0].id;
              chatitem.chatName = data[0].chatName;
              chatitem.imgSrc = $scope.imgSrc;
              chatitem.lastText = $scope.lastText;
              chatitem.count = $scope.unread;
              chatitem.isDelete = data[0].isDelete;
              chatitem.lastDate = $scope.lastDate;
              chatitem.chatType = $scope.msglevel;
              chatitem.senderId = $scope.srcId;
              chatitem.senderName =$scope.srcName;
              chatitem.isSuccess=$scope.isSuccess;
              chatitem.daytype=$scope.daytype;
              $greendao.saveObj('SlowNotifyListService', chatitem, function (data) {
                // alert("保存成功方法"+data.length);
                $slowarr.updatelastData(chatitem);
                $rootScope.$broadcast('lastslowcount.update');
                $scope.sendAPPDetailCount($scope.id);
              }, function (err) {
                // $ToastUtils.showToast(err + "数据保存失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err);
            });
          }, function (err) {
            // $ToastUtils.showToast(err);
          });
        }
        //滑动到底部
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    /**
     * 更新应用名称表===详情界面
     */
    $scope.publicModuleCount=function (id,unread) {
      // alert("进来展示框了吗"+id+unread);
      $greendao.queryData('ModuleCountService','where id =?','1',function (data) {
        var appitem={};
        $scope.getCount=function (id) {
          if(id === '1'){
            appitem.count1=unread;
          }else if (id === '15'){
            appitem.count2=unread;
          }else if(id === '16'){
            appitem.count3=unread;
          }else if(id === '17'){
            appitem.count4=unread;
          }
        }
        if(data.length ===0){
          appitem.id='1';
          appitem.name=$scope.alarmname;
          appitem.count2='0';
          appitem.count3='0';
          appitem.count1='0';
          appitem.count4='0';
          $scope.getCount(id);
          appitem.type=$scope.type;
        }else{
          appitem.id='1';
          appitem.count1=data[0].count1;
          appitem.count2=data[0].count2;
          appitem.count3=data[0].count3;
          appitem.count4=data[0].count4;
          $scope.getCount(id);
          // alert("测试改变后的count值"+appitem.count1+appitem.count2+appitem.count3+appitem.count4);
          appitem.name=data[0].name;
          appitem.type=data[0].type;
        }
        $greendao.saveObj('ModuleCountService',appitem,function (data) {
          $rootScope.$broadcast('newAPP.update');
        },function (err) {

        });
      },function (err) {

      });
    }

    /**
     * 应用模块数据监听
     */
    $scope.$on('appnotify.update',function (event) {
      $scope.$apply(function () {
        // alert("进来新的监听啦");
        $scope.oacount=$mqtt.getOaCount();
        $scope.bhzcount=$mqtt.getBhzCount();
        $scope.sycount=$mqtt.getSyCount();
        $scope.cjgccount=$mqtt.getCjgcCount();
        $scope.id=$mqtt.getFirstReceiverSsid();
        $scope.alarmname=$mqtt.getFirstReceiverChatName();
        $scope.type=$mqtt.getMessageType();
        if($scope.oacount >=0 && $scope.id === '1'){
          // alert("公文处理通知数量》0");
          $scope.unread=$scope.oacount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }else if($scope.bhzcount>=0 && $scope.id === '15'){
          // alert("拌合站通知数量》0");
          $scope.unread=$scope.bhzcount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }else if($scope.sycount>=0 && $scope.id === '16'){
          // alert("试验室通知数量》0");
          $scope.unread=$scope.sycount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }else if($scope.cjgccount>=0 && $scope.id === '17'){
          // alert("沉降观测通知数量》0");
          $scope.unread=$scope.cjgccount;
          $scope.publicModuleCount($scope.id,$scope.unread);
        }
      });
    });


    $scope.gonewback = function (chatType,id) {
      if(chatType === 'Level_1'){
        $mqtt.clearFastcount();
        $scope.count=$mqtt.getFastcount();
      }else if(chatType === 'Common'){
        $mqtt.clearSlowcount();
        $scope.count=$mqtt.getSlowcount();
      }
      // $ToastUtils.showToast("无参进来的userid"+$scope.userId);
      // alert("id-======="+id+"type====="+chatType);
      $greendao.queryData('SystemMsgService', 'where sessionid =? order by "when" desc limit 0,1',id, function (data) {
        if (data.length === 0) {
          // alert("无数据返回主界面1");
          $scope.lastText = '';//最后一条消息内容
          $scope.lastDate = 0;//最后一条消息的时间
          $scope.chatName = $scope.chatName;//对话框名称
          $scope.imgSrc = '';//最后一条消息的头像
          $scope.srcId='';//若没有最后一条消息，则将senderid=‘’
          $scope.srcName ='';//若没有最后一条数据，则将senderName=‘’
          $scope.daytype='';
          $scope.isSuccess='';
        } else {
          // alert("有数据返回通知界面1");
          $scope.lastText = data[0].message;//最后一条消息内容
          $scope.lastDate = data[0].when;//最后一条消息的时间
          $scope.chatName = data[0].chatName;//对话框名称
          $scope.imgSrc = data[0].imgSrc;//最后一条消息的头像
          $scope.srcName = data[0].username;//消息来源人名字
          $scope.srcId = data[0].senderid;//消息来源人id
          $scope.daytype=data[0].daytype;
          $scope.isSuccess=data[0].isSuccess;
        }
        // $ToastUtils.showToast("无参跳转用户名"+$scope.userId);
        if(chatType === 'Level_1'){
          $greendao.queryNotifyChat(chatType,id,function (data)  {
            // alert("跳转查询消息列表"+data.length);
            var chatitem = {};
            chatitem.id = id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = $scope.count;
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;
            chatitem.chatType = chatType;
            chatitem.senderId = $scope.srcId;
            chatitem.senderName = $scope.srcName;
            chatitem.isSuccess=$scope.isSuccess;
            chatitem.daytype=$scope.daytype;
            $greendao.saveObj('NotifyListService', chatitem, function (data) {
              // alert("save success");
              $scope.sendAPPDetailCount(id);
              // alert("紧急改变后的count"+$scope.count);
              $greendao.queryByConditions('NotifyListService', function (data) {
                $state.go("tab.notifications");
              }, function (err) {
                // $ToastUtils.showToast(err + "加载全部数据失败");
              });
            }, function (err) {
              // $ToastUtils.showToast(err + "数据保存失败");
            });
          }, function (err) {
            // $ToastUtils.showToast(err + "查询聊天列表失败");
          });
        }else if(chatType === 'Common'){
          $greendao.querySlowNotifyChat(chatType,id,function (data)  {
            // alert("跳转查询消息列表"+data.length);
            var chatitem = {};
            chatitem.id = id;
            chatitem.chatName = data[0].chatName;
            chatitem.imgSrc = $scope.imgSrc;
            chatitem.lastText = $scope.lastText;
            chatitem.count = $scope.count;
            chatitem.isDelete = data[0].isDelete;
            chatitem.lastDate = $scope.lastDate;
            chatitem.chatType = chatType;
            chatitem.senderId = $scope.srcId;
            chatitem.senderName = $scope.srcName;
            chatitem.isSuccess=$scope.isSuccess;
            chatitem.daytype=$scope.daytype;
            $greendao.saveObj('SlowNotifyListService', chatitem, function (data) {
              // alert("save success");
              $scope.sendAPPDetailCount(id);
              // alert("一般改变后的count"+$scope.count);
              $greendao.queryByConditions('SlowNotifyListService', function (data) {
                $state.go("tab.notifications");
              }, function (err) {
              });
            }, function (err) {
            });
          }, function (err) {
          });
        }

      }, function (err) {
      });
    }

  })




