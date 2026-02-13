const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 3;
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

  // Create shuffled order
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
  if (!draggedPiece || draggedPiece === target) return;

  swapGroups(draggedPiece, target);
  mergeAdjacent();
  checkCompletion();
}

function swapGroups(p1, p2) {
  const g1 = p1.dataset.group;
  const g2 = p2.dataset.group;

  const group1 = board.filter(p => p.dataset.group === g1);
  const group2 = board.filter(p => p.dataset.group === g2);

  // Save original positions
  const positions1 = group1.map(p => ({
    row: parseInt(p.dataset.row),
    col: parseInt(p.dataset.col)
  }));

  const positions2 = group2.map(p => ({
    row: parseInt(p.dataset.row),
    col: parseInt(p.dataset.col)
  }));

  // Swap positions
  group1.forEach((p, i) => {
    p.dataset.row = positions2[i % positions2.length].row;
    p.dataset.col = positions2[i % positions2.length].col;
  });

  group2.forEach((p, i) => {
    p.dataset.row = positions1[i % positions1.length].row;
    p.dataset.col = positions1[i % positions1.length].col;
  });

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

function areNeighborsInSolution(p1, p2) {
  const r1 = parseInt(p1.dataset.correctRow);
  const c1 = parseInt(p1.dataset.correctCol);
  const r2 = parseInt(p2.dataset.correctRow);
  const c2 = parseInt(p2.dataset.correctCol);

  return (
    (Math.abs(r1 - r2) === 1 && c1 === c2) ||
    (Math.abs(c1 - c2) === 1 && r1 === r2)
  );
}

function areNeighborsOnBoard(p1, p2) {
  const r1 = parseInt(p1.dataset.row);
  const c1 = parseInt(p1.dataset.col);
  const r2 = parseInt(p2.dataset.row);
  const c2 = parseInt(p2.dataset.col);

  return (
    (Math.abs(r1 - r2) === 1 && c1 === c2) ||
    (Math.abs(c1 - c2) === 1 && r1 === r2)
  );
}

function mergeAdjacent() {
  board.forEach(p1 => {
    board.forEach(p2 => {
      if (p1 === p2) return;
      if (p1.dataset.group === p2.dataset.group) return;

      if (
        areNeighborsInSolution(p1, p2) &&
        areNeighborsOnBoard(p1, p2)
      ) {
        const g1 = p1.dataset.group;
        const g2 = p2.dataset.group;

        board.forEach(p => {
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
          "You completed our love story ❤️<br><br>I love you endlessly 💕";
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


