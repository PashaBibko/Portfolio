// Gets the canvas and it's rendering context //s
const canvas = document.getElementById("FrontCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (!canvas || !ctx) {
  throw new Error('Error getting canvas elements');
}

// Fills the canvas to the window size //
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, "red");
gradient.addColorStop(1, "white");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
