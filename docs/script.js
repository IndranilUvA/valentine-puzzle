const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6; // change to 8 if needed
const totalImages = 10;
const boardSize = 600; // pixel size of puzzle area

let currentImage = 1;
let draggedPiece = null;

function loadPuzzle() {
  container.innerHTML = "";
  container.style.position = "relative";
  container.style.width = boardSize + "px";
  container.style.height = boardSize + "px";
  container.style.display = "block";

  const imgPath = `img${currentImage}.jpeg`;
  const pieceSize = boardSize / size;

  let positions = [];
  for (let i = 0; i < size * size; i++) positions.push(i);
  shuffleArray(positions);

  positions.forEach((pos, index) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");

    const correctRow = Math.floor(pos / size);
    const correctCol = pos % size;

    piece.style.width = pieceSize + "px";
    piece.style.height = pieceSize + "px";
    piece.style.position = "absolute";

    // Random starting position
    piece.style.left = Math.random() * (boardSize - pieceSize) + "px";
    piece.style.top = Math.random() * (boardSize - pieceSize) + "px";

    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
    piece.style.backgroundPosition =
      `-${correctCol * pieceSize}px -${correctRow * pieceSize}px`;

    piece.dataset.correctRow = correctRow;
    piece.dataset.correctCol = correctCol;
    piece.dataset.locked = "false";

    container.appendChild(piece);
  });

  addDragEvents();
  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

function addDragEvents() {
  const pieces = document.querySelectorAll(".piece");

  pieces.forEach(piece => {
    piece.addEventListener("mousedown", e => {
      if (piece.dataset.locked === "true") return;

      draggedPiece = piece;
      let shiftX = e.clientX - piece.getBoundingClientRect().left;
      let shiftY = e.clientY - piece.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
        piece.style.left = pageX - shiftX - container.offsetLeft + "px";
        piece.style.top = pageY - shiftY - container.offsetTop + "px";
      }

      function onMouseMove(e) {
        moveAt(e.pageX, e.pageY);
      }

      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
        snapIfCorrect(piece);
      }, { once: true });
    });
  });
}

function snapIfCorrect(piece) {
  const pieceSize = boardSize / size;

  const currentLeft = parseInt(piece.style.left);
  const currentTop = parseInt(piece.style.top);

  const correctLeft = piece.dataset.correctCol * pieceSize;
  const correctTop = piece.dataset.correctRow * pieceSize;

  const tolerance = 20;

  if (
    Math.abs(currentLeft - correctLeft) < tolerance &&
    Math.abs(currentTop - correctTop) < tolerance
  ) {
    piece.style.left = correctLeft + "px";
    piece.style.top = correctTop + "px";
    piece.style.border = "3px solid #00cc66";
    piece.dataset.locked = "true";

    checkCompletion();
  }
}

function checkCompletion() {
  const pieces = document.querySelectorAll(".piece");
  let complete = true;

  pieces.forEach(piece => {
    if (piece.dataset.locked === "false") complete = false;
  });

  if (complete) {
    setTimeout(() => {
      if (currentImage < totalImages) {
        currentImage++;
        loadPuzzle();
      } else {
        showFinalMessage();
      }
    }, 1000);
  }
}

function showFinalMessage() {
  container.innerHTML = "";
  statusText.innerHTML =
    "You completed our memory journey ❤️<br><br>I love you endlessly 💕";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

loadPuzzle();
