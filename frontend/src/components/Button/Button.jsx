import React from 'react';
import './Button.css';
import { GameContext } from '../GameContext';

function Button({setDown, setAcross, setBoard, status, setStatus, children, ...rest}) {

  const { setActiveCell, setHighlightedCells, setActiveWord } = React.useContext(GameContext);

  const generateCrossword = async () => {
    setStatus('loading');
    const response = await fetch('http://127.0.0.1:5000/generate_grid', {
      method: 'GET'
    });
    const json = await response.json();
    setStatus('success');
    console.log(json);
    setBoard(json.board);
    setDown(json.down);
    setAcross(json.across);
    // set activeCell, activeWord, and highlightedCells
    console.log("Setting gameContexts");
    let row = json.board[0];
    for(let i=0; i<row.length; i++){
      let char = row[i];
      if(char != '-'){
        console.log(`Active Cell = ${0},${i}`);
        setActiveCell(`${0},${i}`);
        for(let info of json.across){
          // new way to if the positions includes a list
          if(info.positions.includes(`0,${i}`)){
            setHighlightedCells([...info.positions]);
            setActiveWord(info.word);
            console.log(`highlightedCells = ${info.positions}`);
            console.log(`activeWord = ${info.word}`);
          }
        }
        break;
      }
    }
  }

  return (
    <div>
        <button type="button" className="btn btn-blue" onClick={generateCrossword} {...rest}>{children}</button>
    </div>
  )
}

export default Button;