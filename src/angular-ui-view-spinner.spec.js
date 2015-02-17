(function() {
  'use strict';

  var xhrDelay = 500;

  var asyncResolve = {
    async: function() {
      return defer.promise;
    }
  };

  var defer;

  beforeEach(
    function() {

      module('ui.router');
      module('angular-ui-view-spinner');

      module(
        function($stateProvider) {
          $stateProvider.state(
            'menu', {
              url: '/menu'
              /* no resolve */
            }
          ).state(
            'menu.route1', {
              url: '/route1',
              resolve: asyncResolve
            }
          ).state(
            'menu.route.a', {
              url: '/a',
              resolve: asyncResolve
            }
          ).state(
            'menu.route2.b', {
              url: '/b2',
              resolve: asyncResolve
            }
          );
        }
      );

      this.sandbox = sinon.sandbox.create();
    }
  );

  afterEach(
    function() {
      this.sandbox.restore();
    }
  );

  describe(
    'Directive : UI Router : View Spinner', function() {

      var root_scope, isolate_scope, scope, directive_scope, view, element, state, spy;
      var createView, get_current_state, spinnerIsHidden, spinnerIsVisible;
      var $ngView;
      var params = {};
      var options = {};
      var timeout;

      beforeEach(
        inject(
          function($rootScope, $state, $templateCache, $timeout, $q) {

            defer = $q.defer();

            timeout = $timeout;

            createView = function(html, scope) {
              element = angular.element(view);

              inject(
                function($compile) {
                  $ngView = $compile(html)(scope);
                }
              );

              scope.$digest();
              directive_scope = $ngView.isolateScope();

              return $ngView;
            };

            scope = $rootScope.$new();
            state = $state;

            root_scope = $rootScope;

            get_current_state = function() {
              return state.current.name;
            };

            view = '<ui-loading-view root-state="menu"></ui-loading-view>';
            $ngView = createView(view, scope);

            spinnerIsHidden = function() {
              return $ngView.find('.view-loading-spinner').hasClass('ng-hide');
            }

            spinnerIsVisible = function() {
              return !spinnerIsHidden();
            }

            //spy = this.sandbox.spy(state, 'go');
            //update_tabs_spy = this.sandbox.spy(isolate_scope, 'update_tabs');

            console.log(directive_scope.isNextRouteLoading());
            state.go('menu');
            console.log(directive_scope.isNextRouteLoading());
            scope.$digest();
            scope.$digest();
            scope.$digest();
            scope.$digest();
            console.log(directive_scope.isNextRouteLoading());
            expect(directive_scope.showSpinner()).toBeFalsy();

            //expect(directive_scope.showSpinner()).toBeTruthy();
            expect(directive_scope.showSpinner()).toBeFalsy();
            //expect(spinnerIsHidden()).toBeTruthy();

          }
        )
      );

      xit('should define the view spinner directive with isolated scope', function() {
        expect(directive_scope).toBeDefined();
      });

      it('should show the spinner when a new child route is being loaded', function() {

        state.go('menu.route1');

        scope.$digest();

        //expect(spinnerIsVisible()).toBeTruthy();
        //expect(directive_scope.isSpinnerEnabled()).toBeTruthy();

        expect(state.current.name).not.toEqual('menu.route1');

        defer.resolve();
        scope.$digest();

        //console.log($ngView.find('.view-loading-spinner'));
        //expect(directive_scope.isSpinnerEnabled()).toBeFalsy();
        //expect(spinnerIsHidden()).toBeTruthy();
        //expect(state.current.name).toEqual('menu.route1');
      });

      xit('should show the spinner when a new sibling route is being loaded', function() {
        state.go('menu');
        expect(spinnerIsHidden()).toBeTruthy();
        state.go('menu.route1');
        expect(spinnerIsVisible()).toBeFalsy();
      });

      //it('should route to the first entry in tabConfiguration array by default', function() {
      //  expect(get_current_state()).toEqual(scope.tabConfiguration[0].route);
      //});
      //
      //it('should not change the route when selecting the current tab', function() {
      //
      //  var previous_state = get_current_state();
      //
      //  var current_active_tab_index = _.indexOf(scope.tabConfiguration, _.findWhere(scope.tabConfiguration, {
      //    route: previous_state
      //  }));
      //
      //  $ngView.find('a').eq(current_active_tab_index).click();
      //  timeout.flush();
      //
      //  expect(get_current_state()).toEqual(previous_state);
      //  expect(spy.notCalled).toBeTruthy();
      //});
      //
      //it('should change the route and update the tabs when selecting a different tab', function() {
      //
      //  var previous_state = get_current_state();
      //
      //  var another_tab = non_active_tab();
      //  var non_active_tab_index = _.indexOf(scope.tabConfiguration, another_tab);
      //
      //  $ngView.find('a').eq(non_active_tab_index).click();
      //  timeout.flush();
      //
      //  expect(spy).toHaveBeenCalledWith(another_tab.route);
      //  expect(get_current_state()).not.toEqual(previous_state);
      //  expect(update_tabs_spy).toHaveBeenCalled();
      //});
      //
      //it('should unbind the stateChangeSuccess event binding once the controller with the tabs is destroyed', function() {
      //  scope.$destroy();
      //
      //  var another_tab = 'notabs';
      //  state.go(another_tab);
      //  timeout.flush();
      //
      //  expect(update_tabs_spy).not.toHaveBeenCalled();
      //});
    }
  );
})();
