import React from 'react';
import './Board.css';
import { range, validchars } from '../../utils.js';
import { GameContext } from '../GameContext.jsx';
import { checkFull, shiftNext, shiftPrevious, handleVerticalShift, handleHorizontalShift, isAllToLeftCorrect } from '../../../GameUtils';

function Board({ board, cells, clues, down, across}) {

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("submitted form");
    }

  return (
    <form onSubmit={handleSubmit}>
        <div className="container mt-5">
            {range(5).map( (i) => {
                return range(5).map( (j) => {
                    return <Cell 
                        key={`cell${i},${j}`} 
                        correctValue={board[i][j]} 
                        row={i}
                        col={j}
                        cells={cells}
                        down={down}
                        across={across}
                        board={board}
                    />
                })
            })}
        </div>
    </form>
  )
}

function Cell({ correctValue, row, col, cells, down, across, board }) {

    const position = `${row},${col}`;
    const downPositions = React.useMemo( () => {
        for(let obj of down){
            if(obj.positions.includes(position)){
                return [...obj.positions];
            }
        }
    }, [down]);
    const acrossPositions = React.useMemo( () => {
        for(let obj of across){
            if(obj.positions.includes(position)){
                return [...obj.positions];
            }
        }
    }, [across]);
    const downWord = React.useMemo( () => {
        for(let obj of down){
            if(obj.positions.includes(position)){
                return obj.word;
            }
        }
    }, [down]);
    const acrossWord = React.useMemo( () => {
        for(let obj of across){
            if(obj.positions.includes(position)){
                return obj.word;
            }
        }
    }, [across]);
    const order = React.useMemo( () => {
        let o = null;
        for(let obj of across){
            if(obj.positions[0] == position){
                o = obj.order;
            }
        }
        if(o == null){
            for(let obj of down){
                if(obj.positions[0] == position){
                    o = obj.order;
                }
            }
        }
        return o;
    }, [across]);
    const { autocheck } = React.useContext(GameContext);
    const { dir, setDir } = React.useContext(GameContext);
    const { activeCell, highlightedCells, setActiveCell, setHighlightedCells, setActiveWord, userBoard, setUserBoard } = React.useContext(GameContext);
    const isCorrect = userBoard[position] === correctValue;

    var className = 'cell';
    if(correctValue == '-'){
        className = 'blacksquare';
    }else if(autocheck){
        if(isCorrect){
            className += ' correctCell';
        }else if(userBoard[position] != '' && !isCorrect){
            className += ' incorrectCell';
        }
    }
    if(position == activeCell){
        className += ' activated';
    }else if(position != activeCell && highlightedCells.includes(position)){
        className += ' highlighted';
    }

    // add listener to switch directions on double click
    React.useEffect( () => {
        function handleClick(){
            console.log(`CLICKED CELL ${position}: CURRENT DIR: `+dir);
            let curdir = null
            // check if its a double click, if it is, switch directions
            if(activeCell == position){
                console.log("CLICKING ON AN ACTIVATED CELL");
                if(dir == 'across'){
                    // info = [...down];
                    curdir = 'down';
                    setDir('down');
                }else{
                    // info = [...across];
                    curdir = 'across';
                    setDir('across');
                }
            }
            // if not double click => set new activeCell, highlightedCells, and activeWord
            if(curdir == null){
                if(dir == 'across'){
                    // info = [...across];
                    curdir = 'across';
                }else{
                    // info = [...down];
                    curdir = 'down';
                }
            }
            setActiveCell(position);
            if(curdir == 'across'){
                setHighlightedCells(acrossPositions);
                setActiveWord(acrossWord);
            }else if(curdir == 'down'){
                setHighlightedCells(downPositions);
                setActiveWord(downWord);
            }
        }
        cells.current[position].addEventListener("click", handleClick);
        return () => {
            cells.current[position].removeEventListener("click", handleClick);
        }
    }, [activeCell, dir]);

    // 
    React.useEffect( () => {

    }, )

    const setUserBoardValue = (val) => {
        let copy = {...userBoard};
        copy[position] = val;
        setUserBoard(copy);
    }
    
    const handleKeyDown = (e) => {
        let key = e.key;
        let value = userBoard[position];
        console.log(key);
        if(key == "Backspace"){
            let shouldShiftBack = true;
            if(activeCell == highlightedCells[0] && value != ''){ // if at start of word, dont go back yet
                shouldShiftBack = false;
            }
            if(autocheck && activeCell != highlightedCells[0] && isAllToLeftCorrect( (dir === 'across' ? acrossPositions : downPositions), position, userBoard, board, dir ) && value != ''){ 
                // if at first empty/incorrect cell in word, and autocheck is on, then stay at cell
                shouldShiftBack = false;
            }
            if(!(autocheck && isCorrect)){  // only remove char if its wrong, or autocheck is off
                setUserBoardValue('');
            }
            // possibly add another override behavior, for if you are on a correct cell and press backspace
            if(autocheck && isCorrect){
                shouldShiftBack = true;
            }
            if(shouldShiftBack){
                shiftPrevious(position, dir, across, down, cells, setDir, setActiveCell, setHighlightedCells, setActiveWord, autocheck, userBoard, board);
            }
        }else if(key == 'ArrowUp'){
            e.preventDefault();
            handleVerticalShift(position, highlightedCells, dir, down, cells, 'up', setDir, setActiveCell, setHighlightedCells, setActiveWord);
        }else if(key == 'ArrowDown'){
            e.preventDefault();
            handleVerticalShift(position, highlightedCells, dir, down, cells, 'down', setDir, setActiveCell, setHighlightedCells, setActiveWord);
        }else if(key == 'ArrowLeft'){
            e.preventDefault();
            handleHorizontalShift(position, highlightedCells, dir, across, cells, 'left', setDir, setActiveCell, setHighlightedCells, setActiveWord);
        }else if(key == 'ArrowRight'){
            e.preventDefault();
            handleHorizontalShift(position, highlightedCells, dir, across, cells, 'right', setDir, setActiveCell, setHighlightedCells, setActiveWord);
        }else if(validchars.includes(key)){
            e.preventDefault();
            // if autocheck is on and the cell is already correct, dont let user change value
            if(autocheck && isCorrect){
                return;
            }
            setUserBoardValue(key.toUpperCase());
            if(!checkFull(userBoard, cells)){ // shift to next cell if not full
                shiftNext(position, dir, across, down, cells, setDir, setActiveCell, setHighlightedCells, setActiveWord, autocheck, userBoard, board);
            }else{
                alert("board is full");
            }
        }else{
            console.log("Invalid Key was pressed in handleKeyDown");
        }
    }

    return (
        <div className="cellContainer">
            {order && <span className="cellNumber">{order}</span>}
            <input 
                ref={ (element) => cells.current[position] = element} 
                className={className}
                type="text"
                value={userBoard[position]}
                onKeyDown={ (e) => {
                    handleKeyDown(e) 
                }}
                onKeyUp={ (e) => {
                    e.preventDefault();
                }}
                onFocus={ (e) => {
                    e.currentTarget.setSelectionRange(
                        e.currentTarget.value.length,
                        e.currentTarget.value.length
                    )
                }}  
                disabled={className === 'blacksquare'}
            />
        </div>
    )
}

export default Board