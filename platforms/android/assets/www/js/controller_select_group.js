/**
 * Created by Administrator on 2016/8/14.
 */
angular.module('selectgroup.controllers', [])



.controller('addNewPersonfirstCtrl', function ($scope, $http, $state, $stateParams) {


  contactService.getContacts().then(function (response) {
    $scope.names = response;

  });

  $scope.contactId = $stateParams.contactId;
  $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


  $scope.goGroupMessage = function () {
    $state.go("messageGroup");
  }

})


  .controller('addNewPersonsecondCtrl',function ($scope, $http, $state, $stateParams){
    $scope.secondlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length)*15+50;

    var seconddiv=document.getElementById("secondscroll");
    seconddiv.style.width=$scope.secondlength+"px";
    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId);
    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.backsecond = function (contactinfo) {
      $state.go("second", {
        "contactId": contactinfo.parentdeptid
      });
    }

  })
  .controller('addNewPersonthirdCtrl',function ($scope, $http, $state, $stateParams) {

    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)
    $scope.namelength3=$scope.contactsInfo.deptname.length



    $scope.backsecond = function (contactinfo) {
      $state.go("second", {
        "contactId": contactinfo.parentdeptid
      });
    }

    $scope.thirdlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length+$scope.namelength3)*15+100;

    var thirddiv=document.getElementById("thirdscroll");
    thirddiv.style.width=$scope.thirdlength+"px";
  })


  .controller('addNewPersonforthCtrl', function ($scope, $http, $state, $stateParams) {
    $scope.contactId = $stateParams.contactId;


    contactService.getContactThirdById($scope.contactId).then(function (response) {
      $scope.thirdNames = response;

    });


    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)
    $scope.namelength43=$scope.contactsInfo.deptname.length

    $scope.parent = contactService.getParentById($scope.contactsInfo)
    $scope.namelength44=$scope.parent.deptname.length
    $scope.backToThird = function (contactinfo) {
      $state.go("third", {
        "contactId": contactinfo.parentdeptid
      });
    }


    $scope.detailPerson = function (item) {
      $state.go("person", {
        obj: item
      })
    }

    $scope.forthlength=(document.getElementById('a1').innerText.length+document.getElementById('a2').innerText.length+$scope.namelength43+ $scope.namelength44)*15+150;

    var forthdiv=document.getElementById("forthscroll");
    forthdiv.style.width=$scope.forthlength+"px";

  })



  .controller('addNewPersonfifthCtrl', function ($scope, $http, $state, $stateParams, contactService) {
    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goSixth = function () {
      $state.go("sixth");
    }

  })
  .controller('addNewPersonsixthCtrl', function ($scope, $http, $state, $stateParams, contactService) {

    contactService.getContacts().then(function (response) {
      $scope.names = response;

    });

    $scope.contactId = $stateParams.contactId;
    $scope.contactsInfo = contactService.getContactById($stateParams.contactId)


    $scope.goSeventh = function () {
      $state.go("seventh");
    }
  })

  
  .controller('localDetailsCtrl',function ($scope,$state) {


  })
