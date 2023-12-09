/**
 * The function "getTrendsByTweet" retrieves trends associated with a given tweet from a database.
 * @param db - The "db" parameter is likely referring to a database object or connection that allows
 * you to interact with a database. It is used to perform database operations such as finding documents
 * or records.
 * @param tweet_id - The `tweet_id` parameter is the unique identifier of a tweet in the database.
 * @returns an array of trends.
 */
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

/**
 * The function retrieves tweets associated with a given trend from a database.
 * @param db - The "db" parameter is likely referring to a database object or connection that allows
 * you to interact with a database. It is used to query the database for trends and tweets.
 * @param trend_id - The `trend_id` parameter is the unique identifier of a trend in the database. It
 * is used to retrieve the tweets associated with that trend.
 * @returns an array of tweets that are associated with a given trend.
 */
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

/**
 * The function retrieves tweets by a given user from a database.
 * @param db - The "db" parameter is likely referring to a database object or connection that allows
 * you to interact with a database. It is used to perform database operations such as finding documents
 * or records.
 * @param user_id - The user_id parameter is the unique identifier of the user whose tweets we want to
 * retrieve.
 * @returns an array of tweets.
 */
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

/**
 * The function retrieves a user from a database based on the tweet ID.
 * @param db - The "db" parameter is likely referring to a database object or connection that is used
 * to interact with a database. It is used to perform operations such as finding documents in
 * collections.
 * @param tweet_id - The tweet_id parameter is the unique identifier of a tweet in the database.
 * @returns the user object if it exists in the database, otherwise it is returning the value 1.
 */
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

/**
 * The function retrieves comments associated with a specific tweet from a database.
 * @param db - The "db" parameter is likely referring to a database object or connection that is used
 * to interact with a database. It is used to query the database and retrieve the necessary data.
 * @param tweet_id - The tweet_id parameter is the unique identifier of a tweet in the database. It is
 * used to retrieve the comments associated with that tweet.
 * @returns the comments associated with a given tweet. If the tweet is not found or if there are no
 * comments, it will return 1.
 */
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
