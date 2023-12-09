function updateTweet(db, tweet_id, ...params) {

    tweet = db.Tweets.findOne({ _id: tweet_id })

    if (tweet == null) {

        return 1

    } else {

        params.forEach(param => {

            // params contains a dictionary with the key being the field to update and the value being the new value
            // e.g. { text: "new text" }
            db.Tweets.updateOne(
                { _id: tweet_id },
                { $set: param }
            )

        })

    }

    return 0

}

function updateTrend(db, trend_id, ...params) {

    trend = db.Trends.findOne({ _id: trend_id })

    if (trend == null) {

        return 1

    } else {

        params.forEach(param => {

            // params contains a dictionary with the key being the field to update and the value being the new value
            // e.g. { name: "new name" }
            db.Trends.updateOne(
                { _id: trend_id },
                { $set: param }
            )

        })

    }

    return 0

}

function updateUser(db, user_id, ...params) {

    user = db.Users.findOne({ _id: user_id })

    if (user == null) {

        return 1

    } else {

        params.forEach(param => {

            // params contains a dictionary with the key being the field to update and the value being the new value
            // e.g. { name: "new name" }
            db.Users.updateOne(
                { _id: user_id },
                { $set: param }
            )

        })

    }

    return 0

}

function updateComment(db , tweet_id, comment_id, ...params) {

    tweet = db.Tweets.findOne({ _id: tweet_id })

    if (tweet == null) {

        return 1

    } else {

        // update the params of the comment in the comments array of the tweet
        params.forEach(param => {

            // pull the comment from the array
            comment = tweet.comments.find(comment => comment._id == comment_id)

            // push the comment with the updated params to the array
            for (var key in param) {
                comment[key] = param[key]
            }

            // insert the updated comment into the tweet, replacing the old comment
            db.Tweets.updateOne(
                { _id: tweet_id },
                { $pull: { comments: { _id: comment_id } } }
            )

            db.Tweets.updateOne(
                { _id: tweet_id },
                { $push: { comments: comment } }
            )

        })

    }

    return 0

}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

tweet_id = "6543cb95825f3a0c441ce76e"
trend_id = "6543cb8f825f3a0c441ce76c"
user_id = "6543cb92825f3a0c441ce76d"
comment_id = "6543cb98825f3a0c441ce76f"

updateTweet(db, tweet_id, { text: "new text" })
updateComment(db, tweet_id, comment_id, { text: "new text" })
updateTrend(db, trend_id, { name: "new name" })
updateUser(db, user_id, { username: "new name" })

print("FIND TREND")
trend = db.Trends.findOne({ _id: trend_id })
printjson(trend)
print("FIND TWEET")
tweet = db.Tweets.findOne({ _id: tweet_id })
printjson(tweet)
print("FIND USER")
user = db.Users.findOne({ _id: user_id })
printjson(user)