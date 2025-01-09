// function bestMove(){
//     //Person 1 (AI) to make it's turn
//     let bestScore=-Infinity
//     let move
//     for(int i=0;i<9;i++){
//         //is spot available
//         if(board[i]==0){
//             baord[i]=1
//             let score=minimax(board,0,false)
//             board[i]=0
//             if (score>bestScore){
//                 bestScore=score
//                 move=i
//             }
//         }
//     }
//     board[move]=1
//     currentPlayer=-1
// }

// function minimax(board, depth, isMaximizing){

//     let result = checkState();
//     if (result ==1) return "X"
//     if (result==-1) return "O"

//     if(isMaximizing){
//         let bestScore=-Infinity
//         for(int i=0;i<9;i++){
//             if(board[i]==0){
//                 baord[i]=1
//                 let score=minimax(board,depth+1,false)
//                 board[i]=0
//                 bestScore = max(score, bestScore);
//             }
//         }
//         return bestScore
//     }
//     else{
//         let bestScore=Infinity
//         for(int i=0;i<9;i++){
//             if(board[i]==0){
//                 baord[i]=-1
//                 let score=minimax(board,depth+1,true)
//                 board[i]=0
//                 bestScore = min(score, bestScore);
//             }
//         }
//         return bestScore
//     }
// }


function bestMove() {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === EMPTY) {
            board[i] = X;
            let score = minimax(board, 0, false);
            board[i] = EMPTY;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = X;
    next = O;
}

function minimax(board, depth, isMaximizing) {
    let result = checkState();
    if (result === 1) return 10 - depth; // AI wins
    if (result === -1) return depth - 10; // Opponent wins
    if (result === 2) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === EMPTY) {
                board[i] = X;
                let score = minimax(board, depth + 1, false);
                board[i] = EMPTY;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === EMPTY) {
                board[i] = O;
                let score = minimax(board, depth + 1, true);
                board[i] = EMPTY;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
