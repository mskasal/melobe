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

    $scope.options = {
      isAllPublicSelected: false,
      isAllPrivateSelected: false,
      showToggleOptionsC: false,
      showToggleOptionsX: false
    };

    $scope.privateRepos = [];
    $scope.publicRepos = [];

    $scope.getRepos = function() {
      SettingsService.get().then(function(response) {
        $scope.repos = response.repos;
        response.repos.forEach(function(e, i) {
          console.log(e, i);
        });
      }, function(err) {
        console.log(err);
      });
    };

    $scope.repos = [{
      "name": "1 name",
      "id": "1",
      "url": "google.com",
      "type": "private",
      "settings": {
        "merges": true,
        "comments": true,
        "pullRequestsClose": true,
        "pullRequestsOpen": true,
        "mentions": true
      },
      "selected": false
    }, {
      "name": "2 name",
      "id": "2",
      "url": "google.com",
      "type": "public",
      "settings": {
        "merges": true,
        "comments": true,
        "pullRequestsClose": true,
        "pullRequestsOpen": true,
        "mentions": true
      },
      "selected": false
    }, {
      "name": "3 name",
      "id": "3",
      "url": "google.com",
      "type": "public",
      "settings": {
        "merges": true,
        "comments": true,
        "pullRequestsClose": true,
        "pullRequestsOpen": true,
        "mentions": true
      },
      "selected": false
    }, {
      "name": "4 name",
      "id": "4",
      "url": "google.com",
      "type": "private",
      "settings": {
        "merges": true,
        "comments": true,
        "pullRequestsClose": true,
        "pullRequestsOpen": true,
        "mentions": true
      },
      "selected": false
    }, {
      "name": "5 name",
      "id": "5",
      "url": "google.com",
      "type": "private",
      "settings": {
        "merges": true,
        "comments": true,
        "pullRequestsClose": true,
        "pullRequestsOpen": true,
        "mentions": true
      },
      "selected": false
    }];

    $scope.repos.forEach(function(e, i) {
      if (e.type === 'private') {
        $scope.privateRepos.push(e);
      } else {
        $scope.publicRepos.push(e);
      }
    });

    $scope.toggleAll = function(type) {
      var toggleStatus;

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

    $scope.save = function() {
      console.log($scope.repos);
    };
  }
})();
