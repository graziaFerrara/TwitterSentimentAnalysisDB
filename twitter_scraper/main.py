from twitter_scraper import Twitter_scraper
from bson.objectid import ObjectId
from textblob import TextBlob
from datetime import datetime
import json
import sys

def get_sentiment(text):
    """
    The function `get_sentiment` takes in a text as input and returns the sentiment polarity of the text
    using the TextBlob library.
    
    :param text: The "text" parameter is a string that represents the text for which you want to
    determine the sentiment. It can be any piece of text, such as a sentence, a paragraph, or a document
    :return: The sentiment polarity of the given text.
    """
    blob = TextBlob(text)
    return blob.sentiment.polarity

def manage_users(users, tweet):
    """
    The function "manage_users" manages a dictionary of users and their tweets, adding new users and
    their tweets if they don't already exist, and recursively adding comments to the appropriate user
    and tweet.
    
    :param users: The `users` parameter is a dictionary that stores information about users. Each user
    is identified by their username, and the value associated with each username is a dictionary
    containing user information
    :param tweet: The "tweet" parameter is a dictionary that represents a tweet. It contains information
    such as the username of the user who posted the tweet, the text of the tweet, and any comments
    associated with the tweet
    """

    if tweet["username"] not in users:

        user = scraper.search_user(tweet["username"])
        user["_id"] = ObjectId()
        user_id = user["_id"]
        users[tweet["username"]] = user
    
    else:

        user_id = users[tweet["username"]]["_id"]
        user = users[tweet["username"]]

    tweet["user_id"] = user_id

    if "tweets" not in user:
        user["tweets"] = [tweet["_id"]]
    else:
        user["tweets"].append(tweet["_id"])

    # recursively get all the comments
    if "comments" in tweet:

        for comment in tweet["comments"]:

            comment["_id"] = ObjectId()
            comment["sentiment"] = get_sentiment(comment["text"])

            manage_users(users, comment)


if __name__ == "__main__":

    # total arguments
    if (len(sys.argv) < 2):
        print("No arguments passed")
        print("Usage: python main.py <username> <password>")
        exit(0)

    username = sys.argv[1]
    password = sys.argv[2]

    users = {}

    scraper = Twitter_scraper(username, password)
    scraper.set_max_comments(5)

    # get all the current trends
    trends = scraper.search_trends()

    # get all the tweets for each trend
    for trend in trends:

        trend["_id"] = ObjectId()

        # search all the tweets for that trend
        trend_name = trend["name"]
        print("Getting tweets for {}...".format(trend_name))
        tweets = scraper.search_for_trend(trend_name, 10)

        for tweet in tweets:

            tweet["_id"] = ObjectId()

            # check if tweet has the trends array
            if "trends" not in tweet:
                tweet["trends"] = [trend["_id"]]
            else:
                tweet["trends"].append(trend["_id"])

            # check if the trend has the tweets array
            if "tweets" not in trend:
                trend["tweets"] = [tweet["_id"]]
            else:
                trend["tweets"].append(tweet["_id"])

            # get the sentiment of the tweet
            tweet["sentiment"] = get_sentiment(tweet["text"])

            # get the user of the tweet
            print("Getting users...")
            manage_users(users, tweet)

        print("Saving tweets...")
        # save the tweets for the trend in a json file
        with open("database/data/tweets/tweets_{}_{}.json".format(trend_name, datetime.now().isoformat()), "w") as f:
            json.dump(tweets, f, indent=4, default=str)

    date = datetime.now()

    print("Saving users...")
    # save the users for the trend in a json file
    with open("database/data/users/users_{}.json".format(date), "w") as f:
        json.dump(list(users.values()), f, indent=4, default=str)

    print("Saving trends...")
    # save the trends.json file with all the ObjectId's converted to strings defining a default function
    with open("database/data/trends/trends_{}.json".format(date), "w") as f:
        json.dump(trends, f, indent=4, default=str)
    
    print("Done!")
    scraper.close()