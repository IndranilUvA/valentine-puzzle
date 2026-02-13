const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6;
const totalImages = 10;

let currentImage = 1;
let board = [];
let draggedPiece = null;

function loadPuzzle() {
  container.innerHTML = "";
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

    piece.dataset.correctRow = correctRow;
    piece.dataset.correctCol = correctCol;
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.dataset.group = val;

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
  if (draggedPiece === target) return;

  swapPieces(draggedPiece, target);
  mergeAdjacent();
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
  const pieces = Array.from(container.children);

  pieces.sort((a, b) => {
    const posA = a.dataset.row * size + parseInt(a.dataset.col);
    const posB = b.dataset.row * size + parseInt(b.dataset.col);
    return posA - posB;
  });

  pieces.forEach(p => container.appendChild(p));
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

      const areNeighbors =
        (Math.abs(r1 - r2) === 1 && c1 === c2) ||
        (Math.abs(c1 - c2) === 1 && r1 === r2);

      if (areNeighbors && p1.dataset.group !== p2.dataset.group) {
        const g1 = p1.dataset.group;
        const g2 = p2.dataset.group;

        pieces.forEach(p => {
          if (p.dataset.group === g2) {
            p.dataset.group = g1;
            p.classList.add("merged");
          }
        });
      }
    });
  });
}

function checkCompletion() {
  const pieces = Array.from(container.children);

  const done = pieces.every(p =>
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
