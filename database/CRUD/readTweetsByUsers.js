
db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

db.Users.find({}).forEach(function (user) {

    print("User: " + user.username + "\n")

    user.tweets.forEach(function (tweet) {

        toPrint = db.Tweets.findOne({ _id: tweet })

        if (toPrint != null) {

            print("\tTweet: " + toPrint.text + "\n")

        }

    })

})

