const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6;
const totalImages = 10;
const boardSize = 360; // smaller for phone

let currentImage = 1;
let pieceSize = boardSize / size;
let pieces = [];
let groups = {};

function loadPuzzle() {
  container.innerHTML = "";
  container.style.width = boardSize + "px";
  container.style.height = boardSize + "px";

  pieces = [];
  groups = {};

  const imgPath = `img${currentImage}.jpeg`;

  for (let i = 0; i < size * size; i++) {
    const row = Math.floor(i / size);
    const col = i % size;

    const piece = document.createElement("div");
    piece.classList.add("piece");

    piece.style.width = pieceSize + "px";
    piece.style.height = pieceSize + "px";
    piece.style.position = "absolute";

    piece.style.left = Math.random() * (boardSize - pieceSize) + "px";
    piece.style.top = Math.random() * (boardSize - pieceSize) + "px";

    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
    piece.style.backgroundPosition =
      `-${col * pieceSize}px -${row * pieceSize}px`;

    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.dataset.group = i;

    groups[i] = [piece];
    pieces.push(piece);
    container.appendChild(piece);

    addDragEvents(piece);
  }

  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

function addDragEvents(piece) {
  let startX, startY;

  function startDrag(e) {
    e.preventDefault();

    const groupId = piece.dataset.group;
    const groupPieces = groups[groupId];

    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;

    function move(eMove) {
      const moveX = eMove.touches ? eMove.touches[0].clientX : eMove.clientX;
      const moveY = eMove.touches ? eMove.touches[0].clientY : eMove.clientY;

      const dx = moveX - startX;
      const dy = moveY - startY;

      groupPieces.forEach(p => {
        p.style.left = parseFloat(p.style.left) + dx + "px";
        p.style.top = parseFloat(p.style.top) + dy + "px";
      });

      startX = moveX;
      startY = moveY;
    }

    function stop() {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("touchend", stop);

      checkSnap(groupPieces);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", stop);
  }

  piece.addEventListener("mousedown", startDrag);
  piece.addEventListener("touchstart", startDrag);
}

function checkSnap(groupPieces) {
  groupPieces.forEach(piece => {
    const correctLeft = piece.dataset.col * pieceSize;
    const correctTop = piece.dataset.row * pieceSize;

    const currentLeft = parseFloat(piece.style.left);
    const currentTop = parseFloat(piece.style.top);

    if (
      Math.abs(currentLeft - correctLeft) < 20 &&
      Math.abs(currentTop - correctTop) < 20
    ) {
      piece.style.left = correctLeft + "px";
      piece.style.top = correctTop + "px";
      piece.style.boxShadow = "0 0 10px #00cc66";
      piece.dataset.snapped = "true";
    }
  });

  mergeGroups();
  checkCompletion();
}

function mergeGroups() {
  pieces.forEach(p1 => {
    pieces.forEach(p2 => {
      if (p1 === p2) return;

      if (p1.dataset.snapped === "true" && p2.dataset.snapped === "true") {
        const rowDiff = Math.abs(p1.dataset.row - p2.dataset.row);
        const colDiff = Math.abs(p1.dataset.col - p2.dataset.col);

        if ((rowDiff === 1 && colDiff === 0) ||
            (rowDiff === 0 && colDiff === 1)) {

          const group1 = p1.dataset.group;
          const group2 = p2.dataset.group;

          if (group1 !== group2) {
            groups[group1] = groups[group1].concat(groups[group2]);
            groups[group2].forEach(p => p.dataset.group = group1);
            delete groups[group2];
          }
        }
      }
    });
  });
}

function checkCompletion() {
  const done = pieces.every(p => p.dataset.snapped === "true");

  if (done) {
    setTimeout(() => {
      if (currentImage < totalImages) {
        currentImage++;
        loadPuzzle();
      } else {
        container.innerHTML = "";
        statusText.innerHTML =
          "You completed our love journey ❤️<br><br>I love you endlessly 💕";
      }
    }, 1000);
  }
}

loadPuzzle();
