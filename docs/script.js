const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6; // change to 8 if harder
const totalImages = 10;

let currentImage = 1;
let draggedPiece = null;

function loadPuzzle() {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  const imgPath = `img${currentImage}.jpeg`;

  let positions = [];
  for (let i = 0; i < size * size; i++) {
    positions.push(i);
  }

  shuffleArray(positions);

  positions.forEach((pos, index) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");

    piece.draggable = true;

    const row = Math.floor(pos / size);
    const col = pos % size;

    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${size * 100}% ${size * 100}%`;
    piece.style.backgroundPosition =
      `${(col * 100) / (size - 1)}% ${(row * 100) / (size - 1)}%`;

    piece.dataset.correct = pos;
    piece.dataset.current = index;

    container.appendChild(piece);
  });

  addDragEvents();
  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

function addDragEvents() {
  const pieces = document.querySelectorAll(".piece");

  pieces.forEach(piece => {
    piece.addEventListener("dragstart", () => {
      draggedPiece = piece;
    });

    piece.addEventListener("dragover", e => {
      e.preventDefault();
    });

    piece.addEventListener("drop", () => {
      if (draggedPiece !== piece) {
        swapPieces(draggedPiece, piece);
        checkCompletion();
      }
    });
  });
}

function swapPieces(p1, p2) {
  const temp = p1.style.backgroundPosition;
  const tempCorrect = p1.dataset.correct;

  p1.style.backgroundPosition = p2.style.backgroundPosition;
  p1.dataset.correct = p2.dataset.correct;

  p2.style.backgroundPosition = temp;
  p2.dataset.correct = tempCorrect;
}

function checkCompletion() {
  const pieces = document.querySelectorAll(".piece");
  let complete = true;

  pieces.forEach((piece, index) => {
    if (parseInt(piece.dataset.correct) !== index) {
      complete = false;
    }
  });

  if (complete) {
    setTimeout(() => {
      if (currentImage < totalImages) {
        currentImage++;
        loadPuzzle();
      } else {
        showFinalMessage();
      }
    }, 800);
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
