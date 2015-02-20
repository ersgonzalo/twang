var router = require('express').Router(),
	passport = require('passport');

// place this before any request handler
// it will run first, and either continue to 
// the following handler, or kick us over to 
// an error handling middleware
function isAuthenticated (req, res, next) {
	// if req.user exists, simply continue on
	// i.e. user is authenticated
	if (req.user) next();
	// otherwise
	else {
		// build a 401
		var err = new Error('Unauthorized');
		err.status = 401;
		// and kick it to the next error handling middleware
		// i.e. the user is not authenticated
		next(err);
	}
}

// because `isAuthenticated` sits just before our handler
// the handler will only run if the user is authenticated
router.get('/', isAuthenticated, function (req, res) {
	// only authenticated users get to witness the coolest
	res.sendFile(__dirname + '/theCoolest.html');
});

// again, the handler below will only manage to execute
// if the user is authenticated
router.get('/tweets/by/:handle', isAuthenticated, function (req, res, next) {
	// using our user-specific twitter client
	// get the tweets of the specified handle
	req.user.client.get('statuses/user_timeline', {
		screen_name: req.params.handle
	}, function (err, tweets) {
		if (err) return next(err);
		var leanTweets = tweets.map(function (tweet) {
			// extract the relevant info
			return {
				text: tweet.text,

			};
		});
		res.json(leanTweets);
	});
});

// if the user requests a login through twitter
// execute passport's twitter strategy
router.get('/auth/twitter', passport.authenticate('twitter'));

// if twitter sends us an authenticated user
// execute passport's twitter strategy
// afterwards, redirect to root
router.get('/auth/twitter/callback', passport.authenticate('twitter', function (req, res) {
	res.redirect('/');
}));

module.exports = router;