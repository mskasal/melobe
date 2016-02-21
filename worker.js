var _ = require('lodash');
var Github = require('octonode');
var User = require('./models/User');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var winston = require('winston');
dotenv.load({
  path: '.env'
});

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});


/**
 * Notificatin sayfalama.
 */
var page = 1;


var getNotifications = function(page, callback) {
  global.github.get('/notifications', {'page':page,'per_page':50}, function (err, status, body, headers) {
      console.log('err - '+ err)
      console.log('ilk - '+ page)
      console.log('body - '+ headers)
      global.notifications = _.concat(global.notifications, body)
    if(body.length === 50 ){
      console.log('girdi')
      getNotifications(++page, callback)
      console.log('son ' + page)
    }else{
      console.log('cikti')
      if (typeof callback === 'function')
        callback()
    }
  });
}


/**
 * Notificatin Temizleme.
 */
var readNotification = function(url) {
  global.github.post(url, {}, function (err, status, body, headers) {
  	console.log(err)
  	console.log(body)
  });
}



User.find(function(err, users) {
	if (err) {
		process.exit(1)
	}

	users = _.map(users, function(memo) {
		var newObj = {};
		newObj._id = memo._id;
		newObj.repos = _.chain(memo.repos).map(function(memo, index) {
        	var filter = (memo.settings.merges == true &
							 memo.settings.comments ==  true &
							 memo.settings.pullRequests ==  true &
							 memo.settings.issues ==  true)
			if (!filter)
				return memo
		}).compact().keyBy('id').value();

		newObj.token = _.find(memo.tokens, { kind: 'github' }).accessToken;
		return newObj;
	})

	_.forEach(users, function(memo, index) {
		global.github = Github.client(memo.token);
		global.notifications = [];
		getNotifications(1, function() {
			// notifications
			var nList =_.chain(global.notifications)
			.map(function(n){
				var newObj = {};
				newObj.id = n.id;
				newObj.repoId = n.repository.id;
				newObj.type = n.subject.type;
				newObj.merged = n.subject.url == n.subject.latest_comment_url; //experimental
				newObj.url = n.url;
				return newObj;
			}).value()

			// notifications ucurmaca
			/*
			PullRequest
			Issue
			Comment
			*/
			
			_.forEach(nList, function(n, i) {
				var repo = memo.repos[n.repoId];
				//console.log(memo.repos , n.repoId)
				if(repo){
					if((n.type === 'Commit' && !repo.settings.comments) ||
					  	(n.type === 'PullRequest' && !repo.settings.pullRequests) ||
					 	(n.type === 'Issue' && !repo.settings.issues)){
						console.log(n.repoId,n.type,n.url)
						readNotification(n.url)
					}
				}else{
					//console.log(n.type)
				}
			})
			//console.log(nList)
		})

	});


	//console.log('user', JSON.stringify(users))
	//process.exit(0)
})