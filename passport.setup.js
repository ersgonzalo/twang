// there's already a passport sub-library that'll help us
// do OAuth with twitter
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('./user.model'),
	config = require('./config');

module.exports = function (passport) {
	// when a new user logs in, attach them
	// to the session
	passport.serializeUser(function (user, done) {
		// but only bother attaching the _id, no the whoe user
		done(null, user._id);
	});
	// each time a request comes in, use the _id from the session
	// data to attach the user to req.user
	passport.deserializeUser(function (id, done) {
		User.findById(id, done);
	});

	// passport syntax for implementing a strategy
	passport.use(new TwitterStrategy({
		// we need our app's "username"
		consumerKey: config.twitter.consumerId,
		// and our app's "password"
		consumerSecret: config.twitter.consumerSecret,
		callbackUrl: config.twitter.callbackUrl
	}, function (token, tokenSecret, profile, done) {
		// when the twitter data comes back
		// we'll always call `done` so that passport knows
		// to go on, and what user data to serialize
		User.findOne({'twitter.id': profile.id}, function (err, user) {
			if (err) done(err);
			// find an existing user from the database
			else if (user) done(null, user);
			else {
				// or create them if they don't yet exist
				// and attach any relevant twitter data
				// we want to save
				User.create({twitter: {
					token: token,
					tokenSecret: tokenSecret,
					id: profile.id,
					handle: profile.username
				}}, done);
			}
		});
	}));

	return passport;
};