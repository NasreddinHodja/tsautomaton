"use strict";
const BOARD_ROWS = 64;
const BOARD_COLS = 64;
const GoL = [
    {
        transitions: { "53": 1 },
        default: 0,
        color: "#282A36",
    },
    {
        transitions: {
            "53": 1,
            "62": 1,
        },
        default: 0,
        color: "#F8F8F2",
    },
];
const Seeds = [
    {
        transitions: { "62": 1 },
        default: 0,
        color: "#282A36",
    },
    {
        transitions: {},
        default: 0,
        color: "#F8F8F2",
    },
];
const BB = [
    {
        transitions: {
            "026": 1,
            "125": 1,
            "224": 1,
            "323": 1,
            "422": 1,
            "521": 1,
            "620": 1,
        },
        default: 0,
        color: "#282A36",
    },
    {
        transitions: {},
        default: 2,
        color: "#F8F8F2",
    },
    {
        transitions: {},
        default: 0,
        color: "#8be9fd",
    },
];
function createBoard() {
    const board = [];
    for (let i = 0; i < BOARD_ROWS; i++) {
        board.push(new Array(BOARD_COLS).fill(0));
    }
    return board;
}
function mod(a, b) {
    return ((a % b) + b) % b;
}
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
function computeNextBoard(automaton, current, next) {
    const nbors = new Array(automaton.length).fill(0);
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_ROWS; c++) {
            countNbors(current, nbors, r, c);
            const state = automaton[current[r][c]];
            next[r][c] = state.transitions[nbors.join("")];
            if (next[r][c] === undefined)
                next[r][c] = state["default"];
        }
    }
}
function render(ctx, automaton, board) {
    const CELL_WIDTH = ctx.canvas.width / BOARD_COLS;
    const CELL_HEIGHT = ctx.canvas.height / BOARD_ROWS;
    ctx.fillStyle = automaton[0].color;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_ROWS; c++) {
            const x = c * CELL_WIDTH;
            const y = r * CELL_HEIGHT;
            ctx.fillStyle = automaton[board[r][c]].color;
            ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
        }
    }
}
function tsautomatonEntryPoint() {
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
    const playButtonId = "play";
    const playButton = document.getElementById(playButtonId);
    if (playButton === null) {
        throw new Error(`Could not find button ${playButtonId}`);
    }
    const stopButtonId = "stop";
    const stopButton = document.getElementById(stopButtonId);
    if (stopButton === null) {
        throw new Error(`Could not find button ${stopButtonId}`);
    }
    const CELL_WIDTH = app.width / BOARD_COLS;
    const CELL_HEIGHT = app.height / BOARD_ROWS;
    const currentAutomaton = Seeds;
    let currentBoard = createBoard();
    let nextBoard = createBoard();
    app.addEventListener("click", (e) => {
        const row = Math.floor(e.offsetY / CELL_HEIGHT);
        const col = Math.floor(e.offsetX / CELL_WIDTH);
        const states = document.getElementsByName("state");
        for (let i = 0; i < states.length; i++) {
            if (states[i].checked) {
                currentBoard[row][col] = i;
                render(ctx, currentAutomaton, currentBoard);
                return;
            }
        }
    });
    const step = () => {
        computeNextBoard(currentAutomaton, currentBoard, nextBoard);
        [currentBoard, nextBoard] = [nextBoard, currentBoard];
        render(ctx, currentAutomaton, currentBoard);
    };
    nextButton.addEventListener("click", step);
    let intervalId = null;
    let stepInterval = 50;
    playButton.addEventListener("click", () => {
        if (intervalId === null) {
            intervalId = setInterval(step, stepInterval);
        }
    });
    stopButton.addEventListener("click", () => {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });
    render(ctx, currentAutomaton, currentBoard);
}
window.onload = tsautomatonEntryPoint;
