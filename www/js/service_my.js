/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('my.services', [])
  // .factory('nfcService', function ($rootScope, $ionicPlatform) {
  //
  //   var tag = {};
  //
  //   $ionicPlatform.ready(function() {
  //     nfc.addNdefListener(function (nfcEvent) {
  //       alert(JSON.stringify(nfcEvent.tag, null, 4));
  //       $rootScope.$apply(function(){
  //         angular.copy(nfcEvent.tag, tag);
  //         // if necessary $state.go('some-route')
  //       });
  //     }, function () {
  //       alert("Listening for NDEF Tags.");
  //     }, function (reason) {
  //       alert("Error adding NFC Listener " + reason);
  //     });
  //
  //   });
  //
  //   return {
  //     tag: tag,
  //
  //     clearTag: function () {
  //       angular.copy({}, this.tag);
  //     }
  //   };
  // });
  .factory('Indicators', function () {

    var indicators = [
      {
        id: 0,
        describe: '公司举行廉洁工程',
        url: 'img/im77.png'
      }, {
        id: 1,
        describe: '公司举行廉洁工程',
        url: 'img/im88.png'
      }, {
        id: 2,
        describe: '公司举行廉洁工程',
        url: 'img/im99.png'
      }
      // , {
      //   id: 3,
      //   describe: '公司举行廉洁工程',
      //   url: 'img/im4.png'
      // }
    ];

    return {

      all: function () {
        return indicators;
      },

      getId: function (indicatorId) {
        for (var i = 0; i < indicators.length; i++) {
          if (indicators[i].id === parseInt(indicatorId)) {
            return indicators[i];
          }
        }
        return null;
      }

    }
  })

  .factory('Projects', function () {

    var projects = [

      {
        id: 0,
        projectName: '哈尔滨至佳木斯铁路',
        kzgsName: '哈家铁路客运专线'
      }, {
        id: 1,
        projectName: '新建哈尔滨至牡丹江铁路客运专线 ',
        kzgsName: '哈家铁路客运专线'
      }, {
        id: 2,
        projectName: '京沈客专京冀段 ',
        kzgsName: '哈家铁路客运专线'
      }];

    return {
      all: function () {
        return projects;
      },
      getProjectItem: function (projectId) {
        for (var i = 0; i < projects.length; i++) {
          if (projects[i].id === parseInt(projectId)) {
            return projects[i];
          }
        }
        return null;
      }
    }
  })

  .factory('Count', function () {

    var counts = [

      {
        id: 0,
        name: "问题",
        url: "/",
        image: "/img/icon_question.png"
      }, {
        id: 1,
        name: "问题",
        url: "/",
        image: "/img/icon_question.png"
      }, {
        id: 2,
        name: "问题",
        url: "/",
        image: "/img/icon_question.png"
      }, {
        id: 3,
        name: "问题",
        url: "/",
        image: "/img/icon_question.png"
      }, {
        id: 4,
        name: "问题",
        url: "/",
        image: "/img/icon_question.png"
      }];

    return {

      all: function () {
        return counts;
      },
      getcountItem: function (countId) {
        for (var i = 0; i < counts.length; i++) {
          if (counts[i].id === parseInt(countId)) {
            return counts[i];
          }
        }
        return null;
      }
    }
  });
