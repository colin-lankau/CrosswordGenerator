import React from "react";
import Board from "../Board/Board";
import Clues from "../Clues/Clues";
import { GameContext } from '../GameContext.jsx';
import { shiftNextWord } from "../../../GameUtils";

function Game({ board, down, across }){

    const cells = React.useRef({});
    const clues = React.useRef({});
    const { dir, setDir } = React.useContext(GameContext);
    const { 
        activeCell, setActiveCell, 
        highlightedCells, setHighlightedCells, 
        activeWord, setActiveWord,
        fullBoard
    } = React.useContext(GameContext);

    React.useEffect( () => {
        const handleKeyPress = (event) => {
            if(event.key == 'Enter'){
                console.log("Enter key was pressed");
                shiftNextWord(activeCell, dir, across, down, cells, setDir, setActiveCell, setHighlightedCells, setActiveWord);
            }
        }
        window.addEventListener("keydown", handleKeyPress)
        return () => {
            window.removeEventListener("keydown", handleKeyPress)
        }
    }, [dir, activeCell])
    

    // React.useEffect( () => {
    //     if(fullBoard){
    //         alert("Board is full");
    //     }
    // }, [fullBoard])

    // console.log("---On Game Remount---");
    // console.log(`curCell: ${activeCell}`);
    // console.log(`curHighlightedCells: ${highlightedCells}`);
    // console.log(`curWord: ${activeWord}`);

    return (
        <div className='flex justify-between pt-3'>
            <div className='w-1/2'>
                <Board 
                    board={board} 
                    cells={cells} 
                    clues={clues} 
                    down={down} 
                    across={across}
                />
            </div>
            <div className='w-1/2'>
                <Clues 
                    down={down} 
                    across={across} 
                    cells={cells} 
                    clues={clues}
                />
            </div>
        </div>
    )
}

export default Game