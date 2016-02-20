(function() {
  'use strict';

  angular
    .module('Melobe')
    .service('SettingsService', SettingsService);

  SettingsService.$inject = ['$q', '$http'];

  function SettingsService($q, $http) {
    var get = function() {
      return $q(function(resolve, reject) {
        $http.get(HOST_URLS.api + '/settings')
          .success(function(data, status, headers, config) {
            resolve(data);
          })
          .error(function(data, status, headers, config) {
            reject(data);
          });
      });
    };

    var post = function(settingsData) {
      return $q(function(resolve, reject) {
        $http.put(HOST_URLS.api + '/settings', settingsData)
          .success(function(data, status, headers, config) {
            resolve(data);
          })
          .error(function(data, status, headers, config) {
            reject(data);
          });
      });
    };

    return {
      get: get,
      post: post
    };
  }
})();
