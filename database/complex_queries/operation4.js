/*
    4. USER COHERENCE SCORE
    For each user, group the tweets he wrote by the trends in the trends array and, for each cluster, assign the user a coherence score, 
    average the scores obtained 
*/

function operation4() {

    userScore = {};

    const users = db.getCollection('Users').find({});

    users.forEach(user => {

        // get all the tweets written by the user
        tweets = db.getCollection('Tweets').find({ user_id: user._id });

        // group the tweets by trends
        tweetsByTrend = {};
        tweets.forEach(tweet => {
            var trends = tweet.trends;
            trends.forEach(trend => {
                if (tweetsByTrend[trend]) {
                    tweetsByTrend[trend].push(tweet);
                } else {
                    tweetsByTrend[trend] = [tweet];
                }
            });
        });

        // for each trend, calculate the coherence score
        var scores = {};
        for (var trend in tweetsByTrend) {
            tweets = tweetsByTrend[trend];
            var sum = 0;
            tweets.forEach(tweet => {
                sum += tweet.sentiment;
            });
            avg = tweets.length > 0 ? sum / tweets.length : 0;
            scores[trend] = avg;
        }

        // average the scores obtained
        var sum = 0;
        for (var key in scores) {
            sum += scores[key];
        }

        userScore[user.username] = Object.values(scores).length > 0 ? sum / Object.values(scores).length : 0;

    });

    // min max normalization of the scores
    var min = Math.min(...Object.values(userScore));
    var max = Math.max(...Object.values(userScore));
    for (var key in userScore) {
        userScore[key] = (userScore[key] - min) / (max - min) * 100;
    }

    return userScore;

}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

printjson(operation4())