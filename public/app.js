// console.log("Blah is here!");

var app = angular.module('Twang', []);

app.controller('TweetSearcher', function($scope, TweetFactory){

	var setTweets = function(tweetsReturned){
		$scope.tweets = tweetsReturned;
	};

	$scope.submitHandle = function(uHandle){
		TweetFactory.getMyTweets(uHandle).then(setTweets);
	}

	//TweetFactory.getMyTweets().then(setTweets);
});


app.controller('Namer', function($scope, TweetFactory){
	var namer = function(nameReturned){
		$scope.name = nameReturned[0].name;
		$scope.imgSrc = nameReturned[0].imageUrl;
	}
	TweetFactory.getMyTweets().then(namer)
});

app.factory('TweetFactory', function($http){
	return{
		getMyTweets: function(handle){

			var queryStringParams = {};

			if(handle){
				queryStringParams.handle = handle;
			}

			return $http.get('/tweets', {params: queryStringParams}).then(function(response){
				return response.data;
			});
		}
	}
});

app.directive('tweetDisplay', function(){
	return{
		restrict: 'E',
		scope: {
			oneTweet: '=' //camel casing also affects the scope
		},
		templateUrl: '/tweets.html'
	}

});

app.directive('sunGlasses', function(){
	return{
		restrict: 'E',
		templateUrl: '/sunglesses/theCoolest.html'
	}
});