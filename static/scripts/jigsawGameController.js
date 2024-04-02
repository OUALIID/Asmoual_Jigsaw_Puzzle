let imageSource = "";
let puzzleColumns = "3";
let puzzleWidth = "300";
let shuffleTiles = false;

// Add event listener to image input for when a new image is selected
const imageInput = document.getElementById("image");
imageInput.onchange = () => {
  imageSource = URL.createObjectURL(imageInput.files[0]);
  startGame();
};


// Select the load image button and assign an event listener to load the image from URL
const imageUrlInput = document.getElementById("imageUrlInput");
const chooseImageLabel = document.querySelector('label[for="image"]');
const loadImage = () => {
  const imageUrl = imageUrlInput.value.trim();
  imageSource = imageUrl;
  const image = new Image();
  image.crossOrigin = "anonymous"; // Set CORS attribute
  image.src = imageSource;

  image.onload = () => {
    startGame();
    // Hide the image input and the input field for the image URL after successfully loading the image
    imageInput.classList.add("notShown");
    imageUrlInput.classList.add("notShown");
    chooseImageLabel.classList.add("notShown");
  };

  image.onerror = () => {
    displayErrorMessage("Error loading image. Please check the image URL.");
    imageSource = "";
    imageUrlInput.value = ""; // Clear the input value if an error occurs
  };
};

// Add event listener for the "keydown" event on the input field
imageUrlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    loadImage();
  }
});


// Select all Levels buttons and assign event listeners to them
const LevelLabe = document.querySelectorAll(".level-label");
LevelLabe.forEach((button) => {
  button.addEventListener("click", () => {
    puzzleColumns = button.dataset.cols;
    puzzleWidth = button.dataset.width;
    startGame();
  });
});


const shuffleButton = document.getElementById("shuffle");
shuffleButton.onclick = () => {
  shuffleTiles = !shuffleTiles;
  shuffleButton.innerText = shuffleTiles ? "Solve" : "Shuffle";

  // Start the timer when shuffle button is pressed
  if (shuffleTiles && imageSource) {
    startTimer();
  } else {
    resetTimer();
    pauseTimer();
  }

  // Select all puzzle pieces on the document body with the class name "piece"
  const puzzlePieces = document.body.getElementsByClassName("piece");
  for (let pieceIndex = 0; pieceIndex < puzzlePieces.length; pieceIndex++) {
    // Call the animatePuzzlePiece method on each puzzle piece to animate it
    puzzlePieces[pieceIndex].animatePuzzlePiece();
  }
};


const button = document.getElementById("label-check");
const menu = document.querySelector(".menu");

button.addEventListener("click", function() {
  if (!button.checked) {
    menu.style.transform = "translateX(100vw)";
  } else {
    menu.style.transform = "translateX(0vw)";
  }
});


const startGame = async () => {
    resetTimer();
  
  const puzzleContainerElement = document.getElementById("puzzle");
    // Prepare the space in which we will assemble the puzzle by making sure it is empty and ready for a new game.
    while (puzzleContainerElement.firstChild) {
      puzzleContainerElement.removeChild(puzzleContainerElement.lastChild);
    }
    if (!imageSource || !puzzleColumns || !puzzleWidth) return;

    const { board, tile, pieces } = await JigsawPuzzle(imageSource, puzzleColumns, puzzleWidth).catch(alert);


    const customBgContainer = document.getElementById('customBgContainer');
    const originalImage = document.getElementById('originalImage');
    originalImage.src = imageSource;
  
    originalImage.addEventListener('load', function() {
      customBgContainer.style.width = originalImage.width + 'px';
      customBgContainer.style.height = originalImage.height + 'px';
    });
  
    puzzleContainerElement.style.width = `${board.width}px`;
    puzzleContainerElement.style.height = `${board.height}px`;
  
    // Hide the image input and the input field for the image URL
    const imageInput = document.getElementById("image");
    const imageUrlInput = document.getElementById("imageUrlInput");
    const orText = document.getElementById("orText");
  
  
    imageInput.classList.add("notShown", "pointer-events-none");
    imageUrlInput.classList.add("notShown", "pointer-events-none");
    chooseImageLabel.classList.add("notShown", "pointer-events-none");
    orText.classList.add("notShown");
    /* pointer-events-none */


      // const pieces = [1, 2, 3, 4, 5];
  // Array(pieces.length) We create a new array with length equal to the number of puzzle pieces,
  // .fill(false) We fill each element of the array with the value `false`.like [false, false ...]
  const PieceCompleted = Array(pieces.length).fill(false);

  let PieceBeingDragged = false; // Indicates whether a puzzle piece is currently being dragged by the user
  let zIndex = pieces.length;

  // Loop through each puzzle piece and create an image element for it.
  // The "puzzlePiece" represents an individual piece of the puzzle.
  // "pieceIndex" helps us keep track of the order of pieces.
  pieces.forEach((puzzlePiece, pieceIndex) => {
    const pieceImageElement = new Image();
    // Define a function to animate the puzzle piece
    pieceImageElement.animatePuzzlePiece = () => {
      pieceImageElement.style.transition = "all 0.5s ease-in-out";
      // Check if shuffling is enabled
      if (shuffleTiles) {
        const randomIndex = getRandomNumber(shufflePositions.length);
        pieceImageElement.style.left = `${shufflePositions[randomIndex].shuffleX(board, tile)}px`;
        pieceImageElement.style.top = `${shufflePositions[randomIndex].shuffleY(board, tile)}px`;
        pieceImageElement.style.zIndex = getRandomNumber(pieces.length) + 1;
      } else {
        // If shuffling is disabled, set the piece to its original position
        pieceImageElement.style.left = `${puzzlePiece.leftOffset}px`;
        pieceImageElement.style.top = `${puzzlePiece.topOffset}px`;
      }
      // Remove transition effect after 500 milliseconds
      setTimeout(() => (pieceImageElement.style.transition = "none"), 500);
      PieceCompleted.fill(false);
    };

    // Set the source and class of the puzzle piece image
    pieceImageElement.src = puzzlePiece.base64Url;
    pieceImageElement.className = "piece";
    // Append the puzzle piece image to the puzzle container
    puzzleContainerElement.appendChild(pieceImageElement);
    pieceImageElement.animatePuzzlePiece();

};

