/*
    3. TREND DIFFUSION DEGREE
    Given a certain trend, identify all the users who have published tweets that belong to it and based on their number of 
    followers identify how many people have been reached by the trend, as the sum of the number of followers (which is 
    clearly an approximation)
*/

function operation3(db, trendName, trendLocation, trendDate) {

    const trend = db.getCollection("Trends").findOne({
        name: trendName,
        location: trendLocation,
        date: trendDate
    });

    if (!trend) {
        return {
            error: "Trend not found"
        };
    }

    const tweetIds = trend.tweets;
    
    const comments = db.getCollection("Tweets").aggregate([
        {
            $match: {
                _id: {
                    $in: tweetIds
                }
            }
        },
        {
            $unwind: {
                path: '$comments'
            }
        }

    ]).toArray();

    ids = {};

    comments.forEach(element => {
        comment_user_id = element.comments.user_id;
        // if the user with tweet_user_id is in the Users collection, then add it to the ids
        // if the user with comment_user_id is in the Users collection, then add it to the ids
        user = db.getCollection("Users").findOne({ _id: comment_user_id });
        if (user) {
            ids[comment_user_id] = user.followers;
        }
    });

    tweetIds.forEach(element => {
        tweet_user_id = db.getCollection("Tweets").findOne({ _id: element }).user_id;
        user = db.getCollection("Users").findOne({ _id: tweet_user_id });
        if (user) {
            ids[tweet_user_id] = user.followers;
        }
    });
        
    var sum = 0;
    for (var key in ids) {
        sum += ids[key];
    }

    return {
        trendName: trendName,
        trendLocation: trendLocation,
        trendDate: trendDate,
        diffusionDegree: sum
    };
}

// Assuming the rest of your code remains unchanged
db = connect("localhost:27017");
db = db.getSiblingDB('Twitter');
trendName = "#Halloween";
trendLocation = "Italy";
trendDate = "2023-11-01T16:29:31.292726";

printjson(operation3(db, trendName, trendLocation, trendDate));
