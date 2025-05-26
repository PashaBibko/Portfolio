// Runs the render loop via a worker //

const canvas = document.getElementById('FrontCanvas') as HTMLCanvasElement;
const offscreen = canvas.transferControlToOffscreen();

const RenderWorker = new Worker('RenderLoop.js', { type: 'module' });
RenderWorker.postMessage({ canvas: offscreen }, [offscreen]);
