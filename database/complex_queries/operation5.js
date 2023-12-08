/*
    5. USER'S SENTIMENT PERCENTAGES
    Given a user, take the tweets he wrote and calculate the percentages of positive, negative and neutral sentiment tweets.
*/

function operation5(db, username){

    result = db.getCollection("Users").aggregate([

        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "Tweets",
                localField: "tweets",
                foreignField: "_id",
                as: "userTweets"
            }
        },
        {
            $unwind: "$userTweets"
        },
        {
            $group: {
                _id: "$_id",
                userTweets: { $push: "$userTweets" },
                positiveTweets: { $sum: { $cond: [{ $gt: ['$userTweets.sentiment', 0.2] }, 1, 0] } },
                neutralTweets: {
                    $sum: {
                        $cond: [{
                            $and: [{
                                $gte: [
                                    '$userTweets.sentiment', -0.2
                                ]
                            }, {
                                $lte: [
                                    '$userTweets.sentiment', 0.2
                                ]
                            }
                            ]
                        }, 1, 0]
                    }
                },
                negativeTweets: { $sum: { $cond: [{ $lt: ['$userTweets.sentiment', -0.2] }, 1, 0] } },
                totTweets: { $sum: 1 }
            }
        }, 
        // compute the percentages and return the precentages and the usename
        {
            $project: {
                _id: 0,
                username: username,
                positivePercentage: { $multiply: [{ $divide: ['$positiveTweets', '$totTweets'] }, 100] },
                neutralPercentage: { $multiply: [{ $divide: ['$neutralTweets', '$totTweets'] }, 100] },
                negativePercentage: { $multiply: [{ $divide: ['$negativeTweets', '$totTweets'] }, 100] }
            }
        }
    ])

    return result.toArray()[0]

}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

username = "@Ex_puppypaws"

printjson(operation5(db, username))