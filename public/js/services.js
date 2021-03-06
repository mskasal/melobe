(function() {
  'use strict';

  angular
    .module('Melobe')
    .service('SettingsService', SettingsService);

  SettingsService.$inject = ['$q', '$http'];

  function SettingsService($q, $http) {
    var get = function() {
      return $q(function(resolve, reject) {
        $http.get('/api/settings')
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
        $http.put('/api/settings', settingsData, {
            headers: {
              'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
            }
          })
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
