import React from 'react';
import Button from '../Button/Button';
import { daysOfWeek } from '../../utils';
import { GameContext } from '../GameContext.jsx';

function Options({ status, setStatus, board, setBoard, down, setDown, across, setAcross}) {

    // possibly also add a date range picker
    const [day, setDay] = React.useState('None');
    const [grid, setGrid] = React.useState('None');
    const {autocheck, setAutocheck} = React.useContext(GameContext);

  return (
    <div>
        <div className='grid grid-cols-3 px-5 pb-5 gap-5 border-b-4 border-sky-900'>
            <div>
                <label htmlFor="difficulty" className='float-start ms-2 text-lg'>Choose Difficulty</label>
                <select id="difficulty" value={day} onChange={e => setDay(e.target.value)} className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value='None'>None</option>
                    {daysOfWeek.map( day => {
                        return <option key={day} value={day}>{day}</option>
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="grid" className='float-start ms-2 text-lg'>Choose Grid Layout</label>
                <select id="grid" value={grid} onChange={e => setGrid(e.target.value)} className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option value='None'>None</option>
                </select>
            </div>
            <div>
                <input checked={autocheck} onChange={e => setAutocheck(e.target.checked)} id="autocheck" type="checkbox" value="" className="accent-green-500 w-5 h-5 bg-gray-100 border-gray-300 rounded focus:ring-green-600 focus:ring-2"/>
                <label htmlFor="autocheck" className="ms-2 text-lg">Autocheck</label>
            </div>
        </div>
        <div className='my-3'>
            <Button setDown={setDown} setAcross={setAcross} setBoard={setBoard} status={status} setStatus={setStatus} disabled={status === 'loading'}>Generate Crossword</Button>
        </div>
    </div>
  )
}

export default Options