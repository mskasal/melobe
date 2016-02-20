(function() {
  'use strict';

  angular
    .module('Melobe')
    .controller('HomeCtrl', HomeCtrl)
    .controller('DashCtrl', DashCtrl);

  HomeCtrl.$inject = ['$scope'];

  function HomeCtrl($scope) {
    var vm = this;
  }

  DashCtrl.$inject = ['$scope', 'SettingsService'];

  function DashCtrl($scope, SettingsService) {
    var vm = this;
  }
})();
