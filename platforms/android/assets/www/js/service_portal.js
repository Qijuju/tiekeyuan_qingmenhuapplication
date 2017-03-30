/**
 * Created by Administrator on 2017/3/24.
 */
angular.module('portal.services', [])
  .factory('FinshedApp', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var finshedApps = [{
      appId: 35,
      appName: '诚信体系',
      appIcon: 'img/app1/cxtx.png',
      appUrl: 'http://immobile.r93535.com:8081/cxtx/index.html'
    }, {
      appId: 148,
      appName: '车辆管理',
      appIcon: 'img/app1/clgl.png',
      appUrl: 'http://immobile.r93535.com:8081/clgl/index.html'
    }, {
      appId: 10,
      appName: '项目动态',
      appIcon: 'img/app1/xmdt.png',
      appUrl: 'http://immobile.r93535.com:8081/xmdt/index.html'
    }, {
      appId: 99,
      appName: '信息发布',
      appIcon: 'img/app1/xxfb.png',
      appUrl: 'http://immobile.r93535.com:8081/xxfb/index.html'
    }, {
      appId: 16,
      appName: '施工图审核',
      appIcon: 'img/app2/sgtsh.png',
      appUrl: 'http://immobile.r93535.com:8081/sgtsh/index.html'
    }, {
      appId: 49,
      appName: '征地拆迁',
      appIcon: 'img/app2/zdcq.png',
      appUrl: 'http://immobile.r93535.com:8081/zdcq/index.html'
      // appUrl: 'http://172.25.28.109:8080/www/index.html'
    }, {
        appId: 82,
        appName: '调度指挥',
        appIcon: 'img/app2/ddzh.png',
        appUrl: 'http://immobile.r93535.com:8081/ddzh/index.html'
      }, {
        appId: 17,
        appName: '试验室',
        appIcon: 'img/app3/sys.png',
        appUrl: 'http://immobile.r93535.com:8081/sys/index.html'
      }, {
        appId: 24,
        appName: '沉降观测',
        appIcon: 'img/app3/cjgc.png',
        appUrl: 'http://www.r93535.com/cj/riskcontrol/appmanager/appstatisticsindex!mobiledevicepc.action'
      }, {
        appId: 138,
        appName: '板厂',
        appIcon: 'img/app3/bc.png',
        appUrl: 'http://61.237.239.104:18080/TDBLAppService/html/1Allcompany.html'
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
    return {
      //获取人员的所在公司
      getCompanyName: function (userID) {
        $http({
          method: 'get',
          url: "https://cars.crbim.top/apiman-gateway/r93535.com/getJSDeptsByUserId/2.0/" + userID + "?apikey=4a81ca6e-9683-4d47-b80d-c8f1c7ca11d3"
        }).success(function (data, status) {
          // alert(status);
          //首先筛选二级公司 没有二级公司使用客专公司或者路局
          for (var i = 0; i < data.length; i++) {
            if (data[i].grade == 150) {
              companyName = data[i].name;
              break;
            } else if (data[i].grade == 130 || data[i].grade == 60) {
              companyName = data[i].name;
            }
          }
          $rootScope.$broadcast('companyName.update');
        }).error(function (data, status) {
          $rootScope.$broadcast('error.update');
          console.log(status);
        });
      },
      getName: function () {
        return companyName;
      },

      //获取该用户可以查看的应用将其点亮 (必须满足在开发出来的应用)
      getAppMenu: function (userID) {
        $http({
          method: 'get',
          url: "https://cars.crbim.top/apiman-gateway/r93535.com/getSysMenuByUserId/2.0/" + userID + "?apikey=4a81ca6e-9683-4d47-b80d-c8f1c7ca11d3"
        }).success(function (data, status) {
          // alert(status);
          // console.log("-----" + FinshedApp.all().length);
          if (lightApps.length > 0) {
            lightApps = new Array();
          }

          lightApps.push(FinshedApp.get(99));
          for (var i = 0; i < data.length; i++) {
            if (FinshedApp.get(data[i].id) != null) {
              lightApps.push(FinshedApp.get(data[i].id));
            }
          }

          console.log("lightApps" + lightApps.length);
          $rootScope.$broadcast('appMenu.update');
        }).error(function (data, status) {
          $rootScope.$broadcast('error.update');
          console.log(status);
        });
      },

      getLightApps: function () {
        return lightApps;
      },
      get: function (appId) {
        for (var i = 0; i < lightApps.length; i++) {
          if (lightApps[i].appId === parseInt(appId)) {
            return lightApps[i];
          }
        }
        return null;
      }
    };
  })
;
