import * as tf from '@tensorflow/tfjs';
import { CANVAS_DIM, MODEL_DIM } from './consts';

let model;


export const initModel = async () => {
  model = await tf.loadLayersModel('./model/model.json');
  model.summary();
};

const prepareImageData = () => {
  const canvImg = document.getElementById('defaultCanvas0');
  const ctx = canvImg.getContext('2d');
  const oldimgdata = ctx.getImageData(0, 0, CANVAS_DIM, CANVAS_DIM);

  const newcvs = document.createElement('canvas');
  newcvs.width = CANVAS_DIM;
  newcvs.height = CANVAS_DIM;
  newcvs.getContext('2d').putImageData(oldimgdata, 0, 0);

  const dstcvs = document.createElement('canvas');
  dstcvs.width = MODEL_DIM;
  dstcvs.height = MODEL_DIM;
  dstcvs.getContext('2d').scale(MODEL_DIM / CANVAS_DIM, MODEL_DIM / CANVAS_DIM);
  dstcvs.getContext('2d').drawImage(newcvs, 0, 0);
  document.body.appendChild(dstcvs);

  const imageData = dstcvs.getContext('2d').getImageData(0, 0, 28, 28);

  const monodata = [];
  console.log('imageData =>', imageData);

  for (let i = 0, len = imageData.data.length / 4; i < len; i += 1) {
    monodata.push(imageData.data[i * 4 + 3]); // black values
    monodata.push(0);
    monodata.push(0);
    monodata.push(0);
  }

  return new ImageData(new Uint8ClampedArray(monodata), 28, 28);
};

export const predict = async () => {
  const pred = await tf.tidy(() => {
    const imageData = prepareImageData();
    const tensor = tf.browser.fromPixels(imageData, 1)
      .reshape([1, 28, 28, 1])
      .cast('float32')
      .div(tf.scalar(255));

    console.log('tensor =>', tensor);
    tensor.print();

    const output = model.predict(tensor);
    console.log('output =>', output);
    const predictions = Array.from(output.dataSync());
    return predictions;
  });

  console.log('predictions =>', pred);
  console.log('res =>', pred.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]);
};
