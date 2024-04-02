let imageSource = "";


// Add event listener to image input for when a new image is selected
const imageInput = document.getElementById("image");
imageInput.onchange = () => {
  imageSource = URL.createObjectURL(imageInput.files[0]);
  startGame();
};
