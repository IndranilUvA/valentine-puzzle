💖 Valentine Puzzle

An interactive Valentine’s Day puzzle built with pure HTML, CSS, and JavaScript.

This project turns personal photos into a drag-and-swap puzzle experience.  
Each completed puzzle reveals the next image — telling a love story piece by piece.



- Image split into an N × N grid (configurable)
- Randomly shuffled tiles at the start
- Drag-and-drop tile swapping
- Progressive image reveal (multiple puzzles)
- Romantic completion message
- Mobile-friendly layout
- No frameworks — pure vanilla JavaScript


## How It Works

1. An image is divided into a grid (default: 3×3 for debugging, can be 6×6 for harder mode).
2. The tiles are randomly shuffled.
3. The user drags one tile onto another to swap positions.
4. When all tiles match their correct positions:
5. The next puzzle loads automatically.
6. After the final image, a special message is displayed.

## Project Structure

valentine-puzzle/
│
├── index.html
├── style.css
├── script.js
├── img1.jpeg
├── img2.jpeg
├── ...
└── img10.jpeg



##Configuration

Inside `script.js`, you can adjust:

```js
const size = 3;          // Grid size (3 for easy, 6 for challenging)
const totalImages = 10;  // Number of puzzles
```

To increase difficulty:

```js
const size = 6;
```

---

##Adding Your Own Images

1. Add images to the project root directory.
2. Name them sequentially:

```
img1.jpeg
img2.jpeg
img3.jpeg
...
```

Important:
- Filenames are case-sensitive on GitHub Pages.
- Ensure extensions match exactly (e.g., `.jpeg` vs `.jpg`).

---

## Deployment (GitHub Pages)

1. Push your project to GitHub.
2. Go to **Repository Settings → Pages**.
3. Select the `main` branch as source.
4. Save.
5. Your site will be live in a few seconds.

---

## Customization Ideas

You can extend this project with:

- Sound effects on swap
- Smooth tile animation
- Confetti when the puzzle completes
- Timer or move counter
- Increasing difficulty per level
- A custom final message screen

---

About This Project

This puzzle was created as a personal Valentine’s Day gift for my wife.   
a small interactive way to relive shared memories and celebrate love.

Because I give her stress, and sometimes she needs a stressbuster as well :D
