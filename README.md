# Master Branch

This branch is for all my development, before pushing to main.  I will include a more detailed ToDo here.

## ToDo

* greatly improve efficiency of crossword generation algorithm.  Possible ideas include: limiting number of calls to database,
    storing only the word column into a set and using that set during generation, but then going to database only at the end when
    the grid has finished generating
* ~~when autocheck is on, and the user presses backspace on the first empty/incorrect cell of the word, then the active cell
    should not shift to the next word until the user pressed backspace again~~
* ~~when shifting to the next cell, if autocheck is on, dont skip over incorrect cells~~
* add numbers to each grid cell corresponding to the number clue
* user feedback when backend is generating crossword, possibly pop up a modal with a spinner while its generating?
* ability to choose desired grid layout, will need to pass this as query parameters
* ability to choose a difficulty during generation, will need to pass this as query parameters
* way to handle end of game, possibly include a timer and let user know how long it took them, how many clues they swapped, etc.
* improve overall front end design- do last when all funcionality is working as desired
