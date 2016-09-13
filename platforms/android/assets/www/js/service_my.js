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
