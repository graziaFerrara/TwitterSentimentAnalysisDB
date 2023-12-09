/**
 * The function checks if a trend already exists in the database and either returns 1 if it exists or
 * inserts the trend and returns 0 if it doesn't exist.
 * @param db - The "db" parameter is likely referring to a database object or connection that allows
 * you to interact with a database. It is used to perform operations such as finding and inserting
 * data.
 * @param trend - The "trend" parameter is an object that represents a trend. It likely contains
 * properties such as "_id" (the unique identifier for the trend) and other relevant information about
 * the trend.
 * @returns either 1 or 0. If the trend already exists in the database, it will return 1. If the trend
 * does not exist and is successfully inserted into the database, it will return 0.
 */
function createTrend(db, trend) {
    if (db.Trends.findOne({ _id: trend._id }) != null) {
        return 1
    } else {
        db.Trends.insertOne(trend)
        return 0
    }
}

/**
 * The function checks if a user already exists in the database and either returns 1 if the user exists
 * or inserts the user into the database and returns 0.
 * @param db - The "db" parameter is likely referring to a database object or connection that allows
 * you to interact with a database. It is used to perform operations such as finding and inserting
 * data.
 * @param user - The `user` parameter is an object that represents the user you want to create. It
 * should have an `_id` property that uniquely identifies the user.
 * @returns either 1 or 0. If the user with the given _id already exists in the database, it will
 * return 1. Otherwise, it will insert the user into the database and return 0.
 */
function createUser(db, user) {
    if (db.Users.findOne({ _id: user._id }) != null) {
        return 1
    } else {
        db.Users.insertOne(user)
        return 0
    }
}

/**
 * The function creates a tweet by checking if the trends and user exist in the database, and then
 * inserts the tweet into the Tweets collection and updates the user and trends collections with the
 * tweet's ID.
 * @param db - The "db" parameter is likely referring to a database object or connection that is used
 * to interact with a database. It is used to perform operations such as finding documents, inserting
 * documents, and updating documents in the database.
 * @param tweet - The `tweet` parameter is an object that represents a tweet. It contains the following
 * properties:
 * @returns either 1 or 0. If the length of the trends array does not match the length of the
 * tweet.trends array, or if the user is null, it will return 1. Otherwise, it will return 0.
 */
function createTweet(db, tweet) {

    const trends = db.Trends.find({ _id: { $in: tweet.trends } }).toArray()
    const user = db.Users.findOne({ _id: tweet.user_id })

    if (trends.length != tweet.trends.length) {
        return 1
    }

    if (user == null) {
        return 1
    }

    db.Tweets.insertOne(tweet)

    db.Users.updateOne(
        { _id: user._id },
        { $push: { tweets: tweet._id } }
    )

    db.Trends.updateMany(
        { _id: { $in: tweet.trends } },
        { $push: { tweets: tweet._id } }
    )

    return 0

}

/**
 * The function creates a comment and updates the corresponding tweet, user, and trends in the
 * database.
 * @param db - The "db" parameter is likely referring to a database object or connection that is used
 * to interact with a database. It is used to perform various database operations such as finding
 * documents, updating documents, and inserting documents.
 * @param comment - The `comment` parameter is an object that represents a comment. It contains
 * properties such as `user_id` (the ID of the user who made the comment) and `trends` (an array of
 * trend IDs associated with the comment).
 * @param tweet_id - The `tweet_id` parameter is the ID of the tweet to which the comment belongs.
 * @returns the value 1 in three different scenarios:
 * 1. If the number of trends found in the database does not match the number of trends in the comment.
 * 2. If the user with the specified user_id is not found in the database.
 * 3. If the tweet with the specified tweet_id is not found in the database.
 */
function createComment(db, comment, tweet_id) {

    const trends = db.Trends.find({ _id: { $in: comment.trends } }).toArray()
    const user = db.Users.findOne({ _id: comment.user_id })
    const tweet = db.Tweets.findOne({ _id: tweet_id })

    if (trends.length != comment.trends.length) {
        return 1
    }

    if (user == null) {
        return 1
    }

    if (tweet == null) {
        return 1
    }

    db.Tweets.updateOne(
        { _id: tweet._id },
        { $push: { comments: comment } }
    )

    db.Users.updateOne(
        { _id: user._id },
        { $push: { tweets: comment._id } }
    )

    db.Trends.updateMany(
        { _id: { $in: comment.trends } },
        { $push: { tweets: comment._id } }
    )
    
}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

today = new Date().toString();

const trend = {
    _id: "6543cb8f825f3a0c441ce76c",
    name: "AI",
    date: today,
    location: "Worldwide",
    url: "https://twitter.com/search?q=AI&src=typed_query"
}

const user = {
    _id: "6543cb92825f3a0c441ce76d",
    profile_name: "John Doe",
    username: "@johndoe",
    verified: false,
    bio: "I'm a programmer.",
    location: "Napoli",
    url: "johndoe.com",
    following: 192,
    followers: 2100000
}

const tweet = {
    _id: "6543cb95825f3a0c441ce76e",
    username: "@johndoe",
    name: "John Doe",
    text: "AI is the future.",
    replies: 0,
    retweets: 0,
    likes: 0,
    shares: 0,
    sentiment: 0.2,
    url: "https://twitter.com/johndoe/status/1",
    trends: [trend._id],
    user_id: user._id
}

const comment = {
    _id: "6543cb98825f3a0c441ce76f",
    username: "@johndoe",
    name: "John Doe",
    text: "I agree.",
    replies: 0,
    retweets: 0,
    likes: 0,
    shares: 0,
    sentiment: 0.2,
    url: "https://twitter.com/johndoe/status/1",
    trends: [trend._id],
    user_id: user._id
}

createTrend(db, trend)
createUser(db, user)
createTweet(db, tweet)
createComment(db, comment, tweet._id)

print("FIND TREND")
printjson(db.Trends.findOne({ _id: trend._id }))

print("FIND USER")
printjson(db.Users.findOne({ _id: user._id }))

print("FIND TWEET")
printjson(db.Tweets.findOne({ _id: tweet._id }))