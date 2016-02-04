(function() {

  'use strict';

  // http://www.technofattie.com/2014/07/27/easy-loading-indicator-when-switching-views-in-angular.html
  // tokenises the string from the last index of the separator back

  var strLeftBack = function(str, separator) {
    var pos = str.lastIndexOf(separator);
    var result = str.substring(0, pos);
    return result;
  };

  var SPINNER_SETTINGS_SMALL = {
    radius: 15,
    width: 5,
    length: 18
  };

  var SPINNER_SETTINGS_LARGE = {
    radius: 50,
    width: 10,
    length: 60
  };

  var SPINNER_SETTINGS_MEDIUM = {
    radius: 35,
    width: 8,
    length: 50
  };

  var SPINNER_SIZE_MAPPING = {
    'small': SPINNER_SETTINGS_SMALL,
    'medium': SPINNER_SETTINGS_MEDIUM,
    'large': SPINNER_SETTINGS_LARGE
  };

  // TODO: Sometimes we don't receive initial stateChangeSuccess so spinner stays on initially (global or in-line view)
  // TODO: Review https://github.com/facultymatt/angular-unsavedChanges and do something similiar to fix this timing issue
  // TODO: Decide if targetting initial angular bootstrap spinner as well (or strip out that code).

  angular.module('angular-ui-view-spinner', []).directive(
    'uiLoadingView', ['$rootScope', '$timeout',

   function($rootScope, $timeout) {

        return {
          priority: 1000,
          restrict: 'EA',
          scope: {

            name: '@?',
            autoscroll: '@?',
            /* onload parameter prohibited due to angular blacklisting this attribute for interpolation. */

            templateUrl: '@?', // alternative templateUrl to render
            rootState: '@?', // what is the parent base route for this view
            spinnerSettings: '@?', // optional spinner settings to override defaults
            size: '@?' // optional preset for 'small', 'medium' or 'large'
          },

          compile: function(elem, attrs) {
            return {
              post: function(scope, elem, attrs) {

                attrs.size = attrs.size || 'medium';

                if (attrs.size && !attrs.spinnerSettings) {
                  attrs.spinnerSettings = SPINNER_SIZE_MAPPING[attrs.size];

                  if (!attrs.spinnerSettings) {
                    throw new Error('angular-ui-view-spinner directive: Invalid size specified \'' + attrs.size + '\'.  Valid values are: small, medium or large.');
                  }
                }

                var rootState = scope.rootState;

                scope.spinnerEnabled = false;

                scope.isSpinnerEnabled = function() {
                  return !!scope.spinnerEnabled;
                };

                scope.isNextRouteLoading = function() {
                  return scope.nextRouteLoading;
                };

                scope.showView = function() {
                  return !scope.isNextRouteLoading();
                };

                scope.showSpinner = function() {
                  return scope.isSpinnerEnabled() || scope.isNextRouteLoading();
                };

                scope.isAutoscroll = function() {
                  return scope.$eval('autoscroll');
                };

                // keeps track of stateChange events in directive to unbind on destroy
                var boundEvents = [];

                var clearSpinnerSettings = function(isGlobalLoading) {

                  scope._unbindClearSpinnerSettings = $timeout(
                    function() {
                      scope.spinnerEnabled = false;
                      scope.globalRoute = false;

                      scope.nextRouteLoaded = true;
                      scope.nextRouteLoading = false;
                    }, 0, true
                  );
                };

                var setSpinnerLoadingSettings = function(scope, to, parentTo, isGlobalLoading) {
                  scope.globalRoute = false;
                  scope.nextRouteLoaded = false;
                  scope.nextRouteLoading = true;
                };

                var updateSpinnerState = function(scope, fromState, toState, routeLoadingState) {

                  var from = fromState ? fromState.name : '';
                  var to = toState ? toState.name : '';

                  var parentFrom = strLeftBack(from, '.');
                  var parentTo = strLeftBack(to, '.');

                  var isGlobalLoading = (rootState === undefined && to === parentTo);
                  var isSiblingRouteChange = (rootState && parentFrom === rootState && parentFrom === parentTo);

                  var routingDown = (parentFrom.length < parentTo.length);
                  var routingUp = (parentFrom.length > parentTo.length);

                  scope.globalRoute = isGlobalLoading;

                  // enables spinner on a new route change, doesn't enable if it is finishing a route change already in progress
                  if (routeLoadingState) {

                    // only show spinner at this level if you are going from here down further,
                    // from deeper back up to this level,
                    // it it's a sibling route change and you stay on the same level
                    if (routingUp && parentTo === rootState || routingDown && from === rootState || isSiblingRouteChange) {
                      scope.spinnerEnabled = true;
                    }
                    else {
                      scope.spinnerEnabled = false;
                    }
                  }

                  // if this is a root state (ie. no nesting)
                  if (isGlobalLoading && !rootState) {

                    if (routeLoadingState) {
                      setSpinnerLoadingSettings(scope, to, parentTo, isGlobalLoading);
                    }
                    else {
                      clearSpinnerSettings(isGlobalLoading);
                    }

                    // if we are navigating to a sibling nested state where the parent state matches the defined root-state
                  }
                  else if (!isGlobalLoading && rootState && from.indexOf(parentTo) > -1) {

                    if (routeLoadingState) {
                      setSpinnerLoadingSettings(scope, to, parentTo, isGlobalLoading);
                    }
                    else {
                      clearSpinnerSettings(isGlobalLoading);
                    }
                  }
                  else {
                    clearSpinnerSettings(isGlobalLoading);
                  }
                };

                boundEvents.push(
                  $rootScope.$on(
                    '$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams) {
                      updateSpinnerState(scope, fromState, toState, false);
                    }
                  )
                );

                boundEvents.push(
                  $rootScope.$on(
                    '$stateChangeCancel',
                    function(event, toState, toParams, fromState, fromParams) {
                      updateSpinnerState(scope, fromState, toState, false);
                    }
                  )
                );

                boundEvents.push(
                  $rootScope.$on(
                    '$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams) {

                      var from = fromState ? fromState.name : '';
                      var to = toState ? toState.name : '';

                      var parentFrom = strLeftBack(from, '.');
                      var parentTo = strLeftBack(to, '.');

                      if (fromState === rootState || parentTo === rootState) {
                        updateSpinnerState(scope, fromState, toState, false);
                      }
                    }
                  )
                );

                boundEvents.push(
                  $rootScope.$on(
                    '$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams) {

                      // if fromState = 'example' || toState = sibling
                      var from = fromState ? fromState.name : '';
                      var to = toState ? toState.name : '';

                      var parentFrom = strLeftBack(from, '.');
                      var parentTo = strLeftBack(to, '.');

                      if (fromState === rootState || parentTo === rootState) {
                        updateSpinnerState(scope, fromState, toState, true);
                      }
                    }
                  )
                );

                var cancelCurrentSpinner = function() {

                  // prevents multiple route changes causing problems
                  angular.forEach([scope._unbindClearSpinnerSettings],
                    function(timeoutEvent) {
                      if (timeoutEvent) {
                        $timeout.cancel(timeoutEvent);
                      }
                    }
                  );
                };

                var unbindEvents = function() {

                  angular.forEach(
                    boundEvents,
                    function(unbindEventListener) {
                      unbindEventListener();
                    }
                  );

                  cancelCurrentSpinner();
                };

                scope.$on(
                  '$destroy',
                  function() {
                    unbindEvents();
                  }
                );
              }
            };
          },

          templateUrl: function(element, attributes) {
            return attributes.templateUrl || 'angular-ui-view-spinner.html';
          }
        };
   }]
  ).run(
  ['$templateCache',
      function($templateCache) {
        var DEFAULT_TEMPLATE = '<div class="view-loading-spinner-container">' +
          '<div class="view-loading-spinner fadein obscure delay-fadein no-fadeout" ' +
          'ng-hide="!showSpinner()" us-spinner="spinnerSettings" spinner-start-active="1"></div></div>' +
          '<div ui-view name="{{name}}" autoscroll="isAutoscroll()" ng-hide="!showView()"></div></div>';

        $templateCache.put('angular-ui-view-spinner.html', DEFAULT_TEMPLATE);
  }]
  );
})();
