(function() {

	/* mimics an asynchronous load of data for a view */
	var xhrDelay = 1200;

	'use strict';

	var app = angular.module(
		'example', ['angularSpinner', 'ui.router', 'angular-ui-view-spinner']
	);

	app.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider.state(
				'example', {
					url: '', //controller: 'ExampleCtrl',
					templateUrl: 'example.html'
				}
			).state(
				'example.one', {
					url: 'one', //controller: 'ExampleCtrl',
					templateUrl: 'example-one.html', resolve: {
						load: function($timeout) {
							return $timeout(angular.noop, xhrDelay);
						}
					}
				}
			).state(
				'example.two', {
					url: 'two', //controller: 'ExampleCtrl',
					templateUrl: 'example-two.html', resolve: {
						load: function($timeout) {
							return $timeout(angular.noop, xhrDelay);
						}
					}
				}
			).state(
				'example.two.a', {
					url: '/a', //controller: 'ExampleCtrl',
					templateUrl: 'example-two-a.html', resolve: {
						load: function($timeout) {
							return $timeout(angular.noop, xhrDelay);
						}
					}
				}
			).state(
				'example.two.b', {
					url: '/b', //controller: 'ExampleCtrl',
					templateUrl: 'example-two-b.html', resolve: {
						load: function($timeout) {
							return $timeout(angular.noop, xhrDelay);
						}
					}
				}
			);
		}]
	);
})();
