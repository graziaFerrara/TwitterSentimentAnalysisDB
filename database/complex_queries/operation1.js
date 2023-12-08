/*
    1. AVERAGE SENTIMENT PER TREND
    For each trend, select all the tweets associated with the trend and show the
    sentiment obtained as the average of the sentiment of the selected tweets.
*/

function operation1(db) {

    trends = db.getCollection('Trends').find({});

    results = [];

    trends.forEach(function (trend) {

        result = db.getCollection('Trends').aggregate([
            {
                $match: {
                    name: trend.name,
                    location: trend.location,
                    date: trend.date
                }
            }, {
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
            }, {
                $group: {
                    _id: {
                        name: '$name',
                        location: '$location',
                        date: '$date'
                    },
                    sentiment: {
                        $avg: '$tweetsData.sentiment'
                    }
                }
            },{
                $project: {
                    _id: 0,
                    name: '$_id.name',
                    location: '$_id.location',
                    date: '$_id.date',
                    sentiment: 1
                }
            }
        ]);

        results.push(result.toArray()[0]);

    });

    return results;

}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

printjson(operation1(db));





