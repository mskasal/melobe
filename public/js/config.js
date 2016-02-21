(function() {
  'use strict';

  angular
    .module('Melobe')
    .config(routerBlock);

  routerBlock.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function routerBlock($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashCtrl'
      });

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/home");
  }
})();
