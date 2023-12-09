# Twitter sentiment analysis database

This project is made up of two main parts:

1. a **database** module,
2. a **X scraper** module.

## Database

For the details about the database design read the [doc_Twitter_DB.pdf](https://docs.google.com/document/d/1nrY6ossFJN2PwIf05ZRFzYorwiSaiXuRNu15mVba_BA/edit?usp=sharing) file.

To use the database follow these steps:

* execute `load("database/CRUD/createSchema.js")` in `mongosh`, this file creates the database, the collections, the validators for the collections and the indexes,
* execute `pip install pymongo`
* execute `python database/CRUD/loadData.py` to load the data from the database/data/* folders into the just created collections of the database,
* then you're able to execute the CRUD operations stored in the .js file in the database/CRUD folder in mongosh using the `load("database/CRUD/operationName.js")` command and the same goes for the queries in the database/queries and database/complex_queries folders.

### Create Schema

The `createSchema.js` file sets up the JSON schema validators and the indexes for the three collections of the database. It's suggested to create the schema before anything else.

### Create

The `create.js `file contains some functions to create trends, tweets, users or comments.

### Update

The `update.js` file contains some functions to update trends, tweets, users or comments.

### Delete

The `delete.js` file contains dome functions to delete trends, tweets, users or comments.

### Read

The `read.js` file contains some functions to read trends for a given tweet, tweets for a given trend, the user who wrote a tweet, the tweets for a given user or the comments for a given tweet.

### Queries

The file `complex_queries.js` contains 7 target queries related to the reality of interest and described in the pdf file reoprted above. These queries largely use MongoDB aggregations to perform some complex operations, even on more than one collection.

The file `other_queries.js` contains other simpler general queries.

## X scraper

This module has been set up to obtain real time data from X in a almost automatic way. To start collecting data, you can simply execute `python twitter_scraper/main.py <username> <password>`. This script, uses the scraper to collect the current 10 main trends, a certain quantity of the related tweets with their respective comments and the public information about the users who wrote the tweets. The collected data are saved into the data/trends, data/tweets and data/users folders respectively.

### `scraper.py`

The scraper general class uses a Selenium WebDriver to scrape web pages. It has a method to reach a page giveb the url and to close the driver.

### `twitter_scraper.py`

The class contained in this file has some methods specific to scrape the most popular X pages, such as the home page, in order to get the trends, the page containing the tweets related to a given trend, the users' pages, ...

### `main.py`

This file has the purpose of collecting the data for all the databases. First the trends of the moment are collected, the for each trend a specified number of tweets is collected and for each tweet, once again,  aspecified number of comments is collected. For each tweet and for each comment, the user who wrote it is scraped. The collected data are then saved in the appropriate file in the `database/data/*` folder.

The sentiment's polarity for a give tweet/comment is obatained using `Text Blob`. Please take into account that this is just an example and it could be obtained with any of the existing methods for the sentiment analysis.
