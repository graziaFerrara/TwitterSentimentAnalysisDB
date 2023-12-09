function createTrend(db, trend) {
    if (db.Trends.findOne({ _id: trend._id }) != null) {
        return 1
    } else {
        db.Trends.insertOne(trend)
        return 0
    }
}

function createUser(db, user) {
    if (db.Users.findOne({ _id: user._id }) != null) {
        return 1
    } else {
        db.Users.insertOne(user)
        return 0
    }
}

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