/* -------------------------------------Add generateJigsaw function to create jigsaw puzzle from image------------------------ */

export default async function generateJigsaw(imageSource, boardCols, boardWidthPx) {
    // creating a new empty image box.
    const image = new Image();
    // Set the crossOrigin attribute to "anonymous" to avoid tainting the canvas
    image.crossOrigin = "anonymous";
    // Place the web address of the image in the empty image box.
    image.src = imageSource;
    // Wait for the image to load and decode it
    await image.decode().catch(error => {
      alert(`Error loading image: ${error.message}`);
    });
  
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;
    const numColumns = parseInt(boardCols);
    const numRows = Math.round(numColumns / imageAspectRatio);
    let totalPieces = numColumns * numRows;
    const boardWidth = parseInt(boardWidthPx);
    const boardHeight = Math.ceil(boardWidth / imageAspectRatio);
    const pieceWidth = Math.ceil(boardWidth / numColumns);
    const pieceHeight = Math.ceil(boardHeight / numRows);
  
  
  
    // Create a canvas element for the scaled image
    const scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = boardWidth;
    scaledCanvas.height = boardHeight;
    scaledCanvas.getContext("2d").drawImage(image, 0, 0, boardWidth, boardHeight);
  
    const edgeNames = ["left", "top", "right", "bottom"];
    const [left, top, right, bottom] = [0, 1, 2, 3];
    const pieceEdges = [];

/* ------------------------------------------  Iterate over each puzzle piece and create edges  ----------------------------------------*/

  // Iterate over each puzzle piece and create edges
  for (let i = 0; i < totalPieces; i++) {
    pieceEdges.push(edgeNames.slice());
  }
 
  for (let piece = 0; piece < totalPieces; piece++) {
    // Checks if the current piece is at the end of the row.
    if ((piece + 1) % numColumns === 0) {
      pieceEdges[piece][right] = null;
      pieceEdges[(piece + 1) % totalPieces][left] = null; // the first piece of the next row
    } else {
      // Generate a random decision to extend the edge or not
      const extendEdge = Math.random() < 0.5;
      pieceEdges[piece][right] = extendEdge;
      pieceEdges[piece + 1][left] = !extendEdge;
    }
    // Checks if the current piece is in the bottom row.
    if (Math.ceil((piece + 1) / numColumns) === numRows) {
      pieceEdges[piece][bottom] = null;
      pieceEdges[(piece + numColumns) % totalPieces][top] = null;
    } else {
      const extendEdge = Math.random() < 0.5;
      pieceEdges[piece][bottom] = extendEdge;
      pieceEdges[(piece + numColumns) % totalPieces][top] = !extendEdge;
    }
  }
