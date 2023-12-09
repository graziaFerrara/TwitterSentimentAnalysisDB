function getTrendsByTweet(db, tweet_id) {
    var tweet = db.Tweets.findOne({_id: tweet_id});
    if (tweet == null) {
        return 1;
    }
    trends_id = tweet.trends;
    if (trends_id == null) {
        return 1;
    }
    trends = [];
    trends_id.forEach(trend_id => {
        trend = db.Trends.findOne({_id: trend_id});
        if (trend == null) {
            return 1;
        }
        trends.push(trend);
    });
    return trends;
}

function getTweetsByTrend(db, trend_id) {
    var trend = db.Trends.findOne({_id: trend_id});
    if (trend == null) {
        return 1;
    }
    tweets_id = trend.tweets;
    if (tweets_id == null) {
        return 1;
    }
    tweets = [];
    tweets_id.forEach(tweet_id => {
        tweet = db.Tweets.findOne({_id: tweet_id});
        if (tweet == null) {
            return 1;
        }
        tweets.push(tweet);
    });
    return tweets;
}

function getTweetsByUser(db, user_id) {
    var user = db.Users.findOne({_id: user_id});
    if (user == null) {
        return 1;
    }
    tweets_id = user.tweets;
    if (tweets_id == null) {
        return 1;
    }
    tweets = [];
    tweets_id.forEach(tweet_id => {
        tweet = db.Tweets.findOne({_id: tweet_id});
        if (tweet == null) {
            return 1;
        }
        tweets.push(tweet);
    });
    return tweets;
}

function getUserByTweet(db, tweet_id) {
    var tweet = db.Tweets.findOne({_id: tweet_id});
    if (tweet == null) {
        return 1;
    }
    user_id = tweet.user_id;
    if (user_id == null) {
        return 1;
    }
    user = db.Users.findOne({_id: user_id});
    if (user == null) {
        return 1;
    }
    return user;
}

function getCommentsByTweet(db, tweet_id) {
    var tweet = db.Tweets.findOne({_id: tweet_id});
    if (tweet == null) {
        return 1;
    }
    comments = tweet.comments;
    if (comments == null) {
        return 1;
    }
    return comments;
}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

tweet_id = "6543cb95825f3a0c441ce76e"
trend_id = "6543cb8f825f3a0c441ce76c"
user_id = "6543cb92825f3a0c441ce76d"
comment_id = "6543cb98825f3a0c441ce76f"

print("Trends by tweet:")
print(getTrendsByTweet(db, tweet_id))
print("Tweets by trend:")
print(getTweetsByTrend(db, trend_id))
print("Tweets by user:")
print(getTweetsByUser(db, user_id))
print("User by tweet:")
print(getUserByTweet(db, tweet_id))
print("Comments by tweet:")
print(getCommentsByTweet(db, tweet_id))
