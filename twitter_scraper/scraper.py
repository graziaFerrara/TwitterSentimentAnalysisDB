from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
import re
import time

# The Scraper class is used for web scraping.
class Scraper:

    def __init__(self):
        """
        The above function initializes a Firefox web driver with headless mode and sets the language
        preference to English (Great Britain).
        """

        # ChromeDriverManager().install()
        options = webdriver.firefox.options.Options()
        options.add_argument("--headless")
        options.set_preference('intl.accept_languages', 'en-GB')
        self.driver = webdriver.Firefox(options=options)

    def get_page(self, url, login_time=0):
        """
        The `get_page` function retrieves the page source of a given URL using a Selenium WebDriver.
        
        :param url: The URL of the webpage you want to retrieve
        :param login_time: The `login_time` parameter is the amount of time (in seconds) to wait after
        loading the page before returning the page source. This is useful in cases where the page requires
        some time to load or perform any necessary login/authentication actions before the page source is
        fully loaded. By default, the `, defaults to 0 (optional)
        :return: The method `get_page` returns the page source of the URL that was passed as an argument.
        """
        self.driver.get(url)
        time.sleep(login_time)
        return self.driver.page_source

    def close(self):
        """
        The close function is used to close the current browser window or tab.
        """
        self.driver.close()

    def _convert_to_int(self, s):
        """
        The function `_convert_to_int` converts a string representation of a number with suffixes 'B', 'M',
        or 'K' to an integer.
        
        :param s: The parameter `s` in the `_convert_to_int` function is a string that represents a number.
        It can contain commas, spaces, newlines, and suffixes like 'B', 'M', or 'K' to represent billions,
        millions, or thousands respectively. The function converts this string
        :return: an integer value.
        """
        if s == '':
            return 0
        s = s.replace(',', '')  # Remove commas
        if 'B' in s:
            s = s.replace('B', '')
            return int(float(s) * 1e9)  # Convert 'B' to billions
        if 'M' in s:
            s = s.replace('M', '')
            return int(float(s) * 1e6)  # Convert 'M' to millions
        if 'K' in s:
            s = s.replace('K', '')
            return int(float(s) * 1e3)  # Convert 'K' to thousands
        # remove all the spaces (except 1) and newlines from the string
        s = re.sub(r'\s+', '', s.replace('\n', ''))
        return int(s)
