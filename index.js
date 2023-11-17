"use strict";
const BOARD_ROWS = 32;
const BOARD_COLS = 32;
const stateColors = [
    "#282A36",
    "#F8F8F2",
    "#8be9fd",
    "#50fa7b",
    "#ffb86c",
    "#ff79c6",
    "#bd93f9",
    "#ff5555",
    "#f1fa8c",
];
function createBoard() {
    const board = [];
    for (let i = 0; i < BOARD_ROWS; i++) {
        board.push(new Array(BOARD_COLS).fill(0));
    }
    return board;
}
const canvasId = "app";
const app = document.getElementById(canvasId);
if (app === null) {
    throw new Error(`Could not find canvas ${canvasId}`);
}
app.width = 800;
app.height = 800;
const ctx = app.getContext("2d");
if (ctx === null) {
    throw new Error("Could not initialize 2d context");
}
const nextButtonId = "next";
const nextButton = document.getElementById(nextButtonId);
if (nextButton === null) {
    throw new Error(`Could not find button ${nextButtonId}`);
}
const CELL_WIDTH = app.width / BOARD_COLS;
const CELL_HEIGHT = app.height / BOARD_ROWS;
function render(ctx, board) {
    ctx.fillStyle = stateColors[0];
    ctx.fillRect(0, 0, app.width, app.height);
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_ROWS; c++) {
            const x = c * CELL_WIDTH;
            const y = r * CELL_HEIGHT;
            ctx.fillStyle = stateColors[board[r][c]];
            ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
        }
    }
}
let currentBoard = createBoard();
let nextBoard = createBoard();
function countNbors(board, nbors, r0, c0) {
    nbors.fill(0);
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0)
                continue;
            let r = (r0 + dr) % BOARD_ROWS;
            let c = (c0 + dc) % BOARD_COLS;
            if (r < 0)
                r += BOARD_ROWS;
            if (c < 0)
                c += BOARD_COLS;
            nbors[board[r][c]]++;
        }
    }
}
const GoL = [
    {
        "53": 1,
        default: 0,
    },
    {
        "53": 1,
        "62": 1,
        default: 0,
    },
];
const Seeds = [
    {
        "62": 1,
        default: 0,
    },
    {
        default: 0,
    },
];
const BB = [
    {
        "026": 1,
        "125": 1,
        "224": 1,
        "323": 1,
        "422": 1,
        "521": 1,
        "620": 1,
        default: 0,
    },
    {
        default: 2,
    },
    {
        default: 0,
    },
];
function computeNextBoard(automaton, current, next) {
    const nbors = new Array(automaton.length).fill(0);
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_ROWS; c++) {
            countNbors(current, nbors, r, c);
            const transition = automaton[current[r][c]];
            next[r][c] = transition[nbors.join("")];
            if (next[r][c] === undefined)
                next[r][c] = transition["default"];
        }
    }
}
app.addEventListener("click", (e) => {
    const row = Math.floor(e.offsetY / CELL_HEIGHT);
    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const states = document.getElementsByName("state");
    for (let i = 0; i < states.length; i++) {
        if (states[i].checked) {
            currentBoard[row][col] = i;
            render(ctx, currentBoard);
            return;
        }
    }
});
nextButton.addEventListener("click", () => {
    computeNextBoard(BB, currentBoard, nextBoard);
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
    render(ctx, currentBoard);
});
render(ctx, currentBoard);
