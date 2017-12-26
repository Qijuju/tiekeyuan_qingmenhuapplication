/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('contacts.controllers', [])
  //常用联系人
  .controller('TopContactsCtrl', function ($scope, $state, $contacts, $ionicActionSheet, $phonepluin, $rootScope,$saveMessageContacts,$ToastUtils,$greendao,$RandomColor,$timeout) {

    $contacts.topContactsInfo();
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topall = $contacts.getTopContactsInfo();

        // 截取字符串显示下头像logo上
        for(var i=0;i<$scope.topall.length;i++){
          $scope.topall[i].logoName =  $scope.topall[i].name.slice(-2);
        }

      })
    });

    $scope.topContactGoDetail = function (id) {
      $state.go("person", {
        "userId": id
      });
    };

    //点击头像发送消息
    $scope.createchat = function (id, phone,name) {
      $rootScope.isPersonSend = 'true';
      if(id ===null || name ===null || id === '' ||name ===''){
        // $ToastUtils.showToast("当前用户信息不全");
      }else{
        $state.go('messageDetail',{
          "id":id,
          "ssid":name,
          "grouptype":'User'
        });
      }
    };

    //快速打开的入口  传入类型的原因的 当type等于1 的时候才存入数据库  不等于的时候走的本地通讯录
    $scope.sheetShow = function (id, phone, name, type) {
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '发消息'},
          {text: '打电话'},
          {text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.createchat(id,phone, name);
          } else if (index == 1) {
            if(phone!=""){
              $phonepluin.call(id, phone, name, type);
            }else {
              $ToastUtils.showToast("电话为空")
            }
          } else {
            if(phone!=""){
              $phonepluin.sms(id, phone, name, type)
            }else {
              $ToastUtils.showToast("电话为空")
            }
          }
          return true;
        }
      });
    };

    $scope.deleteTopCotacts=function (id) {
      $greendao.deleteDataByArg('TopContactsService',id,function (data) {

        $contacts.topContactsInfo();
      },function (err) {

      })
    };

    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $chatarr.setData(data);
        $greendao.queryByConditions('ChatListService',function (data) {
          $scope.items=data;
        },function (err) {

        });
        $timeout(function () {
          viewScroll.scrollBottom();
        }, 100);
      })
    });

    // 定义头像随机色
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      var oFriendsIcon=document.getElementsByClassName("friendsIcon");
      for(var i=0;i<oFriendsIcon.length;i++){
        oFriendsIcon[i].style.background = $RandomColor.randomC();
      }
    });

  })

  .controller('ContactsCtrl', function ($scope, $state,$api, $stateParams,$ionicPopup,$cordovaFileOpener2, $contacts, $greendao, $ionicActionSheet, $phonepluin,$mqtt, $rootScope,$saveMessageContacts,$ToastUtils,$timeout,$chatarr,$pubionicloading,$ionicPlatform,$ionicHistory,$location,localContact) {
    // alert("网络状态"+$rootScope.isNetConnect);
//登录成功后第一件事：检测升级
    $api.checkUpdate($ionicPopup, $cordovaFileOpener2,$scope.isFromMy);
    $scope.$on('netstatus.update', function (event) {
      $scope.$apply(function () {
        //alert("哈哈哈哈哈啊哈哈哈哈");
        //   alert("关网时走不走"+$rootScope.netStatus);
        $rootScope.isConnect=$rootScope.netStatus;
        // alert("切换网络时"+$scope.isConnect);
      })
    });




    var backButtonPressedOnceToExit=false;
    $ionicPlatform.registerBackButtonAction(function (e) {
      if($location.path()=='/tab/notification'||$location.path()=='/tab/contacts'||$location.path()=='/tab/account'||$location.path()=='/tab/portal'){
        if (backButtonPressedOnceToExit) {
          $mqtt.setExitStartedStatus();
          ionic.Platform.exitApp();
        } else {
          backButtonPressedOnceToExit = true;
          $ToastUtils.showToast('再按一次退出系统');
          setTimeout(function () {
            backButtonPressedOnceToExit = false;
          }, 1500);
        }
      }else {
        $ionicHistory.goBack();
        $pubionicloading.hide();
      }
      e.preventDefault();
      return false;


    },501)

    $scope.goLocalContact=function () {

      $pubionicloading.showloading('','正在加载...');

      $greendao.loadAllData('LocalPhoneService',function (msg) {
        if(msg.length>0){
          $pubionicloading.hide();
          $state.go('localContacts');
        }else {
          $pubionicloading.hide();
          localContact.getContact();
        }

      },function (err) {
        $pubionicloading.hide();
      });

    }

    $scope.$on('im.back',function (event) {

      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $state.go('localContacts');
        });
      })

    });

    $scope.$on('im.wrong',function (event) {

      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $ToastUtils.showToast("请求数据异常")
          $greendao.deleteAllData('LocalPhoneService',function () {

          },function () {

          });

        });
      })

    });

    $pubionicloading.showloading('','正在加载...');

    $contacts.topContactsInfo();
    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })
    $scope.$on('topcontacts.update', function (event) {
      $scope.$apply(function () {
        $scope.topContactLists = $contacts.getTopContactsInfo();

        for(var i=0;i<$scope.topContactLists.length;i++){
          $scope.topContactLists[i].shotName = $scope.topContactLists[i].name.slice(-2);

        }


      })
    });

    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        $scope.logId = $contacts.getLoignInfo();
        $scope.loginid=$contacts.getLoignInfo().deptID;
        //取出我的部门的人数的长度，供我的部门上拉加载
        $api.getDeparment($scope.loginid,function (data) {
          if(data.result){
            $scope.mydeptlength=data.deptInfo.ChildCount;
          }
        },function (err) {
        });

      })
    });

    $scope.$on('$ionicView.enter', function () {
      $contacts.rootDept();

    });





    $scope.$on('first.update', function (event) {
      $scope.$apply(function () {
        $pubionicloading.hide();
        $timeout(function () {
          $scope.depts = $contacts.getRootDept();
        });
      })
    });


    /**
     * 监听消息
     */
    $scope.$on('msgs.update', function (event) {
      $scope.$apply(function () {
        // alert("进来单聊界面吗？");
        $greendao.queryByConditions('ChatListService',function (data) {
          $chatarr.setData(data);
          $scope.items=data;
          // alert("数组的长度"+data.length);
        },function (err) {

        });
      })
    });

    /**
     * 监听通知
     * @param id
     */
    $scope.$on('allnotify.update', function (event, data) {
      $scope.$apply(function () {
        $greendao.queryData('NewNotifyListService', 'where IS_READ =?', "0", function (msg) {
          $scope.NotifyNoRead = 0;
          if (msg.length > 0) {
            $scope.NotifyNoRead = $scope.NotifyNoRead + msg.length;
            $mqtt.saveInt("badgeNotifyCount",$scope.NotifyNoRead);
          }
        }, function (err) {
        });
        $timeout(function () {
        }, 100);
      });
    })


    $scope.topGoDetail = function (id) {
      $state.go("person", {
        "userId": id,
      });
    };

    //快速打开的入口  传入类型的原因的 当type等于1 的时候才存入数据库  不等于的时候走的本地通讯录
    $scope.simpleSheetShow = function (id, phone, name, type) {

      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          {text: '发消息'},
          {text: '打电话'},
          {text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.createchat(id, phone,name);
          } else if (index == 1) {
            if(phone!=""){
              $phonepluin.call(id, phone, name, type);
            }else if($scope.myid==id) {
              $ToastUtils.showToast("无法对自己进行该项操作");
            }else {
              $ToastUtils.showToast("电话为空")
            }
          } else {
            if(phone!=""){
              $phonepluin.sms(id, phone, name, type)
            }else if($scope.myid==id) {
              $ToastUtils.showToast("无法对自己进行该项操作");
            }else {
              $ToastUtils.showToast("电话为空")

            }
          }
          return true;
        }

      });
    };

    $scope.createchat = function (id, phone,name) {
      $rootScope.isPersonSend = 'true';
      if(id ===null || name ===null || id === '' ||name ===''){
        $ToastUtils.showToast("当前用户信息不全");
      }else if($scope.myid==id) {
        $ToastUtils.showToast("无法对自己进行该项操作");
      }else{
        $state.go('messageDetail',{
          "id":id,
          "ssid":name,
          "grouptype":'User'
        });
      }
    };

    $scope.goSearch = function () {
      var keyboard = cordova.require('ionic-plugin-keyboard.keyboard');
      keyboard.close();
      $state.go("search");
    }


    /*$greendao.deleteAllData('TopContactsService',function (data) {
     $ToastUtils.showToast('清除数据成功');
     },function (err) {
     $ToastUtils.showToast(err);
     });*/


    $scope.gogosecond=function (id,deptName,childcount) {
      $state.go("second", {
        "contactId": id,
        "contactName":deptName,
        "childcount":childcount
      });
    }


  })

  /**联系人---二级~八级目录**/
  .controller('ContactSecondCtrl', function ($scope,$http, $state,$mqtt,$ionicPlatform,$ionicScrollDelegate,$stateParams,$pubionicloading,$formalurlapi,$rootScope,$relex) {
    var pageNo=1;
    var allContactArray;
    var curDeptId,curIndicate,curDeptName,curChildCount;//为了在同一层级上拉加载数据传递相同的变量
    $scope.departlist = [];//定义一个全局的部门列表
    $scope.userlist = [];//定义一个全局的人员列表
    var overallIndex =0;
    $scope.loadMoreStatus=false;
    $scope.personFlag = true;
    $scope.tempCount =1;

    //加载更多的方法
    $scope.loadContactsMore=function () {
      $scope.switchData(curDeptId,curDeptName,curIndicate,curChildCount,false);
    };

    //一级一级返回联系人主界面
    $scope.goPrevious = function () {
      var preIndex=overallIndex-2;
      if(preIndex >= 0){
        if ($scope.docList.length - preIndex - 1 > 0) {
          $scope.docList.splice(preIndex + 1, $scope.docList.length - preIndex - 1);
        }
        pageNo=1;
        $scope.switchData($scope.docList[preIndex].deptId, $scope.docList[preIndex].deptName, true,$scope.docList[preIndex].childCount,true);
      }else{ //返回根目录
        $state.go("tab.contacts");
      }

    };

    //直接返回联系人主界面
    $scope.close=function () {
      $state.go('tab.contacts');
    }

    //跳转联系人详情界面
    $scope.goPersonDetail = function (userID) {
      $rootScope.tempDocList=$scope.docList;
      $state.go('person', {
        userId: userID,
        index:overallIndex
      });
    };

    //物理返回键处理方法(直接返回到联系人主界面)
    $ionicPlatform.registerBackButtonAction(function (e) {
      if($scope.tempCount == 1){
        if($stateParams.personFlag){
          $scope.docList=$rootScope.tempDocList;
          var personIndex = $stateParams.index-1;
          pageNo=1;
          $scope.tempCount = 2;
          $scope.switchData($scope.docList[personIndex].deptId, $scope.docList[personIndex].deptName,true,$scope.docList[personIndex].childCount,true);

        }
      }
        $scope.goPrevious();
      e.preventDefault();
      return false;
    },501);


    //请求一级目录
    allContactArray=function () {
      //获取登录用户的信息
      $mqtt.getUserInfo(function (success) {
        var myDeptName='';
        if ($stateParams.contactName === '我的部门' ){
          myDeptName=success.deptName;
        }else {
          myDeptName=$stateParams.contactName;
        }
        console.log("取到的部门名称"+myDeptName);

        $pubionicloading.showloading();
        $scope.userid = success.userID;
        var mepId=success.mepId;
        //获取一级部门的组织机构列表
        $http({
          method: 'post',
          url: $formalurlapi.getBaseUrl(),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "Action": "GetChilds",
            "deptId": $stateParams.contactId,
            "pageNo": pageNo,
            "pageSize": 100,
            "id": $scope.userid,
            "mepId": mepId
          }
        }).success(function (succ) {
          $pubionicloading.hide();
          var succ = JSON.parse(decodeURIComponent($relex.getReplaceAfter(succ)));
          tempDeptList = succ.Event.depts;
          tempUserList = succ.Event.users;
          //添加一级部门指示标
          $scope.docList.push({
            index: 0,
            deptId: $stateParams.contactId,
            deptName: myDeptName,  //$stateParams.contactName
            childCount:$stateParams.childcount
          });
          //界面主题名字(取出导航栏上一级目录存的deptname)
          $scope.deptinfo = $scope.docList[$scope.docList.length - 1].deptName;
          viewScroll.scrollTop();
          /**
           * 根据返回的一级目录数据判断是否上拉加载
           */
          if(($stateParams.childcount-pageNo*10) >0){
            $scope.loadMoreStatus = true;
            curDeptId = $stateParams.contactId;
            curDeptName = myDeptName;
            curChildCount = $stateParams.childcount;
            curIndicate = true;
            pageNo ++;
          }else{
            $scope.loadMoreStatus = false;
          }
          if(tempDeptList != null && tempDeptList != "" && tempDeptList != undefined ){
            for(var i = 0;i<tempDeptList.length;i++){
              $scope.departlist.push(tempDeptList[i]);
            }
          }
          if(tempUserList !=null && tempUserList != "" && tempUserList != undefined){
            for(var j = 0;j<tempUserList.length;j++){
              $scope.userlist.push(tempUserList[j]);
            }
          }

          for(var i=0;i<$scope.userlist.length;i++){
            $scope.userlist[i].logoName = $scope.userlist[i].displayName.slice(-2);
          }

          overallIndex = $scope.docList.length;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }).error(function (err) {
          $pubionicloading.hide();
        });
      }, function (err) {

      });
    };

    //进来界面初始化
    var viewScroll = $ionicScrollDelegate.$getByHandle('scrollTop');
    $scope.docList = [];
    document.addEventListener('deviceready', function () {
      if(!$stateParams.personFlag){
        allContactArray();
      }
    });

    //获取多级部门
    $scope.switchData = function (deptId, deptName, isIndicate,childcount,flag) {
     $pubionicloading.showloading();
      var isLoadSuccess = false;
      if(flag){
        $scope.departlist = [];
        $scope.userlist = [];
        pageNo =1;
      }
      //添加N级部门指示标
      if (!isIndicate) {
        $scope.docList.push({
          index: $scope.docList.length,
          deptId: deptId,
          deptName: deptName,
          childCount:childcount
        });
      }
      //获取多级部门下的部门列表
      $mqtt.getUserInfo(function (success){

        var mepId=success.mepId;
        $scope.userid = success.userID;
        $http({
          method: 'post',
          url: $formalurlapi.getBaseUrl(),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          data: {
            "Action": "GetChilds",
            "deptId": deptId,
            "pageNo": pageNo,
            "pageSize": 10,
            "id": $scope.userid,
            "mepId": mepId//window.device.uuid
          }
        }).success(function (succ) {
          $pubionicloading.hide();
          var succ = JSON.parse(decodeURIComponent($relex.getReplaceAfter(succ)));
          if(succ.Event.depts !=undefined && succ.Event.depts !=null && succ.Event.depts !=''){
            var tempDeptList = succ.Event.depts;
          }
          if(succ.Event.users !=undefined && succ.Event.users !=null && succ.Event.users !=''){
            var tempUserList = succ.Event.users;
          }
          // viewScroll.scrollTop();
          isLoadSuccess = true;
          //界面主题名字(取出导航栏上一级目录存的deptname)
          $scope.deptinfo = $scope.docList[$scope.docList.length - 1].deptName;
          /**
           * 根据返回的二级-N级目录数据判断是否上拉加载
           */
         if((childcount-pageNo*10) >0){
           $scope.loadMoreStatus = true;
           curDeptId = deptId;
           curDeptName = deptName;
           curChildCount = childcount;
           curIndicate = true;
           pageNo ++;
         }else{
           $scope.loadMoreStatus = false;
         }
         if(tempDeptList != null && tempDeptList != "" && tempDeptList != undefined ){
           for(var i = 0;i<tempDeptList.length;i++){
             $scope.departlist.push(tempDeptList[i]);
           }
         }
         if(tempUserList !=null && tempUserList != "" && tempUserList != undefined){
           for(var j = 0;j<tempUserList.length;j++){
             $scope.userlist.push(tempUserList[j]);
           }
         }

          for(var i=0;i<$scope.userlist.length;i++){
            $scope.userlist[i].logoName = $scope.userlist[i].displayName.slice(-2);
          }

          overallIndex = $scope.docList.length;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }).error(function (err) {
            $pubionicloading.hide();
        });
      },function (error) {

      });
    };

    //若是从个人详情界面返回，则应该逐级返回
    if($stateParams.personFlag){
      $scope.docList=$rootScope.tempDocList;
      var personIndex = $stateParams.index-1;
      pageNo=1;
      $scope.switchData($scope.docList[personIndex].deptId, $scope.docList[personIndex].deptName,true,$scope.docList[personIndex].childCount,true);
    }

    //从部门导航切换数据
    $scope.switchIndicate = function (item) {
      var index = item.index;
      if ($scope.docList.length - index - 1 > 0) {
        $scope.docList.splice(index + 1, $scope.docList.length - index - 1);
      }
      pageNo=1;
      $scope.switchData(item.deptId, item.deptName, true,item.childCount,true);
    };

  })


  .controller('PersonCtrl', function ($scope, $stateParams, $state, $phonepluin, $savaLocalPlugin, $contacts, $ionicHistory, $rootScope, $addattentionser,$saveMessageContacts,$ToastUtils,$mqtt,$timeout,$pubionicloading,$api,$greendao,$ionicPlatform) {

    // Setup the loader
    $pubionicloading.showloading('','正在加载...');
    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.


    $scope.userId = $stateParams.userId;
    $scope.picyoumeiyoudet=false;

    $api.getOtherHeadPic($scope.userId,"60",function (srcurl) {
      $scope.picyoumeiyoudet=true;

      $scope.securlpicdet=srcurl;

      $greendao.queryData('ChatListService','where id =?',$scope.userId,function (data) {
        if(data[0].count>0){
          var chatitem = {};
          chatitem.id = data[0].id;
          chatitem.chatName = data[0].chatName;
          chatitem.imgSrc = data[0].imgSrc;
          chatitem.lastText = data[0].lastText;
          chatitem.count = '0';
          chatitem.isDelete = data[0].isDelete;
          chatitem.lastDate = data[0].lastDate;
          chatitem.chatType = data[0].chatType;
          // alert("chatype"+chatitem.chatType);
          chatitem.senderId = data[0].senderId;//发送者id
          chatitem.senderName = data[0].senderName;//发送者名字
          chatitem.daytype=data[0].daytype;
          chatitem.isSuccess=data[0].isSuccess;
          chatitem.isFailure=data[0].isFailure;
          chatitem.messagetype=data[0].messagetype;
          chatitem.isRead=data[0].isRead;
          $greendao.saveObj('ChatListService',chatitem,function (data) {
            $greendao.queryDataByIdAndIsread($scope.userId,'0',function (data) {
              for(var i=0;i<data.length;i++){
                // alert("进入for循环的长度"+data.length);
                var messaegeitem={};
                messaegeitem._id=data[i]._id;
                messaegeitem.sessionid=data[i].sessionid;
                messaegeitem.type=data[i].type;
                // alert("监听消息类型"+messaegeitem.type+messaegeitem._id);
                messaegeitem.from=data[i].from;
                messaegeitem.message=data[i].message;
                messaegeitem.messagetype=data[i].messagetype;
                messaegeitem.platform=data[i].platform;
                messaegeitem.when=data[i].when;
                messaegeitem.isFailure=data[i].isFailure;
                messaegeitem.isDelete=data[i].isDelete;
                messaegeitem.imgSrc=srcurl;
                messaegeitem.username=data[i].username;
                messaegeitem.senderid=data[i].senderid;
                messaegeitem.isSuccess=data[i].isSuccess;
                messaegeitem.istime=data[i].istime;
                messaegeitem.daytype=data[i].daytype;
                if(data[i].isread ==='0'){
                  if(data[i].messagetype != 'Audio'){
                    // alert("拿到库里的消息阅读状态"+data[i].isread);
                    data[i].isread ='1';
                    messaegeitem.isread=data[i].isread;
                    // alert('hellonihaozhoujielun' + messaegeitem._id);
                    // alert("拿到库里的消息阅读状态后"+messaegeitem.isread);
                    $greendao.saveObj('MessagesService',messaegeitem,function (data) {
                      // alert("保存成功");

                    },function (err) {
                    });
                  }
                }
              }
            },function (err) {
            });
          },function (err) {

          });
        }
      },function (err) {

      });

      var otherHeadPicItem={};
      otherHeadPicItem.id=$scope.userId;
      otherHeadPicItem.picurl=$scope.securlpicdet;
      $greendao.saveObj('OtherHeadPicService',otherHeadPicItem,function (succ) {
        $greendao.queryData('MessagesService','where senderid =?',$scope.userId,function (data) {
          // alert("取出数据得长度"+data.length);
          for(var i=0;i<data.length;i++){
            var messageitem={};
            messageitem._id=data[i]._id;
            messageitem.sessionid=data[i].sessionid;
            messageitem.type=data[i].type;
            messageitem.from=data[i].from;
            messageitem.message=data[i].message;
            messageitem.messagetype=data[i].messagetype;
            messageitem.platform=data[i].platform;
            messageitem.isFailure=data[i].isFailure;
            messageitem.when=data[i].when;
            messageitem.isDelete=data[i].isDelete;
            // $scope.securlpicdet= $scope.securlpicdet.replace("//","/");
            messageitem.imgSrc=$scope.securlpicdet;
            messageitem.username=data[i].username;
            messageitem.senderid=data[i].senderid;
            messageitem.isread=data[i].isread;
            messageitem.isSuccess=data[i].isSuccess;
            messageitem.daytype=data[i].daytype;
            messageitem.istime=data[i].istime;
            $greendao.saveObj('MessagesService',messageitem,function (success) {
            },function (err) {
            });
          }

        },function (err) {
        });
        // alert(succ.length);
      },function (err) {
      });
      // alert(srcurl)
      // alert( $rootScope.securlpicaaa)
    },function (error) {
      $scope.picyoumeiyoudet=false;
      // alert(error)
    })

    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })

    $contacts.personDetail($scope.userId,$timeout,$ToastUtils);
    $scope.$on('personDetail.update', function (event) {
      $scope.$apply(function () {
          $timeout(function () {
            $pubionicloading.hide();
            $scope.persondsfs = $contacts.getPersonDetail();
            if ($scope.persondsfs.UserName.length > 2) {
              $scope.simpleName = $scope.persondsfs.UserName.substr(($scope.persondsfs.UserName.length-2), $scope.persondsfs.UserName.length);
            } else {
              $scope.simpleName = $scope.persondsfs.UserName;
            }
          });
      })
    });
    $scope.backAny = function () {
      $state.go('second',{
        contactId:"",
        contactName:"",
        childcount:"",
        index:$stateParams.index,
        personFlag:true
      })
    };


    $ionicPlatform.registerBackButtonAction(function (e) {
      $pubionicloading.hide();
      $state.go('second',{
        contactId:"",
        contactName:"",
        childcount:"",
        index:$stateParams.index,
        personFlag:true
      })
      e.preventDefault();
      return false;
    },501)


    //调用打电话功能，并且会存到数据库里面
    $scope.detailCall = function (id, phone, name, type) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (phone != "") {
          $phonepluin.call(id, phone, name, type);
        } else {
          $ToastUtils.showToast("电话为空")
        }
      }
    }


    //发短信 也会把存入数据库  传入类型的原因是 type 只是存 通过组织架构拨打出去的电话和人
    $scope.detailSendSms = function (id, phone, name, type) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (phone != "") {
          $phonepluin.sms(id, phone, name, type);
        } else {
          $ToastUtils.showToast("电话为空")
        }
      }

    };


    //把联系人存入本地
    $scope.insertPhone = function (name, phone) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        if (name != null && phone != null) {
          $savaLocalPlugin.insert(name, phone);
        } else {
          $ToastUtils.showToast("姓名或者电话为空")
        }
      }

    };

    //点击头像发送消息
    $scope.createchat = function (id, phone,name) {
      if (id==""||id==null||name==""||name==null){
        $ToastUtils.showToast("当前用户信息不全")
      }else {
        // $saveMessageContacts.saveMessageContacts(id,phone,name);
        // $ToastUtils.showToast("进来创建聊天");
        $rootScope.isPersonSend = 'true';
        // $state.go('tab.message', {
        //   "id": id,
        //   "sessionid": name
        // });
        if ($scope.myid == $scope.userId) {
          $ToastUtils.showToast("无法对自己进行该项操作")
        } else if (id === null || name === null || id === '' || name === '') {
          $ToastUtils.showToast("当前用户信息不全")
        } else {
          $saveMessageContacts.saveMessageContacts(id, phone, name);
          //$ionicHistory.clearHistory();
          $state.go('messageDetail', {
            "id": id,
            "ssid": name,
            "grouptype":'User'
          });
        }
      }

    }
    //取消关注
    $scope.removeattention = function (id) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.removeAttention111(membersAerr);
      }
    }
    $scope.$on('attention.delete', function (event) {
      $scope.$apply(function () {
        $scope.persondsfs.IsAttention = $addattentionser.getaddAttention111();
      })
    });

    //添加关注
    $scope.addattentiondetail = function (id) {
      if ($scope.myid==$scope.userId){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.addAttention111(membersAerr);
      }
    };
    $scope.$on('attention.add', function (event) {
      $scope.$apply(function () {
        $scope.persondsfs.IsAttention = $addattentionser.getaddAttention111();

      })
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



    $scope.showalert=function () {
      $ToastUtils.showToast("此用户还未激活")
    }


  })

  .controller('GroupCtrl', function ($scope,$state,$contacts,$ToastUtils,$group,$rootScope,$greendao,$pubionicloading,$timeout) {
    $pubionicloading.showloading('','正在加载...');



    $contacts.loginInfo();
    $scope.$on('login.update', function (event) {
      $scope.$apply(function () {
        $contacts.clearSecondCount();
        //登录人员的id
        $scope.loginId=$contacts.getLoignInfo().userID;
        $scope.loginName=$contacts.getLoignInfo().userName;
        //部门id
        $scope.depid=$contacts.getLoignInfo().deptID;
        $contacts.loginDeptInfo($scope.depid);
        $group.allGroup();
      })
    });

    $scope.$on('logindept.update', function (event) {
      $scope.$apply(function () {
        //部门id
        $scope.deptinfo = $contacts.getloginDeptInfo();

      })
    });



    $scope.$on('group.update', function (event) {
      $scope.$apply(function () {

        $timeout(function () {
          $pubionicloading.hide();
          $scope.grouplist=$group.getAllGroup();
          $scope.ismycreat=0;

          for(var i=0; i<$scope.grouplist.length;i++){
            if($scope.grouplist[i].isMyGroup==true){
              $scope.ismycreat++;
            }
          }

        });

      })
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


    //我创建的
    $scope.goCreateGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'
      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Group",
        "ismygroup":ismygrop
      });
    }

    //我加入的
    $scope.goJoinGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'
      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Group",
        "ismygroup":ismygrop
      });
    }

    //部门的群
    $scope.goDepartmentGroup=function (id,name,ismygrop) {
      $rootScope.isPersonSend === 'true'

      $state.go('messageGroup',{
        "id":id,
        "chatName":name,
        "grouptype":"Dept",
        "ismygroup":ismygrop
      });
    }
    $scope.createGroupChats=function () {

      $greendao.deleteAllData("SelectIdService",function (msg) {

      },function (err) {

      })

      var selectInfo={};
      //当创建群聊的时候先把登录的id和信息  存到数据库上面
      selectInfo.id=$scope.loginId;
      selectInfo.name=$scope.loginName;
      selectInfo.grade="0";
      selectInfo.isselected=true;
      selectInfo.type='user';
      selectInfo.parentid=$scope.depid;
      $greendao.saveObj('SelectIdService',selectInfo,function (msg) {

      },function (err) {

      })

      $state.go('addnewpersonfirst',{
        "createtype":'single',
        "groupid":'0',
        "groupname":'',
        "functiontag":"groupchat"
      });

    }




  })

  .controller('myattentionaaaSelectCtrl',function ($scope,$state,$myattentionser,$api,$pubionicloading,$mqtt,$timeout,$phonepluin,$ionicActionSheet,$searchdata,$searchdatadianji,$ToastUtils,$rootScope,$saveMessageContacts,$addattentionser,$RandomColor) {
    $pubionicloading.showloading('','正在加载...');

    // 定义头像随机色
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      var oFriendsIcon=document.getElementsByClassName("friendsIcon");
      for(var i=0;i<oFriendsIcon.length;i++){
        oFriendsIcon[i].style.background = $RandomColor.randomC();
      }
    });

    $mqtt.getUserInfo(function (msg) {
      $scope.myid=msg.userID;
    },function (msg) {
    })
    //点击人员进入人员详情
    $scope.jumpattenDetial = function (id) {
      $state.go("person", {
        "userId": id
      });

    };

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

    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.phoneattention=$searchdata.getPersonDetail().user.Mobile;
        $scope.nameattention=$searchdata.getPersonDetail().user.UserName;
        $scope.idattention=$searchdata.getPersonDetail().user.UserID;

        $scope.createchat = function (id, phone,name) {
          $saveMessageContacts.saveMessageContacts(id,phone,name)
          $rootScope.isPersonSend = 'true';
          if(id ===null || name ===null || id === '' ||name ===''){
            $ToastUtils.showToast("当前用户信息不全");
          }else if($scope.myid==id){
            $ToastUtils.showToast("无法对自己进行该项操作");
          }else{
            $state.go('messageDetail',{
              "id":id,
              "ssid":name,
              "grouptype":'User'
            });
          }
        };
        // 显示操作表
        $ionicActionSheet.show({
          buttons: [
            { text: '打电话' },
            { text: '发消息' },
            { text: '发短信'}
          ],
          titleText: $scope.nameattention,
          cancelText: '取消',
          buttonClicked: function(index) {
            if(index==0){
              if ($scope.phoneattention!=""){
                $phonepluin.call($scope.idattention, $scope.phoneattention, $scope.nameattention,1);
              }else if($scope.myid==$scope.idattention){
                $ToastUtils.showToast("无法对自己进行该项操作");
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }else if(index==1){
              $scope.createchat($scope.idattention,$scope.phoneattention,$scope.nameattention);
            }else {
              if ($scope.phoneattention!=""){
                $phonepluin.sms($scope.idattention,$scope.phoneattention, $scope.nameattention, 1);
              }else if($scope.myid==$scope.idattention){
                $ToastUtils.showToast("无法对自己进行该项操作");
              }else {
                $ToastUtils.showToast("电话号码为空");
              }
            }
            return true;
          }

        });

      })
    });
    // 点击按钮触发，或一些其他的触发条件
    $scope.tanchuangattention = function(id) {
      //获取人员详细信息
      $searchdata.personDetail(id);

    };


    $myattentionser.getAttentionList();
    $scope.$on('attention.update',function (event) {
      $scope.$apply(function () {
        $timeout(function () {
          $pubionicloading.hide();
          $scope.contactsListatten=$myattentionser.getAttentionaaList();

          // 截取字符串显示下头像logo上
          for(var i=0;i<$scope.contactsListatten.length;i++){
            $scope.contactsListatten[i].logoName =  $scope.contactsListatten[i].UserName.slice(-2);
          }


        });
      })
    });


    //取消关注
    $scope.removeattention = function (id) {
      $pubionicloading.showloading('','正在加载...');
      if ($scope.myid==id){
        $ToastUtils.showToast("无法对自己进行该项操作")
      }else {
        var membersAerr = [];
        membersAerr.push(id);
        $addattentionser.removeAttention111(membersAerr);
      }
    }
    $scope.$on('attention.delete', function (event) {
      $scope.$apply(function () {
        $myattentionser.getAttentionList();
      })
    });


  })
  .controller('attentionDetailCtrl',function ($scope,$state,$stateParams,$savaLocalPlugin,$phonepluin,$searchdata,$api,$searchlocal,$addattentionser,$ToastUtils) {
    //返回关注列表界面
    $scope.backAttention = function () {
      $state.go("myAttention");
    }
    //拿上一个页面传的参数
    $scope.UserIDattention = $stateParams.UserIDatten;


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
      })
    });


    //获取人员详细信息
    $searchdata.personDetail($scope.UserIDattention);
    $scope.$on('person.update',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111=$searchdata.getPersonDetail().user;

      })
    });




    //存本地
    $scope.insertPhoneSearch = function(name,phonenumber) {

      $savaLocalPlugin.insert(name,phonenumber);
    };

    //打电话
    $scope.callSearch = function(phonenumber,name) {
      $phonepluin.call(phonenumber,name);
    };
    //发短信
    $scope.smsSearch = function(phonenumber) {
      $phonepluin.sms(phonenumber);
    };


    //取消关注
    $scope.removeattention=function (id) {
      var membersAerr=[];
      membersAerr.push(id);
      $addattentionser.removeAttention111(membersAerr);
    }
    $scope.$on('attention.delete',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111.IsAttention=$addattentionser.getaddAttention111();

      })
    });

    //添加关注
    $scope.addattentiondetail = function(id) {
      var membersAerr=[];
      membersAerr.push(id);
      $addattentionser.addAttention111(membersAerr);
    };
    $scope.$on('attention.add',function (event) {
      $scope.$apply(function () {
        $scope.personsdetail111.IsAttention=$addattentionser.getaddAttention111();
      })
    });

  })
