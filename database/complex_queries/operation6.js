/*
    6. ENGAGEMENT METRICS COMPUTATION
    For each trend, compute the average number of likes, shares and retweets that its posts have received
*/

function operation6(db){

    result = db.getCollection("Trends").aggregate([
        {
            $unwind: {
                path: '$tweets'
            }
        }, {
            $lookup: {
                from: 'Tweets',
                localField: 'tweets',
                foreignField: '_id',
                as: 'tweetsData'
            }
        }, {
            $unwind: {
                path: '$tweetsData'
            }
        }, 
        {
            $group: {
                _id: '$_id',
                name: {
                    '$first': '$name'
                },
                location: {
                    '$first': '$location'
                },
                date: {
                    '$first': '$date'
                },
                avgLikes: {
                    '$avg': '$tweetsData.likes'
                },
                avgShares: {
                    '$avg': '$tweetsData.shares'
                },
                avgRetweets: {
                    '$avg': '$tweetsData.retweets'
                }
            }
        }, {
            $project: {
                _id: 0,
                name: 1,
                location: 1,
                date: 1,
                avgLikes: 1,
                avgShares: 1,
                avgRetweets: 1
            }
        }
    ])

    res = []
    result.toArray().forEach(function (trend) {
        res.push(trend)
    })
    return res
}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

printjson(operation6(db))