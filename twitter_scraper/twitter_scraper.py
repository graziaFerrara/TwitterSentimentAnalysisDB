import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
parent_dir = os.path.abspath(os.path.join(parent_dir, os.pardir))
sys.path.append(parent_dir)

from scraper import Scraper
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tqdm import tqdm
import re
import time
import datetime

# The Twitter_scraper class is a subclass of the Scraper class.
class Twitter_scraper(Scraper):

    def __login(self):
        """
        The above function is used to login to Twitter using a provided username and password.
        """

        self.get_page("https://twitter.com/login")
        try:
            # wait for the login page to load
            username_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "text"))
            )
            username_input.send_keys(self.username)
        except:
            raise Exception("Error: username")
        try:
            next_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable(
                    (By.XPATH, '//div[@role="button" and .//span[text()="Next"]]'))
            )
            next_button.click()
            time.sleep(2)
        except:
            raise Exception("Error: next button")
        try:
            # wait for the login page to load
            password_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.NAME, "password"))
            )
            password_input.send_keys(self.password)
        except:
            raise Exception("Error: password")
        try:
            login_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, '[data-testid="LoginForm_Login_Button"]'))
            )
            login_button.click()
            print("Login successful")
            time.sleep(2)
            self.get_page("https://twitter.com/home")
        except:
            raise Exception("Error: login button")
        
        time.sleep(10)

    def __init__(self, username, password):
        """
        The function initializes an object with username, password, and other settings, and then calls a
        private login method.
        
        :param username: The `username` parameter is used to store the username of the user. It is passed as
        an argument to the `__init__` method when creating an instance of the class
        :param password: The `password` parameter is used to store the password for the user. It is passed
        as an argument to the `__init__` method when creating an instance of the class
        """
        super().__init__()
        self.username = username
        self.password = password
        self.driver_wait_time = 5
        self.scroll_wait_time = 1
        self.scroll_iterations = 1
        self.max_comments = 100
        self.comments = False
        self.__login()

    def __scroll(self):
        """
        The function scrolls the window down by 500 pixels.
        """
        self.driver.execute_script("window.scrollBy(0, 500);") 

    def get_driver_wait_time(self):
        """
        The function returns the driver wait time.
        :return: The method is returning the value of the variable `self.driver_wait_time`.
        """
        return self.driver_wait_time

    def get_scroll_wait_time(self):
        """
        The function `get_scroll_wait_time` returns the value of the `scroll_wait_time` attribute.
        :return: The method is returning the value of the variable "scroll_wait_time".
        """
        return self.scroll_wait_time

    def get_scroll_iterations(self):
        """
        The function `get_scroll_iterations` returns the value of the `scroll_iterations` attribute.
        :return: The `self.scroll_iterations` value is being returned.
        """
        return self.scroll_iterations

    def get_max_comments(self):
        """
        The function returns the value of the max_comments attribute.
        :return: The method is returning the value of the attribute "max_comments".
        """
        return self.max_comments

    def set_driver_wait_time(self, driver_wait_time):
        """
        The function sets the driver wait time attribute to a specified value.
        
        :param driver_wait_time: The `driver_wait_time` parameter is a variable that represents the amount
        of time the driver should wait for an element to be present or visible before throwing an exception.
        It is used in Selenium WebDriver to set the implicit wait time
        """
        self.driver_wait_time = driver_wait_time

    def set_scroll_wait_time(self, scroll_wait_time):
        """
        The function sets the scroll wait time for an object.
        
        :param scroll_wait_time: The scroll_wait_time parameter is a variable that represents the amount of
        time to wait between scrolling actions. It is used to control the speed at which scrolling occurs in
        a program or application
        """
        self.scroll_wait_time = scroll_wait_time

    def set_scroll_iterations(self, scroll_iterations):
        """
        The function sets the value of the scroll_iterations attribute.
        
        :param scroll_iterations: The parameter "scroll_iterations" is a value that determines the number of
        times a scrolling action should be performed. It is used to set the value of the "scroll_iterations"
        attribute of an object
        """
        self.scroll_iterations = scroll_iterations

    def set_max_comments(self, max_comments):
        """
        The function sets the maximum number of comments for an object.
        
        :param max_comments: The `max_comments` parameter is an integer value that represents the maximum
        number of comments that can be set for an object
        """
        self.max_comments = max_comments

    def set_username(self, username):
        """
        The function sets the username attribute of an object.
        
        :param username: The `username` parameter is a string that represents the username that you want to
        set for an object
        """
        self.username = username

    def set_password(self, password):
        """
        The function sets the password attribute of an object to the given password.
        
        :param password: The `password` parameter is the value that will be assigned to the `password`
        attribute of the object
        """
        self.password = password

    def is_comments(self):
        """
        The function `is_comments` returns the value of the `comments` attribute.
        :return: The method is_comments is returning the value of the attribute self.comments.
        """
        return self.comments

    def set_comments(self, comments):
        """
        The function sets the comments attribute of an object to the provided comments.
        
        :param comments: The "comments" parameter is a variable that represents a collection of comments. It
        is used to set the value of the "comments" attribute of an object
        """
        self.comments = comments

    def __append_tweets_data(self, tweets_data, driver):
        """
        The function `__append_tweets_data` appends tweet data to a list of tweets, extracting
        information such as username, name, text, replies, retweets, likes, shares, and URL from a web
        page using Selenium.
        
        :param tweets_data: The `tweets_data` parameter is a list that stores the data of each tweet.
        Each tweet is represented as a dictionary with the following keys: "username", "name", "text",
        "replies", "retweets", "likes", "shares", and "url"
        :param driver: The `driver` parameter is an instance of a web driver, such as Selenium's
        WebDriver, that is used to interact with a web browser. It is used to find elements on a web
        page and perform actions like clicking, typing, etc. In this code, the `driver` is used to
        :return: The function does not explicitly return anything.
        """

        try:
            twitter_elm = driver.find_elements(
                By.CSS_SELECTOR, '[data-testid="tweet"]')
        except:
            print("Error: no tweets found")
            return

        i = 0

        for post in twitter_elm:

            print("Appending tweet {}...".format(i))

            try:
                tweet_elem = post.find_elements(By.TAG_NAME, 'a')
                tweet_url = ""
                for elem in tweet_elem:
                    if 'status' in elem.get_attribute('href'):
                        tweet_permalink_url = elem.get_attribute('href')
                        tweet_url_parts = tweet_permalink_url.split('/status/')
                        if len(tweet_url_parts) == 2:
                            tweet_id = tweet_url_parts[1]
                            tweet_url = f'https://twitter.com/username/status/{tweet_id}'
                        break
            except:
                pass

            try:

                username_div = post.find_element(
                    By.CSS_SELECTOR, '[data-testid="User-Name"]')

                username = username_div.find_elements(By.TAG_NAME, 'a')
                name = username[0].text
                username = username[1].text

                tweet_div = post.find_element(
                    By.CSS_SELECTOR, '[data-testid="tweetText"]')
                # remove all the spaces (except 1) and newlines from the tweet
                text = re.sub(r'\s+', ' ', tweet_div.text.replace('\n', ' '))
                print(text)

                reply_div = post.find_element(
                    By.CSS_SELECTOR, '[data-testid="reply"]')
                retweet_div = post.find_element(
                    By.CSS_SELECTOR, '[data-testid="retweet"]')
                like_div = post.find_element(
                    By.CSS_SELECTOR, '[data-testid="like"]')
                share_div = post.find_element(
                    By.CSS_SELECTOR, '[data-testid="app-text-transition-container"]')

                new_record = {"username": username, "name": name, "text": text, "replies": super()._convert_to_int(reply_div.text), "retweets": super()._convert_to_int(
                    retweet_div.text), "likes": super()._convert_to_int(like_div.text), "shares": super()._convert_to_int(share_div.text), "url": tweet_url}

                if new_record not in tweets_data:
                    tweets_data.append(new_record)
                    i += 1

            except:
                pass

    def get_tweets(self, num_tweets):
        """
        The function `get_tweets` retrieves a specified number of tweets from a webpage, scrolling and
        waiting for new tweets to load if necessary.
        
        :param num_tweets: The parameter `num_tweets` is the number of tweets that you want to retrieve
        :return: a list of tweets data.
        """

        tweets_data = []

        print("Getting tweets data...")

        self.__append_tweets_data(tweets_data, self.driver)

        while (len(tweets_data) < num_tweets):

            for _ in range(self.scroll_iterations):
                self.__scroll()
                time.sleep(self.scroll_wait_time)
                try:
                    element = self.driver.find_element(By.XPATH, '//div[@role="button" and .//span[text()="Dismiss"]]')
                    if element.is_displayed():
                        element.click()
                except Exception as e:
                    pass

            # Wait for new tweets to load
            wait = WebDriverWait(self.driver, self.driver_wait_time)
            wait.until(EC.invisibility_of_element_located(
                (By.CSS_SELECTOR, '[data-testid="appLoader"]')))
        
            self.__append_tweets_data(tweets_data, self.driver)

        if len(tweets_data) > num_tweets:
            tweets_data = tweets_data[:num_tweets]

        return tweets_data

    def search(self, query, num_tweets):
        """
        The function searches for tweets based on a given query and returns a specified number of tweets.
        
        :param query: The query parameter is the search term or hashtag that you want to search for on
        Twitter. It can be any word or phrase that you want to find tweets about. If the query contains a
        hashtag, it will be replaced with "%23" to ensure proper URL encoding
        :param num_tweets: The parameter "num_tweets" is the number of tweets you want to retrieve from the
        search results
        :return: the list of tweets that match the given query, up to the specified number of tweets.
        """

        query = query.replace('#', '%23')
        self.get_page(
            "https://twitter.com/search?q={}&src=typed_query".format(query))
        tweets = self.get_tweets(num_tweets)
        if self.comments:
            self.get_comments(tweets)
        return tweets

    def search_for_trend(self, trend, num_tweets):
        """
        The function searches for a given trend on Twitter and returns a specified number of tweets related
        to that trend.
        
        :param trend: The trend parameter is the keyword or hashtag that you want to search for on Twitter.
        It can be any word or phrase that you want to find tweets about
        :param num_tweets: The parameter "num_tweets" represents the number of tweets you want to retrieve
        for the given trend
        :return: the list of tweets that match the given trend, with the number of tweets specified by the
        "num_tweets" parameter.
        """

        trend = trend.replace('#', '%23')
        self.get_page(
            "https://twitter.com/search?q={}&src=trend_click&vertical=trends".format(trend))
        tweets = self.get_tweets(num_tweets)
        if self.comments:
            self.get_comments(tweets)
        return tweets
    
    def get_tweet(self, id):
        """
        The `get_tweet` function retrieves the text content of a tweet given its ID.
        
        :param id: The "id" parameter in the "get_tweet" function is the unique identifier of the tweet. It
        is used to construct the URL of the tweet page and retrieve the tweet text from that page
        :return: the text of a tweet.
        """

        # move to the tweet page
        self.get_page("https://twitter.com/username/status/{}".format(id))
        # wait for the tweet page to load
        time.sleep(2)
        wait = WebDriverWait(self.driver, self.driver_wait_time)
        wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, '[data-testid="appLoader"]')))
        # take the tweet
        text = ""
        # take the body of the page
        try:
            elem = self.driver.find_element(By.TAG_NAME, "body")
            # get the text of the tweet
            tweets_data = elem.find_element(By.CSS_SELECTOR, '[data-testid="tweet"]')
            tweet_div = tweets_data.find_element(
                    By.CSS_SELECTOR, '[data-testid="tweetText"]')
            text = re.sub(r'\s+', ' ', tweet_div.text.replace('\n', ' '))
        except:
            pass

        return text

    def get_trends(self):
        """
        The `get_trends` function retrieves trending topics on Twitter and returns a list of dictionaries
        containing information about each trend, such as the trend name, number of posts, date, URL, and
        location.
        :return: a list of dictionaries containing information about the trending topics on Twitter. Each
        dictionary includes the name of the trend, the number of posts related to the trend (if available),
        the date and time of the trend, the URL to view the trend on Twitter, and the location where the
        trend is happening.
        """

        trends_data = []

        body = self.driver.find_element(By.TAG_NAME, "body")

        # aria-label="Timeline: Trending now"
        timeline = body.find_element(
            By.CSS_SELECTOR, '[aria-label="Timeline: Trending now"]')
        # take the div with role heading
        heading = timeline.find_element(By.CSS_SELECTOR, '[role="heading"]')
        location = heading.text.split(" ")[0].strip()

        try:
            list = body.find_elements(By.CSS_SELECTOR, '[data-testid="trend"]')
        except:
            return trends_data

        for elem in list:
            # take the first div into the list
            div = elem.find_element(By.TAG_NAME, 'div')
            # take the sibling of the first child of div
            div = elem.find_element(By.TAG_NAME, 'div')
            div = div.find_element(By.TAG_NAME, 'div')
            siblings = div.find_elements(By.XPATH, "./following-sibling::*")
            text = siblings[0].text
            posts = siblings[1].text
            # take the number of posts into the second sibling of the first child of div
            try:
                number_of_posts = super()._convert_to_int(posts.split(" ")[0])
            except:
                number_of_posts = 0
            # take the url of the post, search the a tag and take the href attribute containinh the 'hashtag' string
            trend_name = text.replace('#', '%23')
            url = "https://twitter.com/search?q={}&src=trend_click&vertical=trends".format(
                trend_name)

            if number_of_posts > 0:
                trends_data.append({"name": text, "number_of_posts": number_of_posts, "date":  datetime.datetime.now(
                ).isoformat(), "url": url, "location": location})
            else:
                trends_data.append({"name": text, "date": datetime.datetime.now(
                ).isoformat(), "url": url, "location": location})

        return trends_data

    def search_trends(self):
        """
        The function searches for trending topics on Twitter by accessing the home page and returning the
        trends.
        :return: the trends that are found on the Twitter homepage.
        """
        self.get_page("https://twitter.com/home", 2)
        return self.get_trends()

    def get_user(self):
        """
        The function `get_user` retrieves various data about a user from a web page.
        :return: a dictionary containing various user data such as profile name, username, verification
        status, bio, location, URL, birth date, joined date, number of following, and number of
        followers.
        """

        user_data = {}

        try:
            username_div = self.driver.find_element(
                By.CSS_SELECTOR, '[data-testid="UserName"]')
        except:
            raise Exception("Error: user not found")

        spans = username_div.find_elements(By.TAG_NAME, 'span')
        user_data["profile_name"] = spans[1].text
        user_data["username"] = spans[-1].text

        try:
            username_div.find_element(By.TAG_NAME, 'svg')
            user_data["verified"] = True
        except:
            user_data["verified"] = False

        try:
            bio_div = self.driver.find_element(
                By.CSS_SELECTOR, '[data-testid="UserDescription"]')
            text_span = bio_div.find_elements(By.TAG_NAME, 'span')
            text = ""
            # concatenate all the text into the spans
            for span in text_span:
                text += ' ' + span.text
            user_data["bio"] = re.sub(r'\s+', ' ', text.replace('\n', ' '))
        except:
            pass

        try:
            items_div = self.driver.find_element(
                By.CSS_SELECTOR, '[data-testid="UserProfileHeader_Items"]')
            try:
                user_data["location"] = items_div.find_element(
                    By.CSS_SELECTOR, '[data-testid="UserLocation"]').text
            except:
                pass
            try:
                user_data["url"] = items_div.find_element(
                    By.CSS_SELECTOR, '[data-testid="UserUrl"]').text
            except:
                pass
            try:
                user_data["birth_date"] = items_div.find_element(
                    By.CSS_SELECTOR, '[data-testid="UserBirthdate"]').text
            except:
                pass
            try:
                user_data["joined_date"] = items_div.find_element(
                    By.CSS_SELECTOR, '[data-testid="UserJoinDate"]').text
            except:
                pass
            try:
                sibling_elements = username_div.find_elements(
                    By.XPATH, "./following-sibling::*")
                sibling_elements = sibling_elements[-2]
                # take the two divs inside
                divs = sibling_elements.find_elements(By.TAG_NAME, 'div')
                # for the first and the second div take the text into the second span
                user_data["following"] = super()._convert_to_int(
                    divs[0].find_elements(By.TAG_NAME, 'span')[1].text)
                user_data["followers"] = super()._convert_to_int(
                    divs[1].find_elements(By.TAG_NAME, 'span')[1].text)
            except:
                pass
        except:
            pass

        return user_data

    def search_user(self, username):
        """
        The function searches for a user on Twitter using their username and returns their information if
        found, otherwise it prints an error message.
        
        :param username: The `username` parameter is a string that represents the Twitter username of the
        user you want to search for. It should be in the format "@username" where "username" is the actual
        username of the user you want to search for
        :return: a dictionary object representing the user found on Twitter with the given username. If the
        user is not found, an empty dictionary is returned.
        """
        self.get_page(
            "https://twitter.com/{}".format(username.replace('@', '')), 2)
        try:
            user = self.get_user()
        except:
            print("Error: user not found")
            user = {}
        return user

    def get_comments(self, tweets):
        """
        The function `get_comments` retrieves comments for each tweet in a list of dictionaries by
        opening the tweet's URL, scrolling to load more comments, and appending the comments to the
        tweet's dictionary.
        
        :param tweets: The `tweets` parameter is a list of dictionaries. Each dictionary represents a
        tweet and contains information such as the tweet's URL and the number of replies it has
        :return: In this code, nothing is being explicitly returned. However, the code is modifying the
        "tweets" list of dictionaries by adding the "comments" key to each tweet dictionary. The
        "comments" key contains a list of comments for each tweet.
        """

        print("Getting comments for each tweet...")
        # for each tweet in the list of dicts, take the url and the number of replies
        for tweet in tweets:

            url = tweet["url"]
            replies = tweet["replies"]

            # if the number of replies is greater than 0, then get the comments
            if replies > 0:
                # open the url of the tweet
                self.driver.get(url)
                # wait for the comments to load
                time.sleep(2)
                wait = WebDriverWait(self.driver, self.driver_wait_time)
                wait.until(EC.invisibility_of_element_located(
                    (By.CSS_SELECTOR, '[data-testid="appLoader"]')))

                # take the comments
                comments = []

                try:
                    elem = self.driver.find_element(By.TAG_NAME, "body")
                except:
                    return

                self.__append_tweets_data(comments, self.driver)

                i = 0
                prev_len = 0
                iters = 0

                with tqdm(total=min(replies, self.max_comments)) as pbar:

                    while (i < min(replies, self.max_comments) and iters < 10):

                        self.__scroll()

                        try:
                            element = self.driver.find_element(By.XPATH, '//div[@role="button" and .//span[text()="Dismiss"]]')
                            if element.is_displayed():
                                element.click()
                        except Exception as e:
                            pass

                        # Wait for new tweets to load
                        wait = WebDriverWait(
                            self.driver, self.driver_wait_time)
                        wait.until(EC.invisibility_of_element_located(
                            (By.CSS_SELECTOR, '[data-testid="appLoader"]')))

                        try:
                            showMoreButton = WebDriverWait(self.driver, self.driver_wait_time).until(
                                EC.element_to_be_clickable(
                                    (By.XPATH, '//div[@role="button" and .//span[text()="Show more replies"]]'))
                            )
                            showMoreButton.click()
                            time.sleep(2)
                        except:
                            pass

                        try:
                            showMoreButton = WebDriverWait(self.driver, self.driver_wait_time).until(
                                EC.element_to_be_clickable(
                                    (By.XPATH, '//div[@role="button" and .//span[text()="Show"]]'))
                            )
                            showMoreButton.click()
                            time.sleep(2)
                        except:
                            pass

                        self.__append_tweets_data(comments, self.driver)

                        if len(comments) > prev_len:
                            iters = 0
                        else:
                            iters += 1

                        # Update the progress bar by the number of comments
                        pbar.update(len(comments)-i)
                        i = len(comments)
                        prev_len = len(comments)

                if len(comments) > 1:
                    tweet["comments"] = comments[1:]
                    tweet["replies"] = len(comments)-1
