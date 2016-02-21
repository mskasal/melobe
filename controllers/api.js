/**
 * Split into declaration and initialization for better startup performance.
 */
var _ = require('lodash');
var async = require('async');
var querystring = require('querystring');
var Github = require('octonode');
/**
 * GET /api/github
 * GitHub API Example.
 */

exports.userWatchlist = function(tokenData) {
  var token = _.find(tokenData, { kind: 'github' });
  var github = Github.client(token.accessToken);
  var list = []
  var page = 1;
  var getPage = function(page, callback) {
    github.get('/user/subscriptions', {'page':page,'per_page':100}, function (err, status, body, headers) {
        console.log('ilk - '+ page)
        list = _.concat(list, body)
      if(body.length === 100){
        console.log('girdi')
        getPage(++page, callback)
        console.log('son ' + page)
      }else{
        console.log('cikti')
        if (typeof callback === 'function')
          callback()
      }
    });
  }

  return getPage(page,function() {
    list = _.map(list,function(memo) {
      var newObj = {};
      var defaultSettings = {
        "merges": true,
        "comments": true,
        "pullRequestsClose": true,
        "pullRequestsOpen": true,
        "mentions": true
      }
      newObj.id = memo.id;
      newObj.name = memo.full_name;
      newObj.url = memo.html_url;
      newObj.type = (!memo.private) ? 'public':'private';
      newObj.settings = memo.settings || defaultSettings;
      return newObj;
    })

      return list;
  })
};
