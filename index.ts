const BOARD_ROWS = 32;
const BOARD_COLS = 32;

type State = number;
type Board = State[][];

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

function createBoard(): Board {
  const board: Board = [];
  for (let i = 0; i < BOARD_ROWS; i++) {
    board.push(new Array(BOARD_COLS).fill(0));
  }
  return board;
}

const canvasId = "app";
const app = document.getElementById(canvasId) as HTMLCanvasElement;
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
const nextButton = document.getElementById(nextButtonId) as HTMLButtonElement;
if (nextButton === null) {
  throw new Error(`Could not find button ${nextButtonId}`);
}

const CELL_WIDTH = app.width / BOARD_COLS;
const CELL_HEIGHT = app.height / BOARD_ROWS;

function render(ctx: CanvasRenderingContext2D, board: Board) {
  ctx.fillStyle = stateColors[0];
  ctx.fillRect(0, 0, app.width, app.height);

  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_ROWS; c++) {
      if (board[r][c] === 1) {
        const x = c * CELL_WIDTH;
        const y = r * CELL_HEIGHT;
        ctx.fillStyle = stateColors[board[r][c]];
        ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
}

let currentBoard = createBoard();
let nextBoard = createBoard();

function countNbors(board: Board, nbors: number[], r0: number, c0: number) {
  nbors.fill(0);
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = r0 + dr;
      const c = c0 + dc;
      if (r < 0 || r >= BOARD_ROWS || c < 0 || c >= BOARD_COLS) continue;
      nbors[board[r][c]]++;
    }
  }
}

const GoL = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

function computeNextBoardGoL(current: Board, next: Board, states: number) {
  const DEAD = 0;
  const ALIVE = 1;
  const nbors = new Array(states).fill(0);
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_ROWS; c++) {
      countNbors(current, nbors, r, c);
      next[r][c] = GoL[current[r][c]][nbors[DEAD]][nbors[ALIVE]];
    }
  }
}

app.addEventListener("click", (e) => {
  const row = Math.floor(e.offsetY / CELL_HEIGHT);
  const col = Math.floor(e.offsetX / CELL_WIDTH);

  const states = document.getElementsByName("state");
  for (let i = 0; i < states.length; i++) {
    if ((states[i] as HTMLInputElement).checked) {
      currentBoard[row][col] = i;
      render(ctx, currentBoard);
      return;
    }
  }
});

nextButton.addEventListener("click", () => {
  computeNextBoardGoL(currentBoard, nextBoard, 2);
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
  render(ctx, currentBoard);
});

render(ctx, currentBoard);
