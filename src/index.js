import * as P5 from 'p5';
import { CANVAS_DIM } from './consts';
import { initModel, predict } from './predict';


const index = (p) => {
  let start = false;
  let points = [];
  const strokeW = 12;

  p.setup = () => {
    p.createCanvas(CANVAS_DIM, CANVAS_DIM);

    // fix height an width
    const canvasObj = document.getElementById('defaultCanvas0');
    canvasObj.height = CANVAS_DIM;
    canvasObj.width = CANVAS_DIM;
  };

  p.mouseDragged = () => {
    const data = {
      x: p.mouseX,
      y: p.mouseY,
    };

    if (start) {
      points.push(p.createVector(data.x, data.y));
    }

    p.stroke(0);
    p.strokeWeight(strokeW);
    p.noFill();
    p.beginShape();

    for (let i = 0; i < points.length; i++) {
      p.vertex(points[i].x, points[i].y);
    }

    p.endShape();
  };

  p.mousePressed = () => {
    start = true;
    points = [];
  };

  p.mouseReleased = () => {
    start = false;
  };

  document.getElementById('predict').addEventListener('click', () => {
    console.log('btn click...');
    predict();
    p.clear();
  });
};

// eslint-disable-next-line no-unused-vars
const myp5 = new P5(index);
initModel();
