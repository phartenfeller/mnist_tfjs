let table;

const getPredictedNumber = predictions => predictions.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];

const addResultsTable = () => {
  let cell;
  table = document.createElement('table');
  const header = table.createTHead();
  const headerRow = header.insertRow(0);
  headerRow.className = 'header-row';
  cell = headerRow.insertCell(0);
  cell.innerHTML = 'Image';

  for (let i = 0; i < 10; i++) {
    cell = headerRow.insertCell(i + 1);
    cell.innerHTML = i;
  }

  document.body.appendChild(table);
};

const addResultsRow = (predictions, img) => {
  let cell;
  const predictedNumber = getPredictedNumber(predictions);

  const row = table.insertRow(table.rows.length);
  row.className = 'result-row';
  cell = row.insertCell(0);
  cell.appendChild(img);

  for (let i = 0; i < 10; i++) {
    const fixedPrediction = predictions[i].toFixed(2);
    console.log('fixedPrediction =>', fixedPrediction);
    const prediction = predictions[i] === 1 ? 100 : fixedPrediction;
    cell = row.insertCell(i + 1);
    cell.innerHTML = prediction;

    if (i === predictedNumber) {
      cell.className = 'prediction';
    }
  }
};

export const showResults = (predictions, img) => {
  if (!table) addResultsTable();
  addResultsRow(predictions, img);
};
