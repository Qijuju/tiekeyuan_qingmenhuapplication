/**
 * Created by bim on 2017/9/8.
 */
angular.module('msgcheck.controllers',[])
  .controller('msgcheckCtrl',function ($scope,$stateParams,$state,$http,$formalurlapi,$ToastUtils,$interval,$api,$mqtt) {
    $scope.errCode = $stateParams.errCode;
    $scope.mobile = $stateParams.mobile;
    $scope.userId = $stateParams.userId;
    $scope.mepId = $stateParams.mepId;
    $scope.remPwd =$stateParams.remPwd;
    // alert("进来验证码界面"+$scope.errCode+"==="+$scope.mobile+"===="+$scope.userId+"===="+$scope.mepId);

    //验证格式是否正确
    function isMB(str) {
      var re = /^1\d{10}$/
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    }

    //清空手机号
    $scope.changeMobile=function () {
      $scope.mobile = '';
    }

    //清空验证码
    $scope.clearSecret=function () {
      $scope.secret = '';
    }

    //重置手机号
    $scope.resetMobile=function () {
      $scope.mobile = '';
    }
    //发送验证码
    $scope.sendSecretText=function () {
      var flag=true;
      //点击发送验证码按钮时启动定时器的同时将按钮置为不可点击状态
      document.getElementById("sendsecret").disabled = true ;
      //点击发送验证码时，启动一个60S的定时器
      $scope.millions = 60;
      var timer = $interval(function () {
        $scope.millions --;
        if($scope.millions <= 0){
          //60s后改变按钮字样，并将按钮的状态置为可点击状态
          document.getElementById("sendsecret").innerText ="重新发送验证码";
          document.getElementById("sendsecret").disabled = false ;
          //60s后取消定时器
          $interval.cancel(timer);
        }else{
          //发送验证码按钮60s不可点击
          document.getElementById("sendsecret").innerText ="发送验证码"+$scope.millions+"s";
          $scope.mobile = document.getElementById("getMobile").value;
          if(flag){
            $interval.cancel(timer);
            //若手机号码没有错误，则发送短信验证码至手机
            if(!(isMB($scope.mobile))){
              $ToastUtils.showToast("请输入正确的手机号!");
              // $scope.mobile = '';
            }else{
              //调用发送验证码接口
              $http({
                method: 'post',
                url: $formalurlapi.getBaseUrl(),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                  Action: 'SendSecretText',
                  id:$scope.userId,
                  mepId:$scope.mepId,
                  funcCode: "Login",
                  mobile:$scope.mobile
                }
              }).success(function (mobile) {
                var mobile=JSON.parse(decodeURIComponent(mobile));
                // alert("修改手机号调用成功"+JSON.stringify(mobile));
                if(mobile.Succeed){
                  flag = false;
                  document.getElementById("sendsecret").innerText ="发送验证码";
                }else{
                  document.getElementById("sendsecret").innerText ="重新发送验证码";
                  document.getElementById("sendsecret").disabled = false ;
                  $ToastUtils.showToast("获取验证码失败!");
                }
              }).error(function (err) {
                // alert("修改手机号不成功"+JSON.stringify(err));
              });
            }

          }

        }
      },1000);

    }


    //登陆再次验证
    $scope.relogin=function () {
      $scope.secret=document.getElementById('secret').value;
      //通过短信验证码登陆轻门户
      $api.confirmSecretText($scope.userId,$scope.mepId,$scope.secret,function (succ) {
        // alert("短信验证是否成功"+JSON.stringify(succ));
        if(succ.result){
          $mqtt.save("login_info",succ);
          $mqtt.save('remPwd', $scope.remPwd);
          $state.go('tab.message');
        }
      },function (err) {
        $ToastUtils.showToast("短信验证错误，请重新获取短信验证码!");
      });
      // $http({
      //   method: 'post',
      //   url: $formalurlapi.getBaseUrl(),
      //   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      //   data: {
      //     Action: 'ConfirmSecretText',
      //     id:$scope.userId,
      //     mepId:$scope.mepId,
      //     funcCode: "Login",
      //     secretText:$scope.secret
      //   }
      // }).success(function (succ) {
      //
      // }).error(function (err) {
      //   $ToastUtils.showToast("短信验证错误，请重新获取短信验证码!");
      //   // alert("短信验证不成功"+JSON.stringify(err));
      // });
    }
    //返回登录界面
    $scope.back=function () {
      $state.go('login');
    }
  })
