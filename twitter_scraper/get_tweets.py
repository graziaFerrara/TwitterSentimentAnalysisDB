from twitter_scraper import Twitter_scraper
import json
import sys

if __name__ == "__main__":

    # total arguments
    if (len(sys.argv) < 2):
        print("No arguments passed")
        print("Usage: python get_tweets.py <username> <password> <keyword> <num_tweets>")
        exit(0)

    username = sys.argv[1]
    password = sys.argv[2]

    scraper = Twitter_scraper(username, password)

    keyword = sys.argv[3]
    num_tweets = int(sys.argv[4])

    print("Getting tweets...")
    tweets_data = scraper.search(keyword, num_tweets)

    print("Saving tweets...")
    # save the tweets_data.json file
    with open("tweets_data.json", "w") as f:
        json.dump(tweets_data, f, indent=4)

    print("Done!")
    scraper.close()

    