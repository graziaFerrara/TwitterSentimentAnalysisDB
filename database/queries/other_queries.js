var fs = require('fs');

// Get the eldest user registered in the Users collection of the Twitter database.
function getEldestUser(db){

    users = db.Users.find({}).sort({"joined_date": 1}).toArray()
    users.sort(function (a, b) {
        return a.age - b.age
    })

    return {username: users[0].username, joined_date: users[0].joined_date}

}

// Get the k most shared tweets in the Tweets collection of the Twitter database.
function getMostSharedTweets(db, k){

    tweets = db.Tweets.find({}).sort({shares: -1}).limit(k).toArray()

    tweets.sort(function (a, b) {
        return b.shares - a.shares
    })

    res = []

    for (tweet in tweets) {
        res.push({text: tweets[tweet].text, shares: tweets[tweet].shares})
    }

    return res

}

// Get the trends for which more than k tweets have been written
function getPopularTrends(db, minTweets){

    trends = db.Trends.find({}).toArray()

    trends.sort(function (a, b) {
        return b.tweets.length - a.tweets.length
    })

    trends = trends.filter(function (trend) {
        return trend.tweets.length > minTweets
    })

    res = []    

    trends.map(function (trend) {
        return {name: trend.name, location: trend.location, date: trend.date, tweets: trend.tweets.length}
    })

    for (trend in trends) {
        res.push({name: trends[trend].name, location: trends[trend].location, date: trends[trend].date, tweets: trends[trend].tweets.length})
    }

    return res.slice(0, minTweets)

}

// Get the most popular users in the Users collection of the Twitter database given a minimum threshold of followers.
function getPopularUsers(db, minFollowers){

    users = db.Users.find({}).sort({"followers": -1}).toArray()

    users = users.filter(function (user) {
        return user.followers > minFollowers
    })

    users.map(function (user) {
        return {username: user.username, followers: user.followers, tweets: user.tweets.length}
    })

    res = []

    for (user in users) {
        res.push({username: users[user].username, followers: users[user].followers, tweets: users[user].tweets.length})
    }

    return res

}

function executionTime(operation) {
    var start = new Date();
    operation.operation(...operation.parameters)
    var end = new Date() - start;
    // convert ms to s
    return end / 1000;
}

function convertArrayOfObjectsToCSV(data) {
    var header = Object.keys(data[0]).join(',');
    var csv = data.map(row =>
        Object.values(row).map(value => JSON.stringify(value)).join(',')
    );
    csv.unshift(header);
    return csv.join('\n');
}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

operations = [
    {
        name: "GET ELDEST USER",
        operation: getEldestUser,
        parameters: [db]
    },
    {
        name: "GET MOST SHARED TWEETS",
        operation: getMostSharedTweets,
        parameters: [db, 10]
    },
    {
        name: "GET POPULAR TRENDS",
        operation: getPopularTrends,
        parameters: [db, 5]
    },
    {
        name: "GET POPULAR USERS",
        operation: getPopularUsers,
        parameters: [db, 10000]
    }
]

if (!PERFORMANCES) {

    operations.forEach(operation => {
        print(operation.name);
        printjson(operation.operation(...operation.parameters));
    });

} else {

    executions = [];
    time = 0;
    operations.forEach(operation => {
        for (i = 0; i < NUM_TESTS; i++) {
            time += executionTime(operation);
        }
        executions.push({
            operation: operation.name,
            time: time / NUM_TESTS
        });
        time = 0;
    });

    fs.writeFile('performances/other_queries_performances.csv', convertArrayOfObjectsToCSV(executions), function (err) {
        if (err) return console.log(err);
    });

}
