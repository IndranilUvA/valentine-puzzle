const container = document.getElementById("puzzle-container");
const statusText = document.getElementById("status");

const size = 6; // Change to 8 if you want harder
const totalImages = 10;
let currentImage = 1;
let pieces = [];
let firstPiece = null;

function loadPuzzle() {
  container.innerHTML = "";
  pieces = [];
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  const imgPath = `img${currentImage}.jpg`;

  for (let i = 0; i < size * size; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");

    const row = Math.floor(i / size);
    const col = i % size;

    piece.style.backgroundImage = `url(${imgPath})`;
    piece.style.backgroundSize = `${size * 100}% ${size * 100}%`;
    piece.style.backgroundPosition = 
      `${(col * 100) / (size - 1)}% ${(row * 100) / (size - 1)}%`;

    piece.dataset.correct = i;
    pieces.push(piece);
  }

  shuffle(pieces);
  pieces.forEach(p => container.appendChild(p));

  pieces.forEach(piece => {
    piece.addEventListener("click", () => selectPiece(piece));
  });

  statusText.innerText = `Puzzle ${currentImage} of ${totalImages}`;
}

function selectPiece(piece) {
  if (!firstPiece) {
    firstPiece = piece;
    piece.style.opacity = "0.5";
  } else {
    swapPieces(firstPiece, piece);
    firstPiece.style.opacity = "1";
    firstPiece = null;
    checkCompletion();
  }
}

function swapPieces(p1, p2) {
  const temp = document.createElement("div");
  container.insertBefore(temp, p1);
  container.insertBefore(p1, p2);
  container.insertBefore(p2, temp);
  container.removeChild(temp);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    container.appendChild(array[j]);
  }
}

function checkCompletion() {
  const current = Array.from(container.children);
  let correct = true;

  current.forEach((piece, index) => {
    if (piece.dataset.correct != index) {
      correct = false;
    }
  });

  if (correct) {
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

loadPuzzle();
