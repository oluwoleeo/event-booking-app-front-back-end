export const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [0, 4, 8],
        [2, 4, 6],
        [2, 5, 8],
        [1, 4, 7]
    ];

    for(let [a, b, c] of lines){
        if (squares[a] && squares[b] === squares[a] && squares[c] === squares[a]){
            return squares[a];
        }
    }

    return null;
}

export function calculateWinner1(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [0, 4, 8],
        [2, 4, 6],
        [2, 5, 8],
        [1, 4, 7]
    ];

    for(let [a, b, c] of lines){
        if (squares[a] && squares[b] === squares[a] && squares[c] === squares[a]){
            return squares[a];
        }
    }

    return null;
}

function calculateWinner2(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [0, 4, 8],
        [2, 4, 6],
        [2, 5, 8],
        [1, 4, 7]
    ];

    for(let [a, b, c] of lines){
        if (squares[a] && squares[b] === squares[a] && squares[c] === squares[a]){
            return squares[a];
        }
    }

    return null;
}

export {calculateWinner2};