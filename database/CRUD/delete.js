function deleteTweet(tweet_id) {

    tweet = db.Tweets.findOne({ _id: tweet_id })

    if (tweet == null) {

        return 1

    } else {

        // find the user who wrote the tweet and remove the id of this tweet from his/her tweets array
        db.Users.updateOne(
            { _id: tweet.user_id },
            { $pull: { tweets: tweet._id } }
        )

        tweet.trends.forEach(trend => {
            // find the trend related to the tweet and remove the id of this tweet from its tweets array
            db.Trends.updateOne(
                { _id: trend },
                { $pull: { tweets: tweet._id } }
            )
        })

        db.Tweets.deleteOne(
            { _id: tweet._id }
        )

        return 0

    }
}

function deleteTrend(trend_id) {

    trend = db.Trends.findOne({ _id: trend_id })

    if (trend == null) {

        return 1

    } else {

        if (trend.tweets == null) {

            return 1

        } else {

            trend.tweets.forEach(tweet_id => {

                tweets = db.Tweets.find({ _id: tweet_id })

                tweets.forEach(tweet => {
                    db.Users.updateOne(
                        { _id: tweet.user_id },
                        { $pull: { tweets: tweet._id } }
                    )
                })

                db.Tweets.deleteOne(
                    { _id: tweet_id }
                )

            })

        }

        db.Trends.deleteOne({ _id: trend_id })

        return 0

    }

}

function deleteUser(user_id) {

    user = db.Users.findOne({ _id: user_id })

    if (user == null) {

        return 1

    } else {

        if (user.tweets == null) {

            return 1

        } else {

            user.tweets.forEach(tweet_id => {

                tweets = db.Tweets.find({ _id: tweet_id })

                tweets.forEach(tweet => {

                    tweet.trends.forEach(trend_id => {
                        db.Trends.updateOne(
                            { _id: trend_id },
                            { $pull: { tweets: tweet._id } }
                        )
                    })

                    db.Tweets.deleteOne(
                        { _id: tweet._id }
                    )
                })

            })
        }

    }

    db.Users.deleteOne(
        { username: user.username }
    )

    return 0

}

function deleteComment(tweet_id, comment_id) {
    
    tweet = db.Tweets.findOne({ _id: tweet_id })

    if (tweet == null) {

        return 1

    } else {

        if (tweet.comments == null) {

            return 1

        } else {

            // remove from the Tweets collection the comment embedded in the comments array of the tweet with the given id
            db.Tweets.updateOne(
                { _id: tweet_id },
                { $pull: { comments: { _id: comment_id } } }
            )

            // remove the comment id from the tweets array of the trend the tweet belongs to
            tweet.trends.forEach(trend_id => {
                db.Trends.updateOne(
                    { _id: trend_id },
                    { $pull: { tweets: comment_id } }
                )
            })

            // remove the comment id from the comments array of the user who wrote the tweet
            db.Users.updateOne(
                { _id: tweet.user_id },
                { $pull: { tweets: comment_id } }
            )

        }

    }

    return 0

}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

tweet_id = "6543cb95825f3a0c441ce76e"
trend_id = "6543cb8f825f3a0c441ce76c"
user_id = "6543cb92825f3a0c441ce76d"
comment_id = "6543cb98825f3a0c441ce76f"

deleteComment(tweet_id, comment_id)
deleteTweet(tweet_id)
deleteTrend(trend_id)
deleteUser(user_id)

print("FIND TREND")
printjson(db.Trends.findOne({ _id: trend._id }))

print("FIND USER")
printjson(db.Users.findOne({ _id: user._id }))

print("FIND TWEET")
printjson(db.Tweets.findOne({ _id: tweet._id }))

