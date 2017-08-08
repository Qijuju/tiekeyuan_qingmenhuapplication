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
      appIcon: 'img/app1/xxfb.png',
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
      appName: '路基压实',
      appIcon: 'img/app3/lxys.png',
    }, {
      appId: 137,
      appName: '梁场',
      appIcon: 'img/app3/lc.png',
    }, {
      appId: 138,
      appName: '板厂',
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
      appId: 168,
      appName: '超前地质预报',
      appIcon: 'img/app3/cqdzyb.png',
    }, {
      appId: 174,
      appName: '全项试验',
      appIcon: 'img/app3/gdsys.png',
    }, {
      appId: 200,
      appName: '桩基检测',
      appIcon: 'img/app3/zjjc.png',
    }];

    return {
      all: function () {
        return finshedApps;
      },
      // remove: function(chat) {
      //   chats.splice(chats.indexOf(chat), 1);
      // },
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
  .factory('NetData', function ($mqtt, $rootScope, $timeout, $http, FinshedApp) {
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
          // url:"http://88.1.1.22:8081",//测试环境
          // url: "http://imtest.crbim.win:8080/apiman-gateway/jishitong/interface/1.0?apikey=b8d7adfb-7f2c-47fb-bac3-eaaa1bdd9d16",//开发环境
          url: "http://immobile.r93535.com:8088/crbim/imApi/1.0",//生产环境
          data:{Action:"GetDetail",id:userID,mepId:imcode}
        }).success(function (data, status) {
          var data=JSON.parse(decodeURIComponent(data));
          // alert("getdetail"+JSON.stringify(data));
          //获取人员的所在公司
          jsdept = eval(data.jsdept);
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
              }
            }
          }
          //获取该用户可以查看的应用将其点亮
          sysmenu = eval(data.sysmenu);
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
        return null;
      }
    };
  })
;
