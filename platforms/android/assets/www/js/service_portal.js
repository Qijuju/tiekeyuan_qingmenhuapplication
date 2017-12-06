/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.services', [])
  .factory('FinshedApp', function () {
    // Might use a resource here that returns a JSON array
    // Some fake testing data
    var finshedApps = [{
      appId: 10,
      appName: '项目动态',
      appIcon: 'img/app1/xmdt.png',
    }, {
      appId: 11,
      appName: '项目信息',
      appIcon: 'img/app1/xmxx.png',
    }, {
      appId: 12,
      appName: '施工组织',
      appIcon: 'img/app2/sgzz.png',
    }, {
      appId: 49,
      appName: '征地拆迁',
      appIcon: 'img/app2/zdcq.png',
    }, {
      appId: 16,
      appName: '施工图审核',
      appIcon: 'img/app2/sgtsh.png',
    }, {
      appId: 17,
      appName: '试验室',
      appIcon: 'img/app3/sys.png',
    }, {
      appId: 18,
      appName: '拌和站',
      appIcon: 'img/app3/bhz.png',
    }, {
      appId: 21,
      appName: '施工日志',
      appIcon: 'img/app2/sgrz.png',
    }, {
      appId: 22,
      appName: '会议管理',
      appIcon: 'img/app1/hygl.png',
    }, {
      appId: 24,
      appName: '沉降观测',
      appIcon: 'img/app3/cjgc.png',
    }, {
      appId: 25,
      appName: '隧道形象化',
      appIcon: 'img/app3/sdxxh.png',
    }, {
      appId: 35,
      appName: '诚信体系',
      appIcon: 'img/app1/cxtx.png',
    },{
      appId: 194,
      appName: '武铁建设',
      appIcon: 'img/app1/wtjs.png',
    },{
      appId: 199,
      appName: '公文处理',
      appIcon: 'img/app1/gwcl.png',
    }, {
      appId: 82,
      appName: '调度指挥',
      appIcon: 'img/app2/ddzh.png',
    }, {
      //隧道监控
      appId: 83,
      appName: '围岩量测',
      appIcon: 'img/app3/sdjk.png',
    }, {
      appId: 99,
      appName: '信息发布',
      appIcon: 'img/app1/xwtz.png',
    }, {
      appId: 106,
      appName: '连续梁',
      appIcon: 'img/app3/lxl.png',
    }, {
      appId: 109,
      appName: '自动张拉',
      appIcon: 'img/app3/zdzl.png',
    }, {
      appId: 112,
      appName: '验工计价',
      appIcon: 'img/app2/ygjj.png',
    }, {
      appId: 132,
      appName: '物资设备',
      appIcon: 'img/app2/wzsb.png',
    }, {
      appId: 134,
      appName: '检验批',
      appIcon: 'img/app3/jyp.png',
    }, {
      appId: 136,
      appName: '连续压实',
      appIcon: 'img/app3/lxys.png',
    }, {
      appId: 137,
      appName: '梁场',
      appIcon: 'img/app3/lc.png',
    }, {
      appId: 138,
      appName: '板场',
      appIcon: 'img/app3/bc.png',
    }, {
      appId: 144,
      appName: '桥梁静载',
      appIcon: 'img/app3/qljz.png',
    }, {
      appId: 148,
      appName: '车辆管理',
      appIcon: 'img/app1/clgl.png',
    }, {
      appId: 155,
      appName: '投资控制',
      appIcon: 'img/app2/tzkz.png',
    }, {
      appId: 173,
      appName: '超前地质预报',
      appIcon: 'img/app3/cqdzyb.png',
    }, {
      appId: 174,
      appName: '工地试验室',
      appIcon: 'img/app3/gdsys.png',
    }, {
      appId: 200,
      appName: '桩基检测',
      appIcon: 'img/app3/zjjc.png',
    }, {
      appId: 135,
      appName: '问题库',
      appIcon: 'img/app2/wtk.png',
    }, {
      appId: 186,
      appName: '工程影像',
      appIcon: 'img/app3/gcyx.png',
    }, {
      appId: 237,//测试环境
      appName: '工程部位',
      appIcon: 'img/app3/gcbw.png',
    }, {
      appId: 168,//测试环境
      appName: '视频监控',
      appIcon: 'img/app3/spjk.png',
    }];

    return {
      all: function () {
        return finshedApps;
      },
      get: function (appId) {
        for (var i = 0; i < finshedApps.length; i++) {
          if (finshedApps[i].appId === parseInt(appId)) {
            return finshedApps[i];
          }
        }
        return null;
      }
    };
  })
  .factory('NetData', function ($mqtt, $rootScope,$formalurlapi, $timeout, $http, FinshedApp) {
    // var userID;
    //109975  qinzhengyang   147272 wubaixinag
    var companyName;
    var lightApps = new Array();
    var jsdept = [];
    var sysmenu = [];
    return {
      //获取人员所在公司，点亮图标，图片更改信息
      getInfo: function (userID,imcode) {
        $http({
          method: 'post',
          timeout: 5000,
          url:$formalurlapi.getBaseUrl(),
          data:{Action:"GetDetail",id:userID,mepId:imcode}
        }).success(function (data, status) {

          var data = JSON.parse(decodeURIComponent(data));
          //获取人员的所在公司
          jsdept = eval(data.jsdept);

          // alert("哈哈哈"+jsdept);
          companyName = "";
          if (jsdept != null && typeof(jsdept) != "undefined") {
            for (var i = 0; i < jsdept.length; i++) {
              if (jsdept[i].grade == 150) {
                companyName = jsdept[i].name;
                break;
              } else if (jsdept[i].grade == 130 || jsdept[i].grade == 60) {
                companyName = jsdept[i].name;
              } else if (jsdept[i].grade == 30) {
                companyName = "中国铁路总公司";
                /**
                 * 将要关闭的应用id定义成一个数组，然后遍历数组，隐藏图标
                 */
                var hiddenApps=["gwcl","hygl","clgl","xwtz","sgzz","wzsb","wtk","bc","zjjc","bhz","sys","jyp","lc"];
                for(var i=0;i<hiddenApps.length;i++){
                  document.getElementById(hiddenApps[i]).style.display = "none";
                }
              }
            }
          }
          //获取该用户可以查看的应用将其点亮
          sysmenu = eval(data.sysmenu);
          // alert("点亮后的图标"+JSON.stringify(sysmenu));
          if (lightApps.length > 0) {
            lightApps = new Array();
          }
          if (sysmenu != null && typeof(sysmenu) != "undefined") {
            for (var i = 0; i < sysmenu.length; i++) {
              if (FinshedApp.get(sysmenu[i].appId) != null) {
                sysmenu[i].appIcon = FinshedApp.get(sysmenu[i].appId).appIcon;
                lightApps.push(sysmenu[i]);
              }
            }
          }
          //获取变动的图片，名称（暂时不用改动
          $rootScope.$broadcast('succeed.update');
        }).error(function (data, status) {
          $rootScope.$broadcast('error.update');
        });
      },


      getName: function () {
        return companyName;
      },

      getLightApps: function () {
        return lightApps;
      },

      get: function (appId) {
        for (var i = 0; i < lightApps.length; i++) {
          if (lightApps[i].appId == parseInt(appId)) {
            return lightApps[i];
          }
        }
        // return null;
      },
      //获取应用名称
      getAppName:function (appId) {
        for(var i=0;i<lightApps.length;i++){
          if(appId == lightApps[i].appId){
            return lightApps[i].appName;
          }
        }
      }
    };
  })

  .factory('NotifyApplicationData', function ($mqtt, $rootScope,$formalurlapi, $timeout, $http,$ToastUtils) {
    var defaultCount=1;
    var defaultNumber=5;
    var applicationLists = []; // 应用列表数据集合
    var applicationChild = []; // 返回每个应用的通知列表
    var noOrYesConfirmList=[];

    return {
      // 获取应用列表及最新一条数据
      getListInfo: function (userID,imcode) {
        $http({
          method: 'post',
          timeout: 5000,
          url:$formalurlapi.getBaseUrl(),
          data:{
            Action:"GetExtMsgAppList",
            id:userID,
            mepId:imcode
          }
        }).success(function (data, status) {
          // 获取通知应用列表数据源
          applicationLists = JSON.parse(decodeURIComponent(data)).Event.appList;
          $rootScope.$broadcast('succeed.update');
        }).error(function (data, status) {
          $rootScope.$broadcast('error.update');
        });
      },
      getApplicationList: function () {
        return applicationLists;
      },
      getApplicationChildE:function (userID,imcode,fromId) {
        $http({
          method: 'post',
          timeout: 5000,
          url:$formalurlapi.getBaseUrl(),
          data:{
            Action:"GetExtMsg",
            id:userID,
            mepId:imcode,
            date:"A",
            fromId:fromId,
            pageNo:defaultCount,
            pageSize:defaultNumber
          }
        }).success(function (data, status) {

          // 获取通知应用列表数据源
          applicationChild = JSON.parse(decodeURIComponent(data)).msgList;
          $rootScope.$broadcast('getApplicationChildE.succeed.update');

          defaultCount++;
        }).error(function (data, status) {
          $ToastUtils.showToast(err);
          $rootScope.$broadcast('getApplicationChildE.error.update');
        });
      },
      getMsgReadListE:function (userID,imCode,msgid,isReaded) {
        console.log("确认详情拿到的参数：" + userID +"--" + imCode +"--" + msgid +"--" + isReaded);

        $http({
          method: 'post',
          timeout: 5000,
          url:$formalurlapi.getBaseUrl(),
          data:{
            Action:"GetExtMsgReadList",
            id:userID,
            mepId:imCode,
            msgId: msgid,
            isReaded:isReaded
          }
        }).success(function (data, status) {
          noOrYesConfirmList = JSON.parse(decodeURIComponent(data)).Event.userList;

          console.log("确认详情未确认列表数据1：" + JSON.stringify(noOrYesConfirmList));
          // 循环修改时间格式
          noOrYesConfirmList.forEach(function (item) {
            var whenStr =new Date( item.when );
            item.when = (whenStr.getMonth() +1)+"-"+whenStr.getDate()+" "+  whenStr.getHours()+":"+whenStr.getMinutes();
          });

          console.log("确认详情未确认列表数据2：" + JSON.stringify(noOrYesConfirmList));

          $rootScope.$broadcast('getMsgReadListE.succeed.update');
        }).error(function (data, status) {
          console.log("请求失败："+"--"+status +"--" +decodeURIComponent(data) );
          $rootScope.$broadcast('getMsgReadListE.error.update');
        });
      },
      getMsgReadList:function () {
        console.log("返回数据：" + JSON.stringify(noOrYesConfirmList));
        return noOrYesConfirmList;
      },
      applicationChild:function () {
        return applicationChild;
      },
      clearDefaultCount:function () {
        defaultCount=1;
      }
    };
  })

;
