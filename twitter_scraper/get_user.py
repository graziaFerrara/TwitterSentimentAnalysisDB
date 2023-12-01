import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from twitter_scraper import Twitter_scraper
import json
import sys

if __name__ == "__main__":

    # total arguments
    if (len(sys.argv) < 2):
        print("No arguments passed")
        print("Usage: python get_user.py <username> <password>")
        exit(0)

    username = sys.argv[1]
    password = sys.argv[2]

    scraper = Twitter_scraper(username, password)

    print("Seraching user...")
    user = scraper.search_user("elonmusk")
    print(user)

    scraper.close()

    