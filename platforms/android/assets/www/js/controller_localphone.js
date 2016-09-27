/**
 * Created by Administrator on 2016/9/9.
 */
angular.module('localphone.controllers', [])

  .controller('LocalContactCtrl',function ($scope,$state,localContact,$ionicActionSheet,$phonepluin,$ionicPopover,$ionicBackdrop,$mqtt,$ToastUtils,$ionicLoading,$timeout) {


    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 100,
      showDelay: 0
    });

    $scope.goLocalSearch= function () {
      $state.go("searchlocal");
    }

    $scope.localgoDetail=function (id) {
      $state.go("person", {
        "userId": id,
      });
    }


    localContact.getContact();
    $scope.$on('im.back',function (event) {

      $scope.$apply(function () {

        $timeout(function () {
          $ionicLoading.hide();
          $scope.contacts=localContact.getAllContacts();

          $scope.contactsA=localContact.getA();
          $scope.contactsB=localContact.getB();
          $scope.contactsC=localContact.getC();
          $scope.contactsD=localContact.getD();
          $scope.contactsE=localContact.getE();
          $scope.contactsF=localContact.getF();
          $scope.contactsG=localContact.getG();
          $scope.contactsH=localContact.getH();
          $scope.contactsI=localContact.getI();
          $scope.contactsJ=localContact.getJ();
          $scope.contactsK=localContact.getK();
          $scope.contactsL=localContact.getL();
          $scope.contactsM=localContact.getM();
          $scope.contactsN=localContact.getN();
          $scope.contactsO=localContact.getO();
          $scope.contactsP=localContact.getP();
          $scope.contactsQ=localContact.getQ();
          $scope.contactsR=localContact.getR();
          $scope.contactsS=localContact.getS();
          $scope.contactsT=localContact.getT();
          $scope.contactsU=localContact.getU();
          $scope.contactsV=localContact.getV();
          $scope.contactsW=localContact.getW();
          $scope.contactsX=localContact.getX();
          $scope.contactsY=localContact.getY();
          $scope.contactsZ=localContact.getZ();
          $scope.contactsNoSuch=localContact.getNoSuch();
          init();

        });


      })

    });
    function init(){
      var startY = 0;
      var lastY =  0;
      var indicator =document.getElementById("indicator");
      indicator.addEventListener('touchstart', function(e) {
        lastY = startY = e.touches[0].pageY;
        console.log(lastY+"start");
      });
      indicator.addEventListener('touchmove', function(e) {
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        content.style.top = (parseInt(contentTop) + moveY) + 'px';
        lastY = nowY;
        console.log(lastY+"move");
      });
      indicator.addEventListener('touchend', function(e) {
        // do touchend
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        content.style.top = (parseInt(contentTop) + moveY) + 'px';
        lastY = nowY+30;
        console.log(lastY+"end");
      });
    }


// 点击按钮触发，或一些其他的触发条件
    $scope.tanchuang = function(phonenumber,name) {
      // 显示操作表
      $ionicActionSheet.show({
        buttons: [
          { text: '打电话' },
          { text: '发短信'}
        ],
        titleText: name,
        cancelText: '取消',
        buttonClicked: function(index) {
          if(index==0){
            if (phonenumber!=""){
              $phonepluin.call(0, phonenumber, name,0);
            }else {
              $ToastUtils.showToast("电话号码为空");
            }
          }else {
            if (phonenumber!=""){
              $phonepluin.sms(0,phonenumber, name, 0);
            }else {
              $ToastUtils.showToast("电话号码为空");
            }
          }
          return true;
        }

      });

    };
  })

