/**
 * Created by Administrator on 2016/9/9.
 */
angular.module('localphone.controllers', [])

  .controller('LocalContactCtrl',function ($scope,$state,localContact,$ionicActionSheet,$phonepluin,$ionicPopover,$ionicBackdrop,$mqtt,$ToastUtils,$ionicLoading,$timeout,$greendao) {


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


    $scope.contactsA=new Array();
    $scope.contactsB=new Array();
    $scope.contactsC=new Array();
    $scope.contactsD=new Array();
    $scope.contactsE=new Array();
    $scope.contactsF=new Array();
    $scope.contactsG=new Array();
    $scope.contactsH=new Array();
    $scope.contactsI=new Array();
    $scope.contactsJ=new Array();
    $scope.contactsK=new Array();
    $scope.contactsL=new Array();
    $scope.contactsM=new Array();
    $scope.contactsN=new Array();
    $scope.contactsO=new Array();
    $scope.contactsP=new Array();
    $scope.contactsQ=new Array();
    $scope.contactsR=new Array();
    $scope.contactsS=new Array();
    $scope.contactsT=new Array();
    $scope.contactsU=new Array();
    $scope.contactsV=new Array();
    $scope.contactsW=new Array();
    $scope.contactsX=new Array();
    $scope.contactsY=new Array();
    $scope.contactsZ=new Array();
    $scope.contactsNoSuch=new Array();



      $greendao.queryByConditions("LocalPhoneService",function (message) {
        $timeout(function () {
        if(message!=null){

          for(var i=0; i<message.length; i++){

            if (message[i].pinyinname.substring(0,1)==="A"){
              $scope.contactsA.push(message[i])
            }else if (message[i].pinyinname.substring(0,1)==="B"){
              $scope.contactsB.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="C"){
              $scope.contactsC.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="D"){
              $scope.contactsD.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="E"){
              $scope.contactsE.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="F"){
              $scope.contactsF.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="G"){
              $scope.contactsG.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="H"){
              $scope.contactsH.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="I"){
              $scope.contactsI.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="J"){
              $scope.contactsJ.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="K"){
              $scope.contactsK.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="L"){
              $scope.contactsL.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="M"){
              $scope.contactsM.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="N"){
              $scope.contactsN.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="O"){
              $scope.contactsO.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="P"){
              $scope.contactsP.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="Q"){
              $scope.contactsQ.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="R"){
              $scope.contactsR.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="S"){
              $scope.contactsS.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="T"){
              $scope.contactsT.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="U"){
              $scope.contactsU.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="V"){
              $scope.contactsV.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="W"){
              $scope.contactsW.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="X"){
              $scope.contactsX.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="Y"){
              $scope.contactsY.push(message[i])

            }else if (message[i].pinyinname.substring(0,1)==="Z"){
              $scope.contactsZ.push(message[i])

            }else {
              $scope.contactsNoSuch.push(message[i])
            }

          }

        }
          $ionicLoading.hide();
      });
      },function (err) {

      })

    $scope.$on('$ionicView.enter', function () {
     $scope.init();
    });

    $scope.init=function () {

      var startY = 0;
      var lastY =  0;
      var indicator =document.getElementById("indicator");
      indicator.addEventListener('touchstart', function(e) {
        lastY = startY = e.touches[0].pageY;
        console.log(lastY+"start");
        //alert(lastY+"start")
      });
      indicator.addEventListener('touchmove', function(e) {
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        content.style.top = (parseInt(contentTop) + moveY) + 'px';
        lastY = nowY;
        console.log(lastY+"move");
        alert(lastY+"move")

      });
      indicator.addEventListener('touchend', function(e) {
        // do touchend
        var nowY = e.touches[0].pageY;
        var moveY = nowY - lastY;
        var contentTop = content.style.top.replace('px', '');
        content.style.top = (parseInt(contentTop) + moveY) + 'px';
        lastY = nowY+30;
        console.log(lastY+"end");
        alert(lastY+"end")

      });

    }

   /* $scope.isis=false;
    $scope.$on('selectedCity', function (e, data) {
      $scope.isis=true;
      $scope.daxie=data;
      $timeout(function () {
        $scope.isis=false;
      },1500);

    });*/








    /*function init(){
    }
*/

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
              var newphone=$scope.trimkong(phonenumber,"g");
              $phonepluin.call(0,  newphone, name,0);
            }else {
              $ToastUtils.showToast("电话号码为空");
            }
          }else {
            if (phonenumber!=""){
              var newphone=$scope.trimkong(phonenumber,"g");

              $phonepluin.sms(0,newphone, name, 0);
            }else {
              $ToastUtils.showToast("电话号码为空");
            }
          }
          return true;
        }

      });

    };



    $scope.trimkong=function(number,is_global)
    {

      var newresult = number.replace(/(^\s+)|(\s+$)/g,"");
      if(is_global.toLowerCase()=="g")
      {
        newresult= newresult.replace(/\s/g,"");
      }
      return newresult;
    }
  })

