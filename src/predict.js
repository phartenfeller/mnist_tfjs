// import * as tf from '@tensorflow/tfjs';
import { CANVAS_DIM, MODEL_DIM } from './constants';
import { showResults } from './ui';

const tf = require('@tensorflow/tfjs');

let model;
let scaledCanvas;


export const initModel = async () => {
  model = await tf.loadLayersModel('./model/model.json');
  document.getElementById('predict').disabled = false;
  model.summary();
};

const getPixelValuesFromCanvas = (imageData) => {
  const monodata = [];

  // ignore rgb values because you can only draw in black
  // transform from rgba to argb
  for (let i = 0, len = imageData.data.length / 4; i < len; i += 1) {
    monodata.push(imageData.data[i * 4 + 3]); // alpha (black)
    monodata.push(0); // red
    monodata.push(0); // green
    monodata.push(0); // blue
  }

  // create a ImageData Object which TensorFlow can use: tf.browser.fromPixels
  // more infos about ImageData Objects: https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data
  return new ImageData(new Uint8ClampedArray(monodata), MODEL_DIM, MODEL_DIM);
};

const prepareImageData = () => {
  const drawCanvas = document.getElementById('defaultCanvas0');

  // scale down canvas to the size the trained model expects (28x28 px)
  scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = MODEL_DIM;
  scaledCanvas.height = MODEL_DIM;
  scaledCanvas.getContext('2d').scale(MODEL_DIM / CANVAS_DIM, MODEL_DIM / CANVAS_DIM);
  scaledCanvas.getContext('2d').drawImage(drawCanvas, 0, 0);
  // document.body.appendChild(scaledCanvas);

  const imageData = scaledCanvas.getContext('2d').getImageData(0, 0, MODEL_DIM, MODEL_DIM);

  return getPixelValuesFromCanvas(imageData);
};

export const predict = async () => {
  const predictions = await tf.tidy(() => {
    const imageData = prepareImageData();
    const tensor = tf.browser.fromPixels(imageData, 1)
      .reshape([1, MODEL_DIM, MODEL_DIM, 1])
      .cast('float32');

    tensor.print();

    const output = model.predict(tensor);
    const predictionsArray = Array.from(output.dataSync());
    return predictionsArray;
  });

  console.log('predictions =>', predictions);
  showResults(predictions, scaledCanvas);
};
