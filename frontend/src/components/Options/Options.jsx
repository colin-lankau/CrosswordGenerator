import React from 'react';
import Button from '../Button/Button';
import { daysOfWeek } from '../../utils';
import { GameContext } from '../GameContext.jsx';
import { generateCrossword } from '../../../GameUtils';

function Options({ status, setStatus, board, setBoard, down, setDown, across, setAcross}) {

    // possibly also add a date range picker
    const [day, setDay] = React.useState('None');
    const [grid, setGrid] = React.useState('None');
    const {autocheck, setAutocheck, setActiveCell, setHighlightedCells, setActiveWord, setUserBoard} = React.useContext(GameContext);

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
                <Button 
                    onClick={() => generateCrossword(setStatus, setBoard, setDown, setAcross, setActiveCell, setHighlightedCells, setActiveWord, setUserBoard)}
                    disabled={status == 'loading'}
                >
                    { status == 'loading' ? 
                        <>
                            Generating Crossword
                            <svg aria-hidden="true" role="status" class="inline ms-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </> : 
                        'Generate Crossword'
                    }
                </Button>
            </div>
        </div>
    )
}

export default Options