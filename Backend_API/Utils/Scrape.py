import requests
from bs4 import BeautifulSoup
import datetime
from unidecode import unidecode

def Scrape(dateObj: datetime.date) -> dict:

    date = dateObj.strftime("%m/%d/%y").replace("/", "-")
    print(f"Started fetching date: {date}")
    url = f"https://nytcrosswordanswers.org/nyt-crossword-answers-{date}/"
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    container = soup.find("div", class_="nywrap")
    uls = container.find_all("ul")
    answers, clues = [], []
    for ul in uls:
        lis = ul.find_all("li")
        for li in lis:
            clue = li.find_all("a")[0].text
            answer = li.find_all("span")[0].text
            clues.append(unidecode(clue))
            answers.append(unidecode(answer))
    print(f"Finished fetching date: {date}")
    return {
        "answers": answers, 
        "clues": clues,
        "date": dateObj
    }

if __name__ == '__main__':
    print("Don't call directly")