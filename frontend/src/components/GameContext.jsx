import React from 'react';

export const GameContext = React.createContext();

function GameProvider({ children }) {
    const [autocheck, setAutocheck] = React.useState(false);
    const [dir, setDir] = React.useState('across');
    const [activeCell, setActiveCell] = React.useState('');
    const [highlightedCells, setHighlightedCells] = React.useState([]);
    const [activeWord, setActiveWord] = React.useState('');
    const [userBoard, setUserBoard] = React.useState( () => {
        let b = {};
        for(let i=0; i<5; i++){
            for(let j=0; j<5; j++){
                b[`${i},${j}`] = '';
            }
        }
        return b
    })

    return (
        <GameContext.Provider
            value={{
                autocheck, setAutocheck, 
                dir, setDir, 
                activeCell, setActiveCell, 
                highlightedCells, setHighlightedCells,
                activeWord, setActiveWord,
                userBoard, setUserBoard
            }}
        >
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;