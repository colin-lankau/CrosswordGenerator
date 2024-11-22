export const checkFull = (userBoard, cellRefs) => {
    console.log("Checking if full");
    let full = true;
    for(let cell in userBoard){
        console.log(`Checking cell ${cell}, value is ${userBoard[cell]}`);
        if(userBoard[cell] == '' && cellRefs.current[cell].className != 'blacksquare'){
            full = false;
        }
    }
    console.log(full);
    return full;
}

export const shiftNext = (position, dir, across, down, allCells, setDir, setActiveCell, setHighlightedCells, setActiveWord) => {
    // get all positions in order so we can just simply loop through them
    let curDir = dir == 'across' ? 'across' : 'down'; // do this to stop state stale values
    let curPosition = position;
    let acrossPositions = [];
    across.forEach( (item) => {
        item.positions.forEach( (pos) => {
            acrossPositions.push(pos);
        })
    })
    let downPositions = [];
    down.forEach( (item) => {
        item.positions.forEach( (pos) => {
            downPositions.push(pos);
        })
    })
    let map = {
        'across': acrossPositions,
        'down': downPositions
    };
    let nextIndex;
    nextIndex = map[curDir].indexOf(curPosition) + 1;
    while(true){
        let nextPosition = map[curDir][nextIndex];
        if(nextIndex == map[curDir].length){ // reached the end, switch directions
            nextIndex = 0;
            if(curDir == 'across'){
                curDir = 'down';
            }else{
                curDir = 'across';
            }
            continue;
        }
        if(allCells.current[nextPosition].value != ''){ // cell is already full, so skip
            nextIndex++;
            continue;
        }
        // move to next available cell and change all game contexts
        setActiveCell(nextPosition);
        let info = curDir == 'across' ? across : down;
        for(let obj of info){
            if(obj.positions.includes(nextPosition)){
              setHighlightedCells([...obj.positions]);
              setActiveWord(obj.word);
            }
        }
        allCells.current[nextPosition].focus();
        console.log("Successfully shifted");
        setDir(curDir);
        break;
    }
}

export const shiftPrevious = (position, dir, across, down, allCells, setDir, setActiveCell, setHighlightedCells, setActiveWord) => {
    // get all positions in order so we can just simply loop through them
    let curDir = dir == 'across' ? 'across' : 'down'; // do this to stop state stale values
    let curPosition = position;
    let acrossPositions = [];
    across.forEach( (item) => {
        item.positions.forEach( (pos) => {
            acrossPositions.push(pos);
        })
    })
    let downPositions = [];
    down.forEach( (item) => {
        item.positions.forEach( (pos) => {
            downPositions.push(pos);
        })
    })
    let map = {
        'across': acrossPositions,
        'down': downPositions
    };
    let nextIndex;
    nextIndex = map[curDir].indexOf(curPosition) - 1;
    while(true){
        let nextPosition = map[curDir][nextIndex];
        console.log(nextIndex);
        if(nextIndex == -1){ // reached the end, switch directions
            if(curDir == 'across'){
                curDir = 'down';
                nextIndex = map['down'].length - 1;
            }else{
                curDir = 'across';
                nextIndex = map['across'].length - 1;
            }
            continue;
        }
        // move backwards to next available cell and change all game contexts
        setActiveCell(nextPosition);
        let info = curDir == 'across' ? across : down;
        for(let obj of info){
            if(obj.positions.includes(nextPosition)){
              setHighlightedCells([...obj.positions]);
              setActiveWord(obj.word);
            }
        }
        allCells.current[nextPosition].focus();
        console.log("Successfully shifted backwards");
        setDir(curDir);
        break;
    }
}

export const shiftNextWord = (position, dir, across, down, allCells, setDir, setActiveCell, setHighlightedCells, setActiveWord) => {
    let curDir = dir == 'across' ? 'across' : 'down'; // do this to stop state stale values
    let curPosition = position;
    let map = {
        'across': across,
        'down': down
    };
    let nextPositions;
    let count = 0;
    for(let info of map[curDir]){
        if(info.positions.includes(curPosition)){
            break;
        }
        count++;
    }
    let nextIndex = count + 1;
    while(true){
        console.log(`Checking ${nextIndex}, ${curDir}`);
        if(nextIndex == map[curDir].length){ // on last word so swap dir
            console.log("swapping dir");
            nextIndex = 0;
            if(curDir == 'across'){
                curDir = 'down';
            }else{
                curDir = 'across';
            }
            continue;
        }
        nextPositions = map[curDir][nextIndex].positions;
        let [firstEmpty, isFull] = checkFullWord(nextPositions, allCells);
        if(isFull){ // word is full so we go to next word
            console.log("Word is full go next")
            nextIndex++;
            continue;
        }
        // found next available word
        setActiveCell(firstEmpty);
        for(let obj of map[curDir]){
            if(obj.positions.includes(firstEmpty)){
              setHighlightedCells(nextPositions);
              setActiveWord(obj.word);
            }
        }
        allCells.current[firstEmpty].focus();
        console.log("Successfully found next word");
        setDir(curDir);
        break;
    }
}

const checkFullWord = (positions, allCells) => {
    for(let pos of positions){
        if(allCells.current[pos].value == ''){
            return [pos, false];
        }
    }
    return ['', true];
}

export const handleVerticalShift = (position, highlightedCells, dir, down, allCells, arrow, setDir, setActiveCell, setHighlightedCells, setActiveWord) => {
    let curPosition = position;
    let curPositions = [...highlightedCells];
    let curDir = dir == 'across' ? 'across' : 'down';
    if(curDir == 'down'){ // shift cell either up or down
        console.log("shift cell " + arrow);
        if( (curPosition == curPositions[0] && arrow == 'up') || (curPosition == curPositions.at(-1) && arrow == 'down')){ // at top of word and trying to go up or inverse
            console.log("At top or bottom of word");
            return;
        }
        let newrow;
        if(arrow == 'down'){
            newrow = parseInt(curPosition.split(",")[0]) + 1;
        }else if(arrow == 'up'){
            newrow = parseInt(curPosition.split(",")[0]) - 1;
        }
        let newPosition = `${newrow}${curPosition.slice(-2)}`;
        console.log(`Setting new position ${newPosition}`);
        setActiveCell(newPosition);
        allCells.current[newPosition].focus();
    }else if(curDir == 'across'){ // simply rotate highlightedCells, activeCell does not change
        curDir = 'down';
        let newPositions;
        for(let info of down){
            if(info.positions.includes(curPosition)){
                newPositions = [...info.positions];
                setActiveWord(info.word);
                break;
            }
        }
        setHighlightedCells(newPositions);
        setDir(curDir);
    }
}

export const handleHorizontalShift = (position, highlightedCells, dir, across, allCells, arrow, setDir, setActiveCell, setHighlightedCells, setActiveWord) => {
    let curPosition = position;
    let curPositions = [...highlightedCells];
    let curDir = dir == 'across' ? 'across' : 'down';
    if(curDir == 'across'){ // shift cell either left or right
        console.log("shift cell " + arrow);
        if( (curPosition == curPositions[0] && arrow == 'left') || (curPosition == curPositions.at(-1) && arrow == 'right')){ // at top of word and trying to go up or inverse
            console.log("At start or end of word");
            return;
        }
        let newcol;
        if(arrow == 'left'){
            newcol = parseInt(curPosition.split(",")[1]) - 1;
        }else if(arrow == 'right'){
            newcol = parseInt(curPosition.split(",")[1]) + 1;
        }
        let newPosition = `${curPosition.slice(0,2)}${newcol}`;
        console.log(`Setting new position ${newPosition}`);
        setActiveCell(newPosition);
        allCells.current[newPosition].focus();
    }else if(curDir == 'down'){ // simply rotate highlightedCells, activeCell does not change
        curDir = 'across';
        let newPositions;
        for(let info of across){
            if(info.positions.includes(curPosition)){
                newPositions = [...info.positions];
                setActiveWord(info.word);
                break;
            }
        }
        setHighlightedCells(newPositions);
        setDir(curDir);
    }
}

export const isAllToLeftCorrect = (positions, curPosition, userBoard, correctBoard, dir) => {
    const CONSTANT = dir === 'across' ? curPosition.split(",")[0] : curPosition.split(",")[1];
    let status = true;
    let index = positions.indexOf(curPosition);
    for(let i=index-1; i>=0; i--){
        if(dir == 'across'){
            var checkPosition = [CONSTANT, i];
        }else{
            var checkPosition = [i, CONSTANT];
        }
        if(userBoard[positions[i]] != correctBoard[checkPosition[0]][checkPosition[1]]){
            status = false;
        }
    }
    return status;
}