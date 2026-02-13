const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6;
const totalImages = 10;
const boardSize = 360;

let currentImage = 1;
let pieceSize = boardSize / size;
let board = [];
let groups = {};

function loadPuzzle() {
  container.innerHTML = "";
  container.style.width = boardSize + "px";
  container.style.height = boardSize + "px";
  container.style.display = "grid";
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  board = [];
  groups = {};

  const imgPath = `img${currentImage}.jpeg`;

  let indices = [];
  for (let i = 0; i < size * size; i++) indices.push(i);
  shuffle(indices);

  indices.forEach((val, i) => {
    const row = Math.floor(i / size);
    const col = i % size;

    const correctRow = Math.floor(val / size);
    const correctCol = val % size;

    const piece = document.createElement("div");
    piece.classList.add("piece");

    piece.style.width = pieceSize + "px";
    piece.style.height = pieceSize + "px";
    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
    piece.style.backgroundPosition =
      `-${correctCol * pieceSize}px -${correctRow * pieceSize}px`;

    piece.dataset.correctRow = correctRow;
    piece.dataset.correctCol = correctCol;
    piece.dataset.currentRow = row;
    piece.dataset.currentCol = col;
    piece.dataset.group = val;

    groups[val] = [piece];

    piece.draggable = true;

    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", e => e.preventDefault());
    piece.addEventListener("drop", dropPiece);

    container.appendChild(piece);
    board.push(piece);
  });

  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

let draggedPiece = null;

function dragStart(e) {
  draggedPiece = e.target;
}

function dropPiece(e) {
  const target = e.target;

  if (draggedPiece === target) return;

  swapGroups(draggedPiece, target);
  mergeAdjacent();
  checkCompletion();
}

function swapGroups(p1, p2) {
  const g1 = p1.dataset.group;
  const g2 = p2.dataset.group;

  if (g1 === g2) return;

  const group1 = groups[g1];
  const group2 = groups[g2];

  group1.forEach(piece => piece.dataset.group = g2);
  group2.forEach(piece => piece.dataset.group = g1);

  groups[g1] = group2;
  groups[g2] = group1;

  reRenderBoard();
}

function reRenderBoard() {
  const pieces = Array.from(container.children);

  pieces.sort((a, b) => {
    const rowA = parseInt(a.dataset.currentRow);
    const colA = parseInt(a.dataset.currentCol);
    const rowB = parseInt(b.dataset.currentRow);
    const colB = parseInt(b.dataset.currentCol);
    return rowA * size + colA - (rowB * size + colB);
  });

  pieces.forEach(piece => container.appendChild(piece));
}

function mergeAdjacent() {
  const pieces = Array.from(container.children);

  pieces.forEach(p1 => {
    pieces.forEach(p2 => {
      if (p1 === p2) return;

      const r1 = parseInt(p1.dataset.correctRow);
      const c1 = parseInt(p1.dataset.correctCol);
      const r2 = parseInt(p2.dataset.correctRow);
      const c2 = parseInt(p2.dataset.correctCol);

      if (
        (Math.abs(r1 - r2) === 1 && c1 === c2) ||
        (Math.abs(c1 - c2) === 1 && r1 === r2)
      ) {
        if (p1.dataset.group !== p2.dataset.group) {
          const g1 = p1.dataset.group;
          const g2 = p2.dataset.group;

          groups[g1] = groups[g1].concat(groups[g2]);
          groups[g2].forEach(p => p.dataset.group = g1);
          delete groups[g2];
        }
      }
    });
  });
}

function checkCompletion() {
  const pieces = Array.from(container.children);

  const done = pieces.every(p =>
    p.dataset.correctRow == p.dataset.currentRow &&
    p.dataset.correctCol == p.dataset.currentCol
  );

  if (done) {
    setTimeout(() => {
      if (currentImage < totalImages) {
        currentImage++;
        loadPuzzle();
      } else {
        container.innerHTML = "";
        statusText.innerHTML =
          "You completed our love story ❤️<br><br>I love you endlessly 💕";
      }
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadPuzzle();
