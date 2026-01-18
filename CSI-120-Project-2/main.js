const board = document.getElementById('board');
const cell = document.getElementsByClassName('cell');
const gameStatus = document.getElementById('gameStatus')
const newGameButton = document.getElementById('newGame');
let array = [" ", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let emptyCell = 0;

//Shuffles the array of numbers and assigns them to their respective cells
//Nothing copied, but i got the idea for shuffling like this from "https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array"
function shuffleNumbers(){
    for(let i = 15; i > 0; i--){
        let j = Math.floor(Math.random() * (1 + i));
        [array[i], array[j]] = [array[j], array[i]];
    }
    checkSolvable();
}

//Checks if Puzzle is Solvable with some math formula I got from "https://www.cs.princeton.edu/courses/archive/spring21/cos226/assignments/8puzzle/specification.php"
function checkSolvable(){
    let inversions = 0;
    for(let index = 0; index < 16; index++){
        for(let jindex = index+1; jindex < 16; jindex++){
            if (array[index] > array[jindex]) inversions++;
        }
    }
    let emptyRow = Math.floor(emptyCell / 4);
    inversions+= emptyRow;
    //console.log(inversions);

    if(inversions % 2 != 0){
        //console.log("solvable")
    }
    else shuffleNumbers();
}

//Starts a new game
function newGame(){
    gameStatus.innerHTML = "Can you solve this kids puzzel?"
    shuffleNumbers();
    for(let index = 0; index < 16; index++){
        cell[index].classList.remove('empty')
        cell[index].classList.remove('correct')
        cell[index].innerHTML = array[index];
        if(array[index] == " "){
            emptyCell = index;
            cell[index].classList.add('empty')
        }
        if(array[index] == index + 1){
            cell[index].classList.add('correct')
        }
    }
    //console.log(emptyCell)
}

//swaps pireces if they are ajacent and changes their classes accordingly
function swapPieces(index){
    if( (index == emptyCell-1 && emptyCell % 4 != 0)||
        (index == emptyCell+1 && emptyCell % 4 != 3)||
        (index == emptyCell-4)||
        (index == emptyCell+4)){
        //console.log("MOVE");
        cell[index].innerHTML = '';
        cell[emptyCell].innerHTML = array[index];
        array[emptyCell] = array[index];
        array[index] = '';
        cell[index].classList.add('empty');
        cell[emptyCell].classList.remove('empty');
        emptyCell = index;
        for (let index = 0; index < cell.length; index++) {
            //console.log(array[index])
            if(array[index] == index + 1){
                cell[index].classList.add('correct')
            }
            else{
                cell[index].classList.remove('correct')
            }
        }
    }
}

//Checks if youve won
function winner() {
    let inPlace = 0;
    for(let index = 0; index < 16; index++){
        if(cell[index].classList.contains('correct') ||
           cell[index].classList.contains('empty')){
            inPlace++;
           }
    }
    if (inPlace == 16){
        gameStatus.innerHTML = "YOU WIN!!!"
    }
}

for (let index = 0; index < cell.length; index++) {
    const element = cell[index];
    element.onclick = () => {
        swapPieces(index);
        winner();
    }
}
        
newGameButton.onclick = newGame;
newGame()
