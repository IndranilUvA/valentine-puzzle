const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 4;           // 3x3 for debugging
const totalImages = 10;

let currentImage = 1;
let board = [];
let draggedPiece = null;

function loadPuzzle() {
  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  board = [];

  const imgPath = `img${currentImage}.jpeg`;

  let indices = [];
  for (let i = 0; i < size * size; i++) indices.push(i);
  shuffle(indices);

  indices.forEach((val, index) => {
    const row = Math.floor(index / size);
    const col = index % size;

    const correctRow = Math.floor(val / size);
    const correctCol = val % size;

    const piece = document.createElement("div");
    piece.classList.add("piece");

    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${size * 100}% ${size * 100}%`;
    piece.style.backgroundPosition =
      `${(correctCol * 100) / (size - 1)}% ${(correctRow * 100) / (size - 1)}%`;

    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.dataset.correctRow = correctRow;
    piece.dataset.correctCol = correctCol;

    piece.draggable = true;

    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", e => e.preventDefault());
    piece.addEventListener("drop", dropPiece);

    container.appendChild(piece);
    board.push(piece);
  });

  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

function dragStart(e) {
  draggedPiece = e.target;
}

function dropPiece(e) {
  const target = e.target;

  if (!draggedPiece || draggedPiece === target) return;

  swapPieces(draggedPiece, target);
  checkCompletion();
}

function swapPieces(p1, p2) {
  const tempRow = p1.dataset.row;
  const tempCol = p1.dataset.col;

  p1.dataset.row = p2.dataset.row;
  p1.dataset.col = p2.dataset.col;

  p2.dataset.row = tempRow;
  p2.dataset.col = tempCol;

  reRender();
}

function reRender() {
  board.sort((a, b) => {
    const posA = parseInt(a.dataset.row) * size + parseInt(a.dataset.col);
    const posB = parseInt(b.dataset.row) * size + parseInt(b.dataset.col);
    return posA - posB;
  });

  board.forEach(p => container.appendChild(p));
}

function checkCompletion() {
  const done = board.every(p =>
    p.dataset.row == p.dataset.correctRow &&
    p.dataset.col == p.dataset.correctCol
  );

  if (done) {
    setTimeout(() => {
      if (currentImage < totalImages) {
        currentImage++;
        loadPuzzle();
      } else {
        container.innerHTML = "";
        statusText.innerHTML =
          "Hope you are less stressed now. ❤️<br><br>I love you endlessly 💕";
      }
    }, 800);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadPuzzle();

