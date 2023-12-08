db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

db.Trends.find({}).forEach(function (trend) {

    print("Trend: " + trend.name + "\n")

    trend.tweets.forEach(function (tweet) {

        toPrint = db.Tweets.findOne({ _id: tweet })

        if (toPrint != null) {

            print("\tTweet: " + toPrint.text + "\n")

            if (toPrint.comments != null) {

                toPrint.comments.forEach(function (comment) {

                    print("\t\tComment: " + comment.text + "\n")

                })
            }

            print("]\n")

        }

    })

})