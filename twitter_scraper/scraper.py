from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
import re
import time

class Scraper:

    def __init__(self):

        # ChromeDriverManager().install()
        options = webdriver.firefox.options.Options()
        options.add_argument("--headless")
        options.set_preference('intl.accept_languages', 'en-GB')
        self.driver = webdriver.Firefox(options=options)

    def get_page(self, url, login_time=0):
        self.driver.get(url)
        time.sleep(login_time)
        return self.driver.page_source

    def close(self):
        self.driver.close()

    # Function to convert a string to an integer
    def _convert_to_int(self, s):
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
