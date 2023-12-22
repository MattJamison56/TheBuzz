import pandas as pd
from newsapi import NewsApiClient
import bs4 as bs
import urllib.request
import time
import requests
import os
from dotenv import load_dotenv


CATEGORY = [None,'business','entertainement','health','general','technology','science','sports']

def retrieve(sources, newsapi, page="general", catIdx=0, keyword=None):
    match page:
        case "general":
            general_search = newsapi.get_everything(qintitle = keyword,
                                                    language = 'en',
                                                    sort_by = 'relevancy',
                                                    page_size = 3,
                                                    sources = sources,
                                                    )
            return(general_search)
        case "categoryTop":
            print(catIdx)
            top_from_category = newsapi.get_top_headlines(category = CATEGORY[catIdx],
                                                          country = 'us',
                                                          language = 'en',
                                                          page_size = 3,
                                                          )
            return(top_from_category)
        case _ :
            print('Error')
            return "noarticle"

def getArticles(keyword = None, category = None):
    # Init
    load_dotenv()
    newsapi = os.getenv("NEWS_API_KEY")
    newsapi = NewsApiClient(api_key=newsapi) 
    sources = pd.DataFrame(newsapi.get_sources()['sources'])
    sources = ",".join(sources['name'].values).replace(" ","-")
    if category == None:
        page = 'general'
    else:
        page = 'categoryTop'

    categories = ['Business','Entertainement','Health','General','Technology','Science','Sports']

    catIdx = 0
    for index in range(len(categories)):
        if category == categories[index]:
            catIdx = index + 1

    content = []
    response = retrieve(sources = sources, newsapi=newsapi, page= page, catIdx = catIdx, keyword = keyword)
    df = pd.DataFrame(response['articles'])
    print(df['url'].values)

    start_time = time.time()
    for i in range(0,len(df)):
        try:
            response = requests.get(df['url'][i])
            response.raise_for_status()
            articledata = urllib.request.urlopen(df['url'][i])
            article = articledata.read()

            parsed_article = bs.BeautifulSoup(article, "lxml")

            paragraphs = parsed_article.find_all('p')

            article_text = ''
            for p in paragraphs:
                article_text += p.text
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            content.append("Request Error")
            continue
        except: 
            print("Unknown Error")
            content.append("Article Error")
            continue

            #sources.replace(df.iloc[i].source['name'].replace(' ','-') + ',','')
        content.append(article_text.replace("'",""))
    end_time = time.time()
    elapsed_time = end_time-start_time
    return content, list(df['url'].values)
