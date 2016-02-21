var _ = require('lodash');
var Github = require('octonode');
var User = require('../models/User');

/**
 * GET /api/github
 * GitHub API Example.
 */

exports.getSettings = function(req, res, next) {
  var token = _.find(req.user.tokens, { kind: 'github' });
  var github = Github.client(token.accessToken);
  var repos = []
  var page = 1;
  var getPage = function(page, callback) {
    github.get('/user/subscriptions', {'page':page,'per_page':100}, function (err, status, body, headers) {
        console.log('err - '+ err)
        console.log('ilk - '+ page)
        console.log('body - '+ headers)
        repos = _.concat(repos, body)
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

  getPage(page,function() {
    //uniqBy
    User.findById(req.user.id, function(err, user) {

      var userRepo = user.repos;
      var user = {
        'name': user.profile.name,
        'picture': user.profile.picture,
        'location': user.profile.location,
        'website': user.profile.website
      }
      repos = _.map(repos,function(memo) {
        var defaultSettings = {
          "merges": true,
          "comments": true,
          "pullRequests": true,
          "issues": true
        }
        var newObj = {};
        newObj.id = memo.id;
        newObj.name = memo.full_name;
        newObj.url = memo.html_url;
        newObj.type = (!memo.private) ? 'public':'private';

        var settingsIndex = _.findIndex(userRepo, {'id':memo.id})
        if(settingsIndex !== -1){
          newObj.settings = userRepo[settingsIndex].settings;
          delete userRepo[settingsIndex];
        }else{
          newObj.settings = defaultSettings;
        }
        return newObj;
      })

      repos = _.concat(repos, _.compact(userRepo));
      res.json({
        'user':user,
        'repos':repos
      });
    });

  })
};

exports.updateSettings = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      res.json(err);
    }
    
    user.repos = req.body.repos;
    user.save(function(err) {
      if (err) {
        res.json(err);
      }
      res.json({ msg: 'Profile information updated.' });
    });
  });
};
