angular.module('im.directives', [])
  .directive('rjHoldActive', ['$ionicGesture', '$timeout', '$ionicBackdrop',
    function ($ionicGesture, $timeout, $ionicBackdrop) {
      return {
        scope: false,
        restrict: 'A',
        replace: false,
        link: function (scope, iElm, iAttrs, controller) {
          $ionicGesture.on("hold", function () {
            iElm.addClass('active');
            $timeout(function () {
              iElm.removeClass('active');
            }, 300);
          }, iElm);
        }
      };
    }
  ])
  
  .directive('rjCloseBackDrop', [function () {
    return {
      scope: false,
      restrict: 'A',
      replace: false,
      link: function (scope, iElm, iAttrs, controller) {
        var htmlEl = angular.element(document.querySelector('html'));
        htmlEl.on("click", function (event) {
          if (event.target.nodeName === "HTML" &&
            scope.popup.optionsPopup &&
            scope.popup.isPopup) {
            scope.popup.optionsPopup.close();
            scope.popup.isPopup = false;
          }
        });
      }
    };
  }])
  .directive('resizeFootBar', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
    // Runs during compile
    return {
      replace: false,
      link: function (scope, iElm, iAttrs, controller) {
        scope.$on("taResize", function (e, ta) {
          if (!ta) return;
          var scroll = document.body.querySelector("#message-detail-content");
          var scrollBar = $ionicScrollDelegate.$getByHandle('messageDetailsScroll');
          // console.log(scroll);
          var taHeight = ta[0].offsetHeight;
          var newFooterHeight = taHeight + 10;
          newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

          iElm[0].style.height = newFooterHeight + 'px';
          scroll.style.bottom = newFooterHeight + 'px';
          scrollBar.scrollBottom();
        });
      }
    };
  }])


  .directive('rjPositionMiddle', ['$window', function ($window) {
    return {
      replace: false,
      link: function (scope, iElm, iAttrs, controller) {
        var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
        if (height >= 0) {
          iElm[0].style.top = (height / 2 + 44) + 'px';
        } else {
          iElm[0].style.top = 44 + 'px';
        }
      }
    }
  }])

  /**
   * 本地联系人
   */


  .directive('cityListBox', function ($timeout, $ionicScrollDelegate,$ToastUtils) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var events = scope.events;
        events.on('cityboxlinkclick', function (obj) {
          var id = obj.data.attr('href');
          var currentid=id.substring(9,10);
          var el = document.querySelector(id);
          if (el.offsetTop>0) {
            var scrollPosition = el.offsetTop+54;
            $ionicScrollDelegate.scrollTo(0, scrollPosition);
          }else {
            //$ToastUtils.showToast("没有"+currentid+"字母开头的人")
          }
        });
      },
      controller: function ($rootScope, $scope, $attrs, $element) {
        $scope.events = new SimplePubSub();
        $scope.$on('cityboxlinkclick', function (e, data) {
          $scope.events.trigger("cityboxlinkclick", {"event": e, "data": data});
        });
       /* $scope.$on('selectedCity', function (e, data) {
          $scope.currentCityChange(data);
        });*/
      }
    }
  })
  .directive('cityboxLink', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.preventDefault();
          scope.$emit('cityboxlinkclick', element);
        })
      }
    }
  })
  .directive('cityboxSelect', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.preventDefault();
          if (e.target.nodeName == 'A') {
            scope.$emit('selectedCity', e.target.text);
          }
        })
      }
    }
  })


function SimplePubSub() {
  var events = {};
  return {
    on: function(names, handler) {
      names.split(' ').forEach(function(name) {
        if (!events[name]) {
          events[name] = [];
        }
        events[name].push(handler);
      });
      return this;
    },
    trigger: function(name, args) {
      angular.forEach(events[name], function(handler) {
        handler.call(null, args);
      });
      return this;
    }
  };
}






























