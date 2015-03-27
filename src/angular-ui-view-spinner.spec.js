(function() {
  'use strict';

  var defer;

  var asyncResolve = {
    async: function() {
      return defer.promise;
    }
  };

  var $ng_view;
  var directive_scope;

  var create_view = function(html, scope) {

    inject(
      function($compile) {
        $ng_view = $compile(html)(scope);
      }
    );

    scope.$digest();
    directive_scope = $ng_view.isolateScope();

    return $ng_view;
  };

  beforeEach(
    function() {

      module('ui.router');
      module('angular-ui-view-spinner');

      module(
        function($stateProvider) {
          $stateProvider.state(
            'menu', {
              url: '/menu',
              template: '<div>menu</div>'
              /* no resolve */
            }
          ).state(
            'other', {
              url: '/other',
              template: '<div>menu</div>',
              resolve: asyncResolve
            }
          ).state(
            'menu.route1', {
              url: '/1',
              template: '<div>menu</div>',
              resolve: asyncResolve
            }
          ).state(
            'menu.route2', {
              url: '/2',
              template: '<div>menu</div>',
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

      var root_scope, scope, view, state, spy, q;
      var get_current_state, spinnerIsHidden, spinnerIsVisible, viewIsVisible;

      beforeEach(
        inject(
          function($rootScope, $state, $templateCache, $q) {

            q = $q;
            defer = $q.defer();
            scope = $rootScope.$new();
            state = $state;

            root_scope = $rootScope;

            get_current_state = function() {
              return state.current.name;
            };

            view = '<ui-loading-view root-state="menu"></ui-loading-view>';
            $ng_view = create_view(view, scope);

            spinnerIsHidden = function() {
              return $ng_view.find('.view-loading-spinner').hasClass('ng-hide');
            };

            viewIsVisible = function() {
              return !$ng_view.find('div[ui-view]').find('div[ui-view]').hasClass('ng-hide');
            };

            spinnerIsVisible = function() {
              return !spinnerIsHidden();
            };

            expect(spinnerIsHidden()).toBeTruthy();

            state.go('menu');
            scope.$digest();

            expect(spinnerIsHidden()).toBeTruthy();
          }
        )
      );

      it('should define the view spinner directive with isolated scope', function() {
        expect(directive_scope).toBeDefined();
      });

      it('should throw an error when specifying an incorrect size value', function() {
        view = '<ui-loading-view size="smallish"></ui-loading-view>';
        expect(function() {
          create_view(view, scope);
        }).toThrow();
      });

      it('should show the spinner when a new child route is being loaded', function() {

        expect(spinnerIsHidden()).toBeTruthy();

        state.go('menu.route1');
        scope.$digest();

        expect(spinnerIsVisible()).toBeTruthy();

        expect(state.current.name).not.toEqual('menu.route1');

        defer.resolve();
        scope.$digest();

        expect(viewIsVisible()).toBeTruthy();

        expect(state.current.name).toEqual('menu.route1');
      });

      it('should show the spinner when a new sibling route is being loaded', function() {

        state.go('menu.route1');

        defer.resolve();

        defer = q.defer();
        state.go('menu.route2');

        expect(state.current.name).not.toEqual('menu.route2');

        defer.resolve();
        scope.$digest();

        expect(viewIsVisible()).toBeTruthy();

        expect(state.current.name).toEqual('menu.route2');
      });

      it('should not show the spinner when a route not matching the rootState is triggered', function() {

        expect(spinnerIsHidden()).toBeTruthy();

        state.go('other');

        scope.$digest();

        expect(spinnerIsVisible()).toBeFalsy();

        defer.resolve();
        scope.$digest();

        expect(state.current.name).toEqual('other');
      });
    }
  );
})();
