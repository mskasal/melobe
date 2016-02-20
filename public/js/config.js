(function() {
  'use strict';

  angular
    .module('Melobe')
    .config(routerBlock);

  routerBlock.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routerBlock($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'js/views/home.html',
        controller: 'HomeCtrl'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/views/dashboard.html',
        controller: 'DashCtrl'
      });

    $urlRouterProvider.otherwise("/home");
  }
})();
