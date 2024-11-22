import React from 'react';
import logo from '../../assets/logo.png';
import Options from '../Options/Options';

function Navbar({ status, setStatus, board, setBoard, down, setDown, across, setAcross}){

	const [showOptions, setShowOptions] = React.useState(false);

	let optionsClass;
	if(!showOptions){
		optionsClass = 'hidden';
	}else{
		optionsClass = '';
	}

    return (
        <nav className="bg-sky-200 border-sky-400 border-4 rounded-lg">
            <div className="flex justify-center m-4 border-b-4 pb-2 border-sky-900">
                <img src={logo} className="h-10" alt="Crossword Logo"/>
                <span className="text-3xl font-semibold whitespace-nowrap text-sky-900 ms-4">Crossword Utility</span>
                <button type="button" className="ms-2 p-2 focus:ring-4 rounded-lg focus:ring-sky-900 hover:bg-sky-400" onClick={() => setShowOptions(!showOptions)}>
                    <svg className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                    </svg>
                </button>
            </div>
            <div id="options" className={optionsClass}>
				<Options status={status} setStatus={setStatus} board={board} setBoard={setBoard} down={down} setDown={setDown} across={across} setAcross={setAcross}/>
			</div>
        </nav>
    )
}

export default Navbar;