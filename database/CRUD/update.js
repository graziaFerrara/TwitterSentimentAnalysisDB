/**
 * The function `updateTweet` updates a tweet in a database with the given tweet ID and parameters.
 * @param db - The "db" parameter is likely referring to a database object or connection that allows
 * you to interact with a database. It is used to perform operations such as finding and updating
 * documents in the "Tweets" collection.
 * @param tweet_id - The tweet_id parameter is the unique identifier of the tweet that needs to be
 * updated in the database.
 * @param params - The `params` parameter is a rest parameter, which means it can accept any number of
 * arguments. Each argument in `params` is expected to be a dictionary with the key being the field to
 * update and the value being the new value. For example, if you want to update the `text`
 * @returns 0 if the tweet is found and updated successfully, and 1 if the tweet is not found in the
 * database.
 */
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

/**
 * The function `updateTrend` updates a trend in a database with the given trend ID and parameters.
 * @param db - The "db" parameter is likely a reference to a database object or connection that allows
 * you to interact with a database. It is used to perform operations such as finding and updating
 * documents in the "Trends" collection.
 * @param trend_id - The trend_id parameter is the unique identifier of the trend that needs to be
 * updated in the database.
 * @param params - The `params` parameter is a rest parameter, which means it can accept any number of
 * arguments. Each argument in `params` is expected to be a dictionary with the key being the field to
 * update and the value being the new value.
 * @returns 0 if the trend is found and updated successfully, and 1 if the trend is not found in the
 * database.
 */
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

/**
 * The function updateUser takes in a database, user ID, and a variable number of parameters, and
 * updates the user's fields in the database based on the provided parameters.
 * @param db - The "db" parameter is likely a reference to a database object or connection that allows
 * you to interact with a database. It is used to perform operations such as finding and updating
 * documents in the "Users" collection.
 * @param user_id - The user_id parameter is the unique identifier of the user you want to update in
 * the database.
 * @param params - The `params` parameter is a rest parameter, which means it can accept any number of
 * arguments. Each argument in `params` is expected to be a dictionary with the key being the field to
 * update and the value being the new value. For example, if you want to update the name field of
 * @returns 0 if the user is found and the update is successful, and 1 if the user is not found.
 */
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

/**
 * The function `updateComment` updates the parameters of a comment in the comments array of a tweet in
 * a MongoDB database.
 * @param db - The "db" parameter is the database object that is used to interact with the database. It
 * is assumed to have a "Tweets" collection.
 * @param tweet_id - The ID of the tweet that contains the comment you want to update.
 * @param comment_id - The comment_id parameter is the unique identifier of the comment that needs to
 * be updated.
 * @param params - The `params` parameter is a variable number of objects that contain the updated
 * values for the comment. Each object in `params` should have the properties that need to be updated
 * in the comment.
 * @returns 0 if the tweet is found and the comment is successfully updated, and 1 if the tweet is not
 * found.
 */
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