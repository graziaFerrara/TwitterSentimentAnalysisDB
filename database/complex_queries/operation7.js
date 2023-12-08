/*
    7. DISCUSSIONS' DETECTION   
    Given a trend, for each tweet associated with it, check if its comments have given rise to a discussion by 
    identifying any discordant sentiments
*/

function operation7(db, trendName, trendLocation, trendDate){

    result = db.getCollection("Trends").aggregate([
        {
            $match: {
                name: trendName,
                location: trendLocation,
                date: trendDate
            }
        },
        {
            $unwind: {
                path: '$tweets'
            }
        },
        {
            $lookup: {
                from: 'Tweets',
                localField: 'tweets',
                foreignField: '_id',
                as: 'tweetsData'
            }
        },
        {
            $unwind: {
                path: '$tweetsData'
            }
        },
        // take the tweet and classify its sentiment as
        // positive if sentiment > 0.2
        // negative if sentiment < -0.2
        // neutral otherwise
        // then for each tweet take the comments and classify their sentiment
        // if the tweet as at least one comment with a different sentiment classification
        // then a discussion took place
        {
            $project: {
                _id: 0,
                tweetText: '$tweetsData.text',
                tweet: {
                    $cond: {
                        if: {
                            $gt: ['$tweetsData.sentiment', 0.2]
                        },
                        then: 'positive',
                        else: {
                            $cond: {
                                if: {
                                    $lt: ['$tweetsData.sentiment', -0.2]
                                },
                                then: 'negative',
                                else: 'neutral'
                            }
                        }
                    }
                },
                comments: {
                    $map: {
                        input: '$tweetsData.comments',
                        as: 'comment',
                        in: {
                            $cond: {
                                if: {
                                    $gt: ['$$comment.sentiment', 0.2]
                                },
                                then: 'positive',
                                else: {
                                    $cond: {
                                        if: {
                                            $lt: ['$$comment.sentiment', -0.2]
                                        },
                                        then: 'negative',
                                        else: 'neutral'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                tweet: 1,
                comments: 1,
                tweetText: 1,
                // if the tweet's comments array is not null
                // then check if the tweet's sentiment is different from
                // the comments' sentiment
                // if so then a discussion took place
                discussion: {
                    $cond: {
                        if: {
                            $ne: ['$comments', null]
                        },
                        then: {
                            //count the number of comments with a different sentiment
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: '$comments',
                                            as: 'comment',
                                            cond: {
                                                $ne: ['$$comment', '$tweet']
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        },
                        else: false
                    }
                }
                
            }
        }, {
          $project: {
            _id: 0,
            tweet: 1,
            tweetText: 1,
            comments: 1,
            discussion: {
              $cond: {
                if: '$discussion',
                then: true,
                else: false
              }
            }
          }
        }
    ])
    
    res = []
    result.toArray().forEach(element => {
      res.push({
        tweetText: element.tweetText,
        discussion: element.discussion
      })
    });
    return res;
}

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

trendName = "#Halloween"
trendLocation = "Italy"
trendDate = "2023-11-01T16:29:31.292726"

printjson(operation7(db, trendName, trendLocation, trendDate))