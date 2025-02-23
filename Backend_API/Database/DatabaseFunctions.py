from datetime import date, datetime, timedelta
from ..Utils.Scrape import Scrape
import pandas as pd
import sqlite3
import os
import logging
import concurrent.futures
import yaml


def updateDatabase() -> None:
    '''
    Master script for updating database
    '''
    if not os.path.exists('DBlog.log'):
        with open('DBlog.log', 'w'): pass
    logging.basicConfig(filename="DBlog.log", encoding='utf-8', level=logging.DEBUG)
    logging.info(f"Now attempting crossword.db update on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    # web scrape for missing clues
    res = getMissingClues()
    logging.info(f"Function 'GetMissingClues' successfully executed on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    rawDF = formatDataframe(res)
    logging.info(f"Function 'formatDataframe' successfully executed on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    cleanDF = cleanDataframe(rawDF)
    logging.info(f"Function 'cleanDataframe' successfully executed on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    writeToDatabase(cleanDF)
    logging.info(f"Function 'writeToDatabase' successfully executed on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    backup()
    logging.info(f"Function 'writeToDatabase' successfully executed on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def getMissingClues() -> list[dict]:
    ''''
    Function gets all missing clues and writes them to csv
    Changes
        - switched from Selenium to requests and BeautifulSoup as do not need to 
        interact with page and these libraries allow for seemless multithreading
        - 1 year of data without multithreading took 174 seconds, now with
        multithreading, that same 1 year of data takes 14.5 seconds
    '''

    with open("DBConfig.yaml", "r") as stream:
        try:
            config = yaml.safe_load(stream)
            print(config)
        except yaml.YAMLError as exc:
            print(exc)
    # get last update of database from config
    old = config["Last_Update"].split("/")
    last_update = date(int(old[2]), int(old[0]), int(old[1]))
    # get current day
    today = date.today()
    # get all dates in between the two dates
    missing_dates = [ last_update + timedelta(days=x) for x in range((today-last_update).days + 1) ][1:]

    # improved with multithreading in Scrape
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = executor.map(Scrape, missing_dates)

    return results


def formatDataframe(data: list[dict]):
    '''
    receive a list of dictionaries
    form a pandas dataframe, then pass to another function to insert into database
    '''
    rows = []
    for singleDay in data:
        day_of_the_week = singleDay['date'].strftime("%A")
        for clue, answer in zip(singleDay['clues'], singleDay['answers']):
            rows.append({
                'Date': singleDay['date'].strftime('%m/%d/%Y'),
                'Answer': answer.upper(),
                'Clue': clue,
                'Answer_Len': len(answer),
                'Day_Of_Week': day_of_the_week
            })
    df = pd.DataFrame(rows, columns=['Date', 'Answer', 'Clue', 'Answer_Len', 'Day_Of_Week'])
    print(df)
    return df


def cleanDataframe(df: pd.DataFrame) -> pd.DataFrame:
    '''
    reformat df here possibly
    if any Answer_Len column has a value of 1 or 2
    if any values are NA???
    '''
    print(f"Length of df before removing invalid values: {df.shape[0]}")
    df = df[~(df['Answer_Len'] == 1)]
    df = df[~(df['Answer_Len'] == 2)]
    df.fillna('NULL', inplace=True)
    print(f"Length of df after removing invalid values: {df.shape[0]}")
    return df


def writeToDatabase(df: pd.DataFrame) -> None:
    '''
    Take dataframe and write to database
    '''
    con = sqlite3.connect('crossword.db')
    with con:
        df.to_sql(name='AnswerClueDB', con=con, if_exists='append', index=False)


def backup() -> None:
    '''
    Backup DB to a sql file in backupDBs folder
    Update last updated string in DBConfig.yaml
    '''
    year, month, day = str(date.today()).split("-")
    today = f"{month}-{day}-{year[-2:]}"
    time = datetime.now().strftime("%H-%M-%S")
    con = sqlite3.connect('crossword.db')
    with con:
        data = '\n'.join(con.iterdump())
        with open(os.path.join("backupDBs", f"backup-{today}-{time}.sql"), 'w', encoding='utf-8') as f:
            f.write(data)
    today = date.today().strftime('%d/%m/%Y')
    with open("DBConfig.yaml", "r") as stream:
        try:
            config = yaml.safe_load(stream)
            print(config)
        except yaml.YAMLError as exc:
            print(exc)
            return
    config['Last_Update'] = today
    with open("DBConfig.yaml", "w") as stream:
        yaml.safe_dump(config, stream, default_flow_style=False)


def restoreFromLatestBackup() -> None:
    '''
    Function restores db from the latest backup sql file
    Useful when cloning from repo onto new computer
    '''
    # change to grab latest file
    folder_path = os.path.abspath('backupDBs')
    files = [os.path.join(folder_path, f) for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    if files:
        most_recent_file = max(files, key=os.path.getmtime)
        print(f"The most recent file is: {most_recent_file}")
    else:
        print("No files found in the folder.")
        return
    with open(most_recent_file, 'r') as file:
        sql = file.read()
    con = sqlite3.connect('crossword.db')
    with con:
        cur = con.cursor()
        cur.execute("DROP TABLE IF EXISTS AnswerClueDB;")
        cur.executescript(sql)


if __name__ == "__main__":
    print("Don't call directly")