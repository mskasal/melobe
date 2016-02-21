(function() {
  'use strict';

  angular
    .module('Melobe')
    .config(routerBlock);

  routerBlock.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routerBlock($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashCtrl'
      })
      .state('auth', {
        url: '/auth/github',
        templateUrl: 'views/auth.html',
        controller: function() {
          window.location.pathname = '/auth/github';
        }
      });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/login");
  }
})();
