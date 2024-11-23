# Crossword Generator
This project is meant to be a mini crossword generator web application.  The mini crosswords are 5x5 grids with varying structure similar those you would find on the NYT games page.

## How It's Made

** Tech Used ** Python, Javascript, Tailwind CSS, Flask, Selenium, SQLite, React, Vite

The backend for this project was built using python Flask, as I wanted a lightweight backend for this project.  Initially, I used Selenium to web scrape all clues and answers from every NYT crossword
from the years 1973-2023.  Once I had this data into a csv file, I created an SQLite database with accompanying functions to backup, restore, and update the database.  Then I designed a miniBoard class
to store methods relating to generating a mini crossword.  The main route on the Flask application uses this class and returns the mini crossword to the front end and all necessary data.  Next, I designed
a frontend for the application in React.  I have used Bootstrap before so I knew I wanted to try Tailwind in this project, so that is what I used.  I also decided to go with Vite to build the application 
for auto updating my front end when changes are made in development.

## ToDo

