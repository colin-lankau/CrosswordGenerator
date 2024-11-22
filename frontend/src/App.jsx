import React from 'react';
import './App.css';
import Button from './components/Button/Button';
import Game from './components/Game/Game';
import GameProvider from './components/GameContext';
import Navbar from './components/Navbar/Navbar';
import { GameContext } from './components/GameContext';

function App() {

  const [status, setStatus] = React.useState('idle');
  const [board, setBoard] = React.useState( () => {
    let initialState = [];
    for(let i=0; i<5; i++){
      let row = [];
      for(let j=0; j<5; j++){
        row.push('');
      }
      initialState.push(row);
    }
    return initialState;
  });
  const [down, setDown] = React.useState([]);
  const [across, setAcross] = React.useState([]);


  return (
    <GameProvider>
      {/* Use context of autocheck in a navbar where navbar contains autocheck button and generate crossword button */}
      <Navbar status={status} setStatus={setStatus} board={board} setBoard={setBoard} down={down} setDown={setDown} across={across} setAcross={setAcross}/>
      <Game board={board} down={down} across={across}/>
    </GameProvider>
  )
}

export default App
