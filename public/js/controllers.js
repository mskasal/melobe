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

  DashCtrl.$inject = ['$scope', 'SettingsService', '$timeout'];

  function DashCtrl($scope, SettingsService, $timeout) {
    var vm = this;
    $scope.profile = {};
    $scope.isLoading = true;
    $scope.saveButtonLoading = false;
    $scope.alert = {};
    $scope.options = {
      isAllPublicSelected: false,
      isAllPrivateSelected: false,
      showToggleOptionsC: false,
      showToggleOptionsX: false,
      onPrivate: true,
      onPublic: false
    };

    $scope.privateRepos = [];
    $scope.privateReposDefault = [];

    $scope.publicRepos = [];
    $scope.publicReposDefault = [];

    $timeout(function() {
      $('li.uib-tab').click(function() {
        var tabname = $(this).attr('data-tab-name');
        if (tabname === 'private-tab') {
          $timeout(function() {
            $scope.options.onPrivate = true;
            $scope.options.onPublic = false;
          }, 10);
        } else if (tabname === 'public-tab') {
          $timeout(function() {
            $scope.options.onPrivate = false;
            $scope.options.onPublic = true;
          }, 10);
        }
        console.log($scope.options.onPrivate, tabname, $scope.options.onPublic, tabname);
      });
    }, 300);

    $scope.getRepos = function() {
      SettingsService.get().then(function(response) {
        $scope.repos = response.repos;
        $scope.profile = response.user;
        response.repos.forEach(function(e, i) {
          e.selected = false;
          if (e.type === 'private') {
            $scope.privateRepos.push(e);
          } else {
            $scope.publicRepos.push(e);
          }
          if (i === (response.repos.length - 1)) {
            $scope.isLoading = false;
            angular.copy($scope.privateRepos, $scope.privateReposDefault);
            angular.copy($scope.publicRepos, $scope.publicReposDefault);
          }
        });
      }, function(err) {
        $scope.isLoading = false;
        $scope.error = err;
      });
    };

    $scope.toggleAll = function(type) {
      var toggleStatus;
      angular.element('.toggle-all-options').prop('checked', false);
      if (type === 'public') {
        toggleStatus = $scope.options.isAllPublicSelected;
        angular.forEach($scope.publicRepos, function(itm, index) {
          if (itm.type === type) {
            itm.selected = toggleStatus;
          }
          if (index === ($scope.publicRepos.length - 1)) {
            controlChechbox(type, true);
          }
        });
      } else if (type === 'private') {
        toggleStatus = $scope.options.isAllPrivateSelected;
        angular.forEach($scope.privateRepos, function(itm, index) {
          if (itm.type === type) {
            itm.selected = toggleStatus;
          }

          if (index === ($scope.privateRepos.length - 1)) {
            controlChechbox(type, true);
          }
        });
      }
    };

    $scope.toggleAllOptions = function(option, type, event) {
      if (type === 'public') {
        $scope.publicRepos.forEach(function(e, i) {
          if (e.selected) {
            e.settings[option] = event.target.checked;
          }
        });
      } else if (type === 'private') {
        $scope.privateRepos.forEach(function(e, i) {
          if (e.selected) {
            e.settings[option] = event.target.checked;
          }
        });
      }
    };

    $scope.optionToggled = function(type, repo) {
      type = repo.type;
      controlChechbox(type);

      if (type === 'public') {
        $scope.options.isAllPublicSelected = $scope.publicRepos.every(function(itm) {
          return (itm.selected);
        });
      } else if (type === 'private') {
        $scope.options.isAllPrivateSelected = $scope.privateRepos.every(function(itm) {
          return (itm.selected);
        });
      }
    };

    function controlChechbox(type) {
      if (arguments[1]) {
        if (type === 'public') {
          if (angular.element('.repoC-select:checked').length === 0) {
            $scope.options.showToggleOptionsC = true;
          } else {
            $scope.options.showToggleOptionsC = false;
          }
        } else if (type === 'private') {
          if (angular.element('.repoX-select:checked').length === 0) {
            $scope.options.showToggleOptionsX = true;
          } else {
            $scope.options.showToggleOptionsX = false;
          }
        }
      } else {
        if (type === 'public') {
          if (angular.element('.repoC-select:checked').length > 0) {
            $scope.options.showToggleOptionsC = true;
          } else {
            $scope.options.showToggleOptionsC = false;
          }
        } else if (type === 'private') {
          if (angular.element('.repoX-select:checked').length > 0) {
            $scope.options.showToggleOptionsX = true;
          } else {
            $scope.options.showToggleOptionsX = false;
          }
        }
      }
    }

    $scope.restoreDefaultPublic = function() {
      $scope.publicRepos = [];
      angular.copy($scope.publicReposDefault, $scope.publicRepos);
      angular.element('.select-all-public').prop('checked', false);
    };

    $scope.restoreDefaultPrivate = function() {
      $scope.privateRepos = [];
      angular.copy($scope.privateReposDefault, $scope.privateRepos);
      angular.element('.select-all-private').prop('checked', false);
    };

    $scope.save = function() {
      $scope.saveButtonLoading = true;

      var repos = $scope.privateRepos.concat($scope.publicRepos);
      var settingsData = {
        repos: repos
      };
      SettingsService.post(settingsData)
        .then(function() {
          saveSuccess();
        }, function(err) {
          saveError();
        });
    };

    $scope.alerts = {
      fail: {
        type: 'danger',
        msg: 'Oh snap!'
      },
      success: {
        type: 'success',
        msg: 'Well done!'
      }
    };

    $scope.closeAlert = function() {
      $scope.alert = {};
    };

    function saveSuccess() {
      $scope.publicRepos.forEach(function(e, i) {
        e.selected = false;
      });
      $scope.privateRepos.forEach(function(e, i) {
        e.selected = false;
      });

      angular.element('.toggle-all-options').prop('checked', false);
      angular.element('.select-all').prop('checked', false);

      $scope.alert = $scope.alerts.success;
      $scope.privateReposDefault = [];
      $scope.publicReposDefault = [];
      angular.copy($scope.privateRepos, $scope.privateReposDefault);
      angular.copy($scope.publicRepos, $scope.publicReposDefault);

      $timeout(function() {
        $scope.saveButtonLoading = false;
        // angular.element('.repo-select').prop('checked', false);
      }, 800);
    }

    function saveError() {
      $scope.alert = $scope.alerts.fail;
      $timeout(function() {
        $scope.saveButtonLoading = false;
      }, 800);
    }

    $scope.getRepos();
  }
})();
