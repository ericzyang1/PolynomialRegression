let regressionType = "";
let methodType = "";
let equation;
let prevType;
let prevMethod;

function changeRegression(type) {
  if (prevType) {
    prevType.style.backgroundColor = "";
    prevType.style.color = "";
    prevType.style.borderRadius = "";
  }
  if (prevMethod) {
    clearCanvas();
  }

  regressionType = type;
  document.getElementById("clear").disabled = false;
  let cur = document.getElementById(type);
  cur.style.backgroundColor = "green";
  cur.style.color = "white";
  cur.style.borderRadius = "2px";
  prevType = cur;

  document.getElementById("formula").disabled = false;
  if (type == "cubic") document.getElementById("gradient").disabled = true;
  else document.getElementById("gradient").disabled = false;
}

function changeMethod(method) {
  if (prevMethod) {
    prevMethod.style.backgroundColor = "";
    prevMethod.style.color = "";
    prevMethod.style.borderRadius = "";
  }

  methodType = method;
  let cur = document.getElementById(method);
  cur.style.backgroundColor = "green";
  cur.style.color = "white";
  cur.style.borderRadius = "2px";
  prevMethod = cur;
}

//variables
var data = [];
var a = Math.random(); //x^3
var b = Math.random(); //x^2
var c = Math.random(); //x
var d = Math.random(); //intercept
var error = 1;

function clearCanvas() {
  if (prevType) {
    prevType.style.backgroundColor = "";
    prevType.style.color = "";
    prevType.style.borderRadius = "";
  }
  if (prevMethod) {
    prevMethod.style.backgroundColor = "";
    prevMethod.style.color = "";
    prevMethod.style.borderRadius = "";
  }
  document.getElementById("clear").disabled = true;
  document.querySelector(".coefficients").textContent = "";
  regressionType = "";
  methodType = "";
  equation = "";
  data = [];
  document.getElementById("formula").disabled = true;
  document.getElementById("gradient").disabled = true;
}

let learning_rate = 0.3;
let velocityA = 0;
let velocityB = 0;
let velocityC = 0;
let beta1 = 0.95;

let rmsA = 0;
let rmsB = 0;
let rmsC = 0;
let beta2 = 0.999;
let epsilon = Math.pow(10, -6);

let t = 1;

//Create canvas and put it in a div
function setup() {
  let div = createCanvas(365, 345); //draw canvas
  div.parent("canvas");
}

//select method of regression - called repeatedly
function draw() {
  frameRate(30);
  background(0, 60, 0); //re-color background to mask previous lines
  for (let i = 0; i < data.length; i++) {
    var x = map(data[i].x, 0, 1, 0, width); //map all points to canvas size
    var y = map(data[i].y, 0, 1, height, 0);

    fill(255); //draw sm white circle at each point in data
    stroke(255);
    ellipse(x, y, 6, 6);
  }

  if (data.length > 2) {
    //Set method for finding bestfit line
    if (regressionType == "linear" && methodType == "formula")
      linearRegression(); //set a,b
    if (regressionType == "quadratic" && methodType == "formula")
      quadraticRegression(); //set a,b,c
    if (regressionType == "cubic" && methodType == "formula") cubicRegression(); //set a,b,c,d

    if (regressionType == "linear" && methodType == "gradient")
      linearGradientDescent(); //set a,b
    if (regressionType == "quadratic" && methodType == "gradient")
      quadraticGradientDescentWithADAM(); //set a,b,c
    if (regressionType == "cubic" && methodType == "gradient")
      cubicRegression(); //set a,b,c,d

    drawCurve(); //draw bestfit line
  }
}

function drawCurve() {
  beginShape();
  noFill();
  stroke(255);
  strokeWeight(1);

  for (let i = 0; i < 1; i += 0.01) {
    var x = map(i, 0, 1, 0, width); //map all points to canvas size
    var y = map(equation(i), 0, 1, height, 0);
    vertex(x, y);
  }
  endShape();
}

//add data point
function mousePressed() {
  if (regressionType && methodType) {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      // error = 1;
      var x = map(mouseX, 0, width, 0, 1); //map pixels to between 0 and 1
      var y = map(mouseY, 0, height, 1, 0);
      var point = createVector(x, y); //push datapoint to data array
      data.push(point);
    }
    loop();
  }
}

function linearRegression() {
  //MAIN least squares algorithm to calculate best fit
  let xSum = 0; //get x mean and y mean
  let ySum = 0;
  for (let i = 0; i < data.length; i++) {
    xSum += data[i].x;
    ySum += data[i].y;
  }
  let xMean = xSum / data.length;
  let yMean = ySum / data.length;

  let aNum = 0;
  let aDenom = 0;

  for (let i = 0; i < data.length; i++) {
    var x = data[i].x;
    var y = data[i].y;
    aNum += (x - xMean) * (y - yMean);
    aDenom += (x - xMean) * (x - xMean);
  }

  a = aNum / aDenom;
  b = yMean - a * xMean;

  equation = function (x) {
    return a * x + b;
  };

  document.querySelector(
    ".coefficients"
  ).textContent = `f(x) = \r\n${a}x+\r\n${b}`;
}

//formula
function quadraticRegression() {
  //MAIN least squares algorithm to calculate best fit
  let xSum = 0;
  let ySum = 0;
  let xSquaredSum = 0;
  let xCubedSum = 0;
  let xFourthSum = 0;
  let xySum = 0;
  let xSquaredySum = 0;

  for (let i = 0; i < data.length; i++) {
    xSum += data[i].x;
    ySum += data[i].y;
    xSquaredSum += Math.pow(data[i].x, 2);
    xCubedSum += Math.pow(data[i].x, 3);
    xFourthSum += Math.pow(data[i].x, 4);
    xySum += data[i].x * data[i].y;
    xSquaredySum += Math.pow(data[i].x, 2) * data[i].y;
  }

  [a, b, c] = solveQuadratic(
    xSum,
    ySum,
    xSquaredSum,
    xCubedSum,
    xFourthSum,
    xySum,
    xSquaredySum
  );

  equation = function (x) {
    return a * Math.pow(x, 2) + b * x + c;
  };

  document.querySelector(
    ".coefficients"
  ).textContent = `f(x) = \r\n${a}x^2+\r\n${b}x+\r\n${c}`;
}

//formula
function solveQuadratic(
  xSum,
  ySum,
  xSquaredSum,
  xCubedSum,
  xFourthSum,
  xySum,
  xSquaredySum
) {
  //1. Set matrix A and matrix B
  //2. store result of inverse(A) crossed with B
  //3. convert to flat array and return
  let matrixA = new Matrix(3, 3);
  matrixA.setData([
    [xFourthSum, xCubedSum, xSquaredSum],
    [xCubedSum, xSquaredSum, xSum],
    [xSquaredSum, xSum, data.length],
  ]);

  let matrixB = new Matrix(3, 1);
  matrixB.setData([[xSquaredySum], [xySum], [ySum]]);

  let matrixAInverse = Matrix.inverseForThreeByThree(matrixA);
  let output = Matrix.cross(matrixAInverse, matrixB);

  return [output.data[0][0], output.data[1][0], output.data[2][0]];
}

//formula
function cubicRegression() {
  //MAIN least squares algorithm to calculate best fit

  let xSixthSum = 0;
  let xFifthSum = 0;
  let xFourthSum = 0;
  let xCubedSum = 0;
  let xSquaredSum = 0;
  let xSum = 0;

  let xCubedySum = 0;
  let xSquaredySum = 0;
  let xySum = 0;
  let ySum = 0;

  for (let i = 0; i < data.length; i++) {
    xSixthSum += Math.pow(data[i].x, 6);
    xFifthSum += Math.pow(data[i].x, 5);
    xFourthSum += Math.pow(data[i].x, 4);
    xCubedSum += Math.pow(data[i].x, 3);
    xSquaredSum += Math.pow(data[i].x, 2);
    xSum += data[i].x;

    xCubedySum += Math.pow(data[i].x, 3) * data[i].y;
    xSquaredySum += Math.pow(data[i].x, 2) * data[i].y;
    xySum += data[i].x * data[i].y;
    ySum += data[i].y;
  }

  [a, b, c, d] = solveCubic(
    xSixthSum,
    xFifthSum,
    xFourthSum,
    xCubedSum,
    xSquaredSum,
    xSum,
    xCubedySum,
    xSquaredySum,
    xySum,
    ySum
  );

  equation = function (x) {
    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
  };

  document.querySelector(
    ".coefficients"
  ).textContent = `f(x) = \r\n${a}x^3+\r\n${b}x^2+\r\n${c}x+\r\n${d}`;
}

//formula
function solveCubic(
  xSixthSum,
  xFifthSum,
  xFourthSum,
  xCubedSum,
  xSquaredSum,
  xSum,
  xCubedySum,
  xSquaredySum,
  xySum,
  ySum
) {
  //1. Set matrix A and matrix B
  //2. store result of inverse(A) crossed with B
  //3. convert to flat array and return
  let matrixA = new Matrix(4, 4);
  matrixA.setData([
    [xSixthSum, xFifthSum, xFourthSum, xCubedSum],
    [xFifthSum, xFourthSum, xCubedSum, xSquaredSum],
    [xFourthSum, xCubedSum, xSquaredSum, xSum],
    [xCubedSum, xSquaredSum, xSum, data.length],
  ]);

  let matrixB = new Matrix(4, 1);
  matrixB.setData([[xCubedySum], [xSquaredySum], [xySum], [ySum]]);

  let matrixAInverse = Matrix.inverseForFourByFour(matrixA);
  let output = Matrix.cross(matrixAInverse, matrixB);

  return [
    output.data[0][0],
    output.data[1][0],
    output.data[2][0],
    output.data[3][0],
  ];
}

//GRADIENT DESCENT SECTION

function linearGradientDescent() {
  //let learning_rate = 0.1;

  //compute error for each data point.
  //Each data point is a supervised learning cycle
  //try changing it to stocastic gradient descent - taking a small subset of samples each time
  //try minibatch per step
  //
  for (let i = 0; i < data.length; i++) {
    let x = data[i].x;
    let y = data[i].y;

    let guess = a * x + b; //compute guess
    let error = y - guess; //calculate error

    a += error * x * learning_rate; //use error to finetune values
    b += error * learning_rate;
  }

  equation = function (x) {
    return a * x + b;
  };

  document.querySelector(
    ".coefficients"
  ).textContent = `f(x) = \r\n${a}x+\r\n${b}`;
}

function quadraticGradientDescentWithADAM() {
  console.log(a);

  for (let i = 0; i < data.length; i++) {
    let x = data[i].x;
    let y = data[i].y;

    let guess = a * Math.pow(x, 2) + b * x + c; //predict function
    let error = y - guess;

    velocityA = beta1 * velocityA + (1 - beta1) * error * Math.pow(x, 2);
    velocityB = beta1 * velocityB + (1 - beta1) * error * x;
    velocityC = beta1 * velocityC + (1 - beta1) * error;

    rmsA = beta2 * rmsA + (1 - beta2) * Math.pow(error * Math.pow(x, 2), 2);
    rmsB = beta2 * rmsB + (1 - beta2) * Math.pow(error * x, 2);
    rmsC = beta2 * rmsC + (1 - beta2) * Math.pow(error, 2);

    let velocityACorrected = velocityA / (1 - Math.pow(beta1, i + 1));
    let velocityBCorrected = velocityB / (1 - Math.pow(beta1, i + 1));
    let velocityCCorrected = velocityC / (1 - Math.pow(beta1, i + 1));
    let rmsACorrected = rmsA / (1 - Math.pow(beta2, i + 1));
    let rmsBCorrected = rmsB / (1 - Math.pow(beta2, i + 1));
    let rmsCCorrected = rmsC / (1 - Math.pow(beta2, i + 1));

    a +=
      (learning_rate * velocityACorrected) / Math.sqrt(rmsACorrected + epsilon);
    b +=
      (learning_rate * velocityBCorrected) / Math.sqrt(rmsBCorrected + epsilon);
    c +=
      (learning_rate * velocityCCorrected) / Math.sqrt(rmsCCorrected + epsilon);
    t++;
  }

  equation = function (x) {
    return a * Math.pow(x, 2) + b * x + c;
  };

  document.querySelector(
    ".coefficients"
  ).textContent = `f(x) = \r\n${a}x^2+\r\n${b}x+\r\n${c}`;
}

function gradientDescentWithADAM2() {
  for (let i = 0; i < data.length; i++) {
    let x = data[i].x;
    let y = data[i].y;

    let guess = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
    error = y - guess;
    if (Math.abs(error) < 0.001) noLoop(); //stop draw when error threshold is reached

    velocityA = beta1 * velocityA + (1 - beta1) * error * Math.pow(x, 3);
    velocityB = beta1 * velocityB + (1 - beta1) * error * Math.pow(x, 2);
    velocityC = beta1 * velocityC + (1 - beta1) * error * x;
    velocityD = beta1 * velocityD + (1 - beta1) * error;

    rmsA = beta2 * rmsA + (1 - beta2) * Math.pow(error * Math.pow(x, 3), 2);
    rmsB = beta2 * rmsB + (1 - beta2) * Math.pow(error * Math.pow(x, 2), 2);
    rmsC = beta2 * rmsC + (1 - beta2) * Math.pow(error * x, 2);
    rmsD = beta2 * rmsD + (1 - beta2) * Math.pow(error, 2);

    let velocityACorrected = velocityA / (1 - beta1);
    let velocityBCorrected = velocityB / (1 - beta1);
    let velocityCCorrected = velocityC / (1 - beta1);
    let velocityDCorrected = velocityD / (1 - beta1);
    let rmsACorrected = rmsA / (1 - beta2);
    let rmsBCorrected = rmsB / (1 - beta2);
    let rmsCCorrected = rmsC / (1 - beta2);
    let rmsDCorrected = rmsD / (1 - beta2);

    a +=
      (learning_rate * velocityACorrected) /
      (Math.sqrt(rmsACorrected) + epsilon);
    b +=
      (learning_rate * velocityBCorrected) /
      (Math.sqrt(rmsBCorrected) + epsilon);
    c +=
      (learning_rate * velocityCCorrected) /
      (Math.sqrt(rmsCCorrected) + epsilon);
    d +=
      (learning_rate * velocityDCorrected) /
      (Math.sqrt(rmsDCorrected) + epsilon);
  }
}

function gradientDescentWithADAM() {
  for (let i = 0; i < data.length; i++) {
    let x = data[i].x;
    let y = data[i].y;

    let guess = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
    error = y - guess;
    if (Math.abs(error) < 0.0005) noLoop(); //stop draw when error threshold is reached

    velocityA = beta1 * velocityA + (1 - beta1) * error * Math.pow(x, 3);
    velocityB = beta1 * velocityB + (1 - beta1) * error * Math.pow(x, 2);
    velocityC = beta1 * velocityC + (1 - beta1) * error * x;
    velocityD = beta1 * velocityD + (1 - beta1) * error;

    rmsA = beta2 * rmsA + (1 - beta2) * Math.pow(error * Math.pow(x, 3), 2);
    rmsB = beta2 * rmsB + (1 - beta2) * Math.pow(error * Math.pow(x, 2), 2);
    rmsC = beta2 * rmsC + (1 - beta2) * Math.pow(error * x, 2);
    rmsD = beta2 * rmsD + (1 - beta2) * Math.pow(error, 2);

    let velocityACorrected = velocityA / (1 - Math.pow(beta1, t));
    let velocityBCorrected = velocityB / (1 - Math.pow(beta1, t));
    let velocityCCorrected = velocityC / (1 - Math.pow(beta1, t));
    let velocityDCorrected = velocityD / (1 - Math.pow(beta1, t));
    let rmsACorrected = rmsA / (1 - Math.pow(beta2, t));
    let rmsBCorrected = rmsB / (1 - Math.pow(beta2, t));
    let rmsCCorrected = rmsC / (1 - Math.pow(beta2, t));
    let rmsDCorrected = rmsD / (1 - Math.pow(beta2, t));

    a +=
      (learning_rate * velocityACorrected) /
      (Math.sqrt(rmsACorrected) + epsilon);
    b +=
      (learning_rate * velocityBCorrected) /
      (Math.sqrt(rmsBCorrected) + epsilon);
    c +=
      (learning_rate * velocityCCorrected) /
      (Math.sqrt(rmsCCorrected) + epsilon);
    d +=
      (learning_rate * velocityDCorrected) /
      (Math.sqrt(rmsDCorrected) + epsilon);
  }
  t++;
}

function gradientDescentWithMomentum() {
  for (let i = 0; i < data.length; i++) {
    let x = data[i].x;
    let y = data[i].y;

    let guess = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
    let error = y - guess;

    a += velocityA * learning_rate;
    b += velocityB * learning_rate;
    c += velocityC * learning_rate;
    d += velocityD * learning_rate;

    velocityA = beta1 * velocityA + (1 - beta1) * error * Math.pow(x, 3);
    velocityB = beta1 * velocityB + (1 - beta1) * error * Math.pow(x, 2);
    velocityC = beta1 * velocityC + (1 - beta1) * error * x;
    velocityD = beta1 * velocityD + (1 - beta1) * error;
  }
}

function gradientDescent() {
  let learning_rate = 0.8;

  for (let i = 0; i < data.length; i++) {
    let x = data[i].x;
    let y = data[i].y;

    let guess = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;
    let error = y - guess;

    a += error * Math.pow(x, 3) * learning_rate;
    b += error * Math.pow(x, 2) * learning_rate;
    c += error * x * learning_rate;
    d += error * learning_rate;
  }
}

const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}
