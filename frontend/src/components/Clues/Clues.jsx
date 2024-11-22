import React from 'react';
import { daysOfWeek, sample } from '../../utils';
import { GameContext } from '../GameContext.jsx';
import './Clues.css';

function Clues({ down, across, cells, clues }){

    return (
        <div className='ms-16'>
            <h1 className='directionTitle'>Across</h1>
            {across.map( (obj) => {
                return (
                    <div className="rightColumn" key={obj.word}>
                        <Clue word={obj.word} positions={obj.positions} order={obj.order} possibleClues={obj.clues} clueRefs={clues} cellRefs={cells}/>
                    </div>
                )
            })}
            <br/>
            <h1 className='directionTitle'>Downs</h1>
            {down.map( (obj) => {
                return (
                    <div className="rightColumn" key={obj.word}>
                        <Clue word={obj.word} positions={obj.positions} order={obj.order} possibleClues={obj.clues} clueRefs={clues} cellRefs={cells}/>
                    </div>
                )
            })}
        </div>
    )
}

function Clue({ word, positions, order, possibleClues, clueRefs, cellRefs }){

    const { 
        setActiveCell, 
        setHighlightedCells, 
        activeWord, setActiveWord,
        userBoard
    } = React.useContext(GameContext);
    const seen = React.useRef(new Set());
    const addSeen = (c) => {
        seen.current.add(c);
    }
    const resetSeen = () => {
        seen.current = new Set();
    }
    const pickNextClue = () => {
        let clue = null;
        outerLoop:
        for(let day of daysOfWeek){
            if(possibleClues[day].length != 0){
                for(let c of possibleClues[day]){
                    if(seen.current.has(c)){
                        continue;
                    }else{
                        clue = c;
                        break outerLoop;
                    }
                }
            }
            // reset if we've seen all clues
            if(day == 'Sunday' && clue == null){
                resetSeen();
                clue = pickNextClue();
            }
        }
        addSeen(clue);
        return clue;
    }
    const [curClue, setCurClue] = React.useState( () => {
        return pickNextClue();
    });

    // generate class for btn 1
    let className = 'clueBtn';
    if(word == activeWord){
        className += ' highlighted';
    }

    // generate class for text inside btn 1
    let textClass = 'clue done';
    for(let pos of positions){
        if(userBoard[pos] == ''){
            textClass = 'clue notDone';
            break;
        }
    }

    // generate class for swap btn
    let swapClass = 'swapBtn btn';
    if(word == activeWord){
        swapClass += ' btn-blue';
    }else{
        swapClass += ' btn-gray';
    }

    const handleClick = () => {
        console.log(`Clue clicked for word: ${word}`);
        setHighlightedCells([...positions]);
        setActiveCell(positions[0]);
        setActiveWord(word);
    }

    const handleSwap = () => {
        let clue = pickNextClue();
        setCurClue(clue);
    }

    return (
        <div className="flex w-full">
            <button 
                ref={ (element) => { clueRefs.current[`${word}`] = element } } 
                onClick={() => handleClick()} 
                className={className}
            >
                <div className={textClass}><b>{order}.</b>{' '}{curClue}</div>
            </button>
            <button 
                onClick={() => handleSwap()}
                className={swapClass}
            >Swap</button>
        </div>
    )
}

export default Clues