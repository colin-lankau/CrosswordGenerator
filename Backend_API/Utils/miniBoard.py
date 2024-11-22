'''
This module is for creating a working concept for a mini grid generation algorithm
'''
# git add -- . :!backupCSVs/*  :!backupDBs/* :!LearningConcurrency/* :!LearningSQLite3/* :!10-06-23.txt :!Board.py :!crossword.db :!curBackup.sql :!main.py :!test.py :!__pycache__/*

import random
import sqlite3
from collections import deque, defaultdict
from copy import deepcopy
import itertools
import os

dbPath = f"{os.path.dirname(os.path.realpath(__file__)).replace("Utils", "Database")}/crossword.db"

POSSIBLE_GRIDS = (
    (), # no black squares
    ( (4,3), (4,4) ), # black squares at location 4,3 and 4,4
    ( (0,4), (4,4) ),
    ( (0,0), (4,4) ),
    ( (0,4), (4,0) ),
    ( (0,4), (1,4) ),
    ( (0,0), (1,0), (3,4), (4,4) ),
    ( (0,0), (0,1), (3,4), (4,4) ),
    ( (0,0), (1,0), (0,4), (1,4) ),
    ( (0,0), (0,1), (4,3), (4,4) ),
    ( (0,3), (0,4), (4,0), (4,1) ),
    ( (0,0), (0,4), (4,0), (4,4) ),
    ( (0,4), (1,4), (3,0), (4,0) ),
    ( (0,3), (0,4), (1,4), (3,0), (4,0), (4,1) )
)

class Mini:


    def __init__(self) -> None:
        self._shape = random.choices(POSSIBLE_GRIDS)[0]
        # self._shape = POSSIBLE_GRIDS[1]
        self._length = 5 # set it to mini size
        self._board = [ [ "_" if (j,i) not in self._shape else "-" for i in range(self._length) ] for j in range(self._length) ]
        self._clues = {} # maps an answer to another map, this map has days of week linked to clues for that day of week
        self._answers = {} # maps an answer to start pos and end pos
        self._previous_states = deque()
        self._previous_fills = deque() # if go back a state in the board, don't repull from database because we already did that
        self._previous_fills.append({})
        self._done = False
        self._puzzle_info = []


    def re_init(self) -> None:
        self._shape = random.choices(POSSIBLE_GRIDS)[0]
        self._length = 5
        self._board = [ [ "_" if (j,i) not in self._shape else "-" for i in range(self._length) ] for j in range(self._length) ]
        self._clues = {}
        self._answers = {}
        self._previous_states = deque()
        self._previous_fills = deque()
        self._previous_fills.append({})
        self._done = False
        self._puzzle_info = []


    def reset(self) -> None:
        self._board = [ [ "_" if (j,i) not in self._shape else "-" for i in range(5) ] for j in range(5) ]
        self._previous_states.append(deepcopy(self._board))
    

    def __repr__(self) -> None:
        return_text = "\n  "
        for row in self._board:
            for char in row:
                return_text += f"{char}  "
            return_text += "\n  "
        return return_text

    
    def get_patterns(self, done=False) -> set:
        '''
        Utility function to get all patterns we want to check
        Needed to make sure the board doesn't have a dead fill, ie. cant be filled anymore
        Return a set of the patterns as we don't want to check the same patterns multiple times
        '''
        patterns = []
        # add horizontal patterns
        for row in self._board:
            if not done:
                if '_' not in row:
                    continue
            pat = (''.join(row)).strip('-')
            patterns.append(pat)
        # add vertical patterns
        columns = [ ''.join([row[i] for row in self._board]) for i in range(5) ]
        for col in columns:
            if not done:
                if '_' not in col:
                    continue
            pat = (''.join(col)).strip('-')
            patterns.append(pat)
        return set(patterns)
    
    
    def generate_puzzle_info(self) -> dict:
        '''
        Utility function to find the positions at which a new word starts
        front end needs
            - word
            - all positions on the board containing the word
            - what number to assign it
            - if its down or across
            how i envision clues changes to 
            puzzle_info : [
                {
                    'word': 'math',
                    'positions': [ [0,0], [0,1], [0,2], [0,3], [0,4] ],
                    'clues': {
                        'Monday': []...
                    },
                    'order': 1,
                    'dir': 'across'
                }
            ]
        '''
        # loop left to right and then down
        currow, curcol, counter, incrementCounter = 0, 0, 1, False
        for row in self._board:
            curcol = 0
            for char in row:
                print(f"Checking position [{currow},{curcol}]")
                if (currow == 0 and char != '-') or (currow != 0 and self._board[currow-1][curcol] == '-' and char != '-'): # new down word
                    print("Found a new word")
                    word_info = {}
                    word_info['dir'] = 'down'
                    word_info['order'] = counter
                    word_info['word'] = ''
                    word_info['positions'] = []
                    for i in range(currow, 5, 1):
                        if self._board[i][curcol] == '-':
                            break
                        word_info['word'] += self._board[i][curcol]
                        word_info['positions'].append( f"{i},{curcol}" )
                    print(f"Info on the word is {word_info}")
                    word_info['clues'] = self._clues[word_info['word']]
                    self._puzzle_info.append(deepcopy(word_info))
                    incrementCounter = True
                if (curcol == 0 and char != '-') or (curcol != 0 and self._board[currow][curcol-1] == '-' and char != '-'): # new across word
                    print("Found a new word")
                    word_info = {}
                    word_info['dir'] = 'across'
                    word_info['order'] = counter
                    word_info['word'] = ''
                    word_info['positions'] = []
                    for j in range(curcol, 5, 1):
                        if row[j] == '-':
                            break
                        word_info['word'] += row[j]
                        word_info['positions'].append( f"{currow},{j}" )
                    print(f"Info on the word is {word_info}")
                    word_info['clues'] = self._clues[word_info['word']]
                    self._puzzle_info.append(deepcopy(word_info))
                    incrementCounter = True
                if incrementCounter:
                    incrementCounter = False
                    counter += 1
                curcol += 1
            currow += 1

    
    def get_hardest_fills(self, con) -> dict:
        '''
        Get the hardset fills left in the board and return those
        '''
        fill_state = deepcopy(self._previous_fills[-1])
        # print(fill_state.keys())
        result, hardest = {}, float("inf")
        for i, row in enumerate(self._board):
            if '_' not in row: # continue if row is done
                continue
            black_locations = set(i for i, char in enumerate(row) if char == '-')
            letter_locations = set(i for i in range(self._length)) - black_locations
            pat = ''.join(row).strip('-')
            length = len(pat)
            # figure out where the word starts and ends
            start_loc = min(letter_locations)
            end_loc = max(letter_locations)
            if pat in fill_state: # don't go out to database if we previously checked this pattern in a previous cycle
                possible_words = fill_state[pat]
            else:
                with con:
                    cur = con.cursor()
                    cur.execute(f"SELECT DISTINCT Answer FROM AnswerClueDB WHERE Answer LIKE '{pat}';")
                    possible_words = [ row[0] for row in cur.fetchall()]
                    fill_state[pat] = possible_words
            if len(possible_words) < hardest:
                hardest = len(possible_words)
                result = {
                    'direction': 'across',
                    'pat': pat,
                    'possible_words': possible_words,
                    'index': i,
                    'start': start_loc,
                    'end': end_loc,
                }
        columns = [ ''.join([row[i] for row in self._board]) for i in range(5) ]
        for i, col in enumerate(columns):
            if '_' not in col: # continue if word is done
                continue
            black_locations = set(i for i, char in enumerate(col) if char == '-')
            letter_locations = set(i for i in range(self._length)) - black_locations
            # print(f"Black Locations: {black_locations}")
            pat = ''.join(col).strip('-')
            length = len(pat)
            # figure out where the word starts and ends
            start_loc = min(letter_locations)
            end_loc = max(letter_locations)
            if pat in fill_state: # don't go out to database if we previously checked thius pattern last cycle
                possible_words = fill_state[pat]
            else:
                with con:
                    cur = con.cursor()
                    cur.execute(f"SELECT DISTINCT Answer FROM AnswerClueDB WHERE Answer LIKE '{pat}';")
                    possible_words = [ row[0] for row in cur.fetchall()]
                    fill_state[pat] = possible_words
            if len(possible_words) < hardest:
                hardest = len(possible_words)
                result = {
                    'direction': 'down',
                    'pat': pat,
                    'possible_words': possible_words,
                    'start': start_loc,
                    'index': i,
                    'end': end_loc,
                    'length': length
                }
        # print(result)
        self._previous_fills.append(fill_state)
        return result  


    def fill_board(self, word: str, direction: str, index: int, start: int, end: int) -> None:
        '''
        Fill word into desired space on board
        '''
        counter = 0
        if direction == 'across':
            for i in range(start, end+1, 1):
                self._board[index][i] = word[counter]
                counter += 1
        else:
            for i in range(start, end+1, 1):
                self._board[i][index] = word[counter]
                counter += 1


    def check_completion(self, con) -> bool:
        '''
        Checks if board is finished or not
        '''
        # do one final check of all the answers
        # print("Checking Completion")
        patterns = self.get_patterns(True)
        for pat in patterns:
            with con:
                cur = con.cursor()
                cur.execute(f"SELECT COUNT(*) FROM AnswerClueDB WHERE Answer='{pat}';")
                count = cur.fetchone()[0]
                # print(f"Pattern: {pat}, Count: {count}")
                if count == 0:
                    return False
        return True

    
    def generate_clues(self, con) -> None:
        '''
        Utility function to pull all of the clues from the db
            - idea is for users to be able to select varying difficulty clues
        '''
        answers = self.get_patterns(True)
        days = "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"
        clues = {
            answer: {
                day: [] for day in days.split(",")
            } for answer in answers
        }
        with con:
            for answer in answers:
                cur = con.cursor()
                cur.execute(f"SELECT DISTINCT Clue, Day_of_Week FROM AnswerClueDB WHERE Answer = '{answer}';")
                clue_day_map = [ (row[0], row[1]) for row in cur.fetchall() ]
                for clue, day in clue_day_map:
                    clues[answer][day].append(clue)
            self._clues = clues
        # for key, value in self._clues.items():
        #     print(f"Word- {key}")
        #     print(f"Clues- {value}")

    
    def generate_grid(self) -> None:
        '''
        General idea is for a backtracking algorithm
        We want to keep a 2d dp array to find the next best fillin spot
            - this will be weighted by some score that will consist of closest to the upper left corner and number of chars to the left or above of current space
        '''
        # step 0 - initiate connection to database
        con = sqlite3.connect(dbPath)

        # step 1 - begin loop and initialize
        attempt_counter = defaultdict(int)
        self._previous_states.append(deepcopy(self._board))
        # add and statement here to check all words on board are in db
        while not self._done:
        # while any('_' in row for row in self._board):  # change this to a self._done var or something, since we check completion after every loop anyway

            # print("New Iteration of loop")
            # print("Current Board:")
            # print(self)
            # print("Previous States")
            # print(self._previous_states)

            # new step 2 - get hardset fills left for acrosses and downs
            # print("Step 2- Get Hardest Fills")
            data = self.get_hardest_fills(con)

            # step 3 - make sure we aren't infinite looping
            # print("Step 3- Choose word")
            outer_flag = False
            for attempt_no in itertools.count():
                chosen_word = random.choice(data['possible_words'])
                # print(f"Attempt {attempt_no} -- {chosen_word}")
                if attempt_counter[chosen_word] <= 2:
                    break
                if attempt_no > 10 and attempt_counter[chosen_word] > 1:
                    # print("No new words to try, returning to previous state")
                    try: # go back 1 state
                        self._board = self._previous_states.pop()
                        self._previous_fills.pop()
                    except:
                        print("RESET-1")
                        self.reset() # if we pop from an empty queue, simply restart
                        attempt_counter.clear()
                    outer_flag = True
                    break
            if outer_flag:
                continue

            # step 4 - fill word onto board
            # print("Step 4- Fill word onto board")
            self.fill_board(chosen_word, data['direction'], data['index'], data['start'], data['end'])
            attempt_counter[chosen_word] += 1

            # step 5 - get patterns left on the board, if the board is full, check for existence of every word in db
            # print(f"\n  ----- Beginning Step 5 -----  ")
            print(f"Current board:\n{self}")
            # print("Step 5- check completion")
            patterns = self.get_patterns()
            flag = True
            # print(f"patterns: {patterns}")
            if len(patterns) == 0: # the board has no _ squares
                finished = self.check_completion(con)
                if finished:
                    self._done = True
                    self.generate_clues(con)
                    self.generate_puzzle_info()
                    break
                else:
                    flag = False
            else: # board has at least one _ square
                for pat in patterns:
                    with con:
                        cur = con.cursor()
                        cur.execute(f"SELECT DISTINCT Answer FROM AnswerClueDB WHERE Answer LIKE '{pat}';")
                        possible_words = [ row[0] for row in cur.fetchall()]
                        if len(possible_words) == 0: # case 1 - pattern doesn't exist in database -> return to previous board state
                            flag = False
                            break
                        else: # case 2 - all patterns exist in database -> do nothing
                            # print(f"Pattern {pat} still have {len(possible_words)} viable fills")
                            pass
            if not flag:
                # print(f"NO MORE POSSIBLE FILLS FOR {pat}... return board to previous state")
                try:
                    self._board = self._previous_states.pop()
                    self._previous_fills.pop()
                except:
                    print("RESET-2")
                    self.reset() # if we pop from an empty queue, simply restart
                    attempt_counter.clear()
            
            # print the queue
            # for i, state in enumerate(self._previous_states):
                # print(f"State {i}\n{state}")

            self._previous_states.append(deepcopy(self._board))

    
    def jsonify(self) -> None:
        data = {
            'board': self._board,
            'across': [ item for item in self._puzzle_info if item['dir'] == 'across'],
            'down': [ item for item in self._puzzle_info if item['dir'] == 'down']
        }
        print(data)
        return data