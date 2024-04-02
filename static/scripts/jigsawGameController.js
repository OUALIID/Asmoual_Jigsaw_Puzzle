let imageSource = "";
let puzzleColumns = "3";
let puzzleWidth = "300";


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

