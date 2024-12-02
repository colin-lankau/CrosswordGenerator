# Crossword Generator
This project is meant to be a mini crossword generator web application.  The mini crosswords are 5x5 grids with varying structure similar those you would find on the NYT games page.

## How It's Made

**Tech Used:** Python, Javascript, Tailwind CSS, Flask, Selenium, SQLite, React, Vite

The backend for this project was built using python Flask, as I wanted a lightweight backend for this project.  Initially, I used Selenium to web scrape all clues and answers from every NYT crossword
from the years 1973-2023.  Once I had this data into a csv file, I created an SQLite database with accompanying functions to backup, restore, and update the database.  Then I designed a miniBoard class
to store methods relating to generating a mini crossword.  The main route on the Flask application uses this class and returns the mini crossword to the front end and all necessary data.  Next, I designed
a frontend for the application in React.  I have used Bootstrap before so I knew I wanted to try Tailwind in this project, so that is what I used.  I also decided to go with Vite to build the application 
for auto updating my front end when changes are made in development.

## Features

* mini crossword generation
* database of all clues from NYT crosswords 1973-2023
* web scraper written to grab the latest clues and store in database
* functions to maintain database of clues and answers
* grid cells traversable via arrow keys
* go to next word with enter key
* double clicking a cell swaps direction
* clues are highlighted when corresponding cells are active
* enter key goes to next word
* autocheck functionality
* ability to swap clues out

## Lessons Learned

This project has taught me a lot about React, as I have never used this software before.  My biggest struggle has been and continues to be keeping my states all in sync throughout the application.
Sometimes I catch myself thinking I could make certain functionalities super easily in vanilla Javascript, so thinking in React has certainly been a challenge.  Designing reusable components and following the consumer producer model, has helped me gain practice with "thinking in React" I have also learned a lot about css
while using Tailwind.  The design portion of web development is not my strong suit but I think as I continue to practice with it I will get better.  I was already very comfortable with Python before
this project, but learning about web scraping and databases was fun.  Designing the algorithm for crossword generation, was good practice in deciding when to use certain data structures for certain
problems.  Recently, I analyzed the algorithm, and identified a couple key areas where I could improve its efficiency, leading to an overall increase in efficiency of about 330%.

## ToDo

* break button into reusable component
* add spinner while crossword is loading
* user feedback when backend is generating crossword
* ability to choose desired grid layout
* ability to choose a difficulty during generation
* way to handle end of game, possibly include a timer and let user know how long it took them, how many clues they swapped, etc.
* improve overall front end design- do last when all funcionality is working as desired
