const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6;
const totalImages = 10;
const snapTolerance = 18;

let currentImage = 1;
let pieces = [];
let activePiece = null;
let offsetX = 0;
let offsetY = 0;

function loadPuzzle() {
  container.innerHTML = "";
  container.style.position = "relative";
  container.style.display = "block";

  pieces = [];

  const imgPath = `img${currentImage}.jpeg`;
  const pieceSize = container.clientWidth / size;

  let indices = [];
  for (let i = 0; i < size * size; i++) indices.push(i);
  shuffle(indices);

  indices.forEach(val => {
    const correctRow = Math.floor(val / size);
    const correctCol = val % size;

    const piece = document.createElement("div");
    piece.classList.add("piece");

    piece.style.width = `${pieceSize}px`;
    piece.style.height = `${pieceSize}px`;
    piece.style.position = "absolute";

    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${size * 100}% ${size * 100}%`;
    piece.style.backgroundPosition =
      `${(correctCol * 100) / (size - 1)}% ${(correctRow * 100) / (size - 1)}%`;

    // Random scatter start
    piece.style.left = `${Math.random() * (container.clientWidth - pieceSize)}px`;
    piece.style.top = `${Math.random() * (container.clientWidth - pieceSize)}px`;

    piece.dataset.correctRow = correctRow;
    piece.dataset.correctCol = correctCol;
    piece.dataset.group = val;

    piece.addEventListener("pointerdown", startDrag);

    container.appendChild(piece);
    pieces.push(piece);
  });

  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

function startDrag(e) {
  activePiece = e.target;
  const rect = activePiece.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  document.addEventListener("pointermove", dragMove);
  document.addEventListener("pointerup", stopDrag);
}

function dragMove(e) {
  if (!activePiece) return;

  const group = activePiece.dataset.group;
  const dx = e.movementX;
  const dy = e.movementY;

  pieces.forEach(p => {
    if (p.dataset.group === group) {
      p.style.left = `${p.offsetLeft + dx}px`;
      p.style.top = `${p.offsetTop + dy}px`;
    }
  });
}

function stopDrag() {
  document.removeEventListener("pointermove", dragMove);
  document.removeEventListener("pointerup", stopDrag);

  attemptSnaps();
  checkCompletion();
  activePiece = null;
}

function areNeighbors(p1, p2) {
  const r1 = parseInt(p1.dataset.correctRow);
  const c1 = parseInt(p1.dataset.correctCol);
  const r2 = parseInt(p2.dataset.correctRow);
  const c2 = parseInt(p2.dataset.correctCol);

  return (
    (Math.abs(r1 - r2) === 1 && c1 === c2) ||
    (Math.abs(c1 - c2) === 1 && r1 === r2)
  );
}

function attemptSnaps() {
  const pieceSize = container.clientWidth / size;

  pieces.forEach(p1 => {
    pieces.forEach(p2 => {
      if (p1 === p2) return;
      if (p1.dataset.group === p2.dataset.group) return;
      if (!areNeighbors(p1, p2)) return;

      const dx = p1.offsetLeft - p2.offsetLeft;
      const dy = p1.offsetTop - p2.offsetTop;

      const expectedDx =
        (p1.dataset.correctCol - p2.dataset.correctCol) * pieceSize;
      const expectedDy =
        (p1.dataset.correctRow - p2.dataset.correctRow) * pieceSize;

      if (
        Math.abs(dx - expectedDx) < snapTolerance &&
        Math.abs(dy - expectedDy) < snapTolerance
      ) {
        mergeGroups(p1, p2);
      }
    });
  });
}

function mergeGroups(p1, p2) {
  const g1 = p1.dataset.group;
  const g2 = p2.dataset.group;

  pieces.forEach(p => {
    if (p.dataset.group === g2) {
      p.dataset.group = g1;
      p.classList.add("merged");
    }
  });
}

function checkCompletion() {
  const pieceSize = container.clientWidth / size;

  const done = pieces.every(p => {
    const expectedLeft =
      parseInt(p.dataset.correctCol) * pieceSize;
    const expectedTop =
      parseInt(p.dataset.correctRow) * pieceSize;

    return (
      Math.abs(p.offsetLeft - expectedLeft) < snapTolerance &&
      Math.abs(p.offsetTop - expectedTop) < snapTolerance
    );
  });

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
