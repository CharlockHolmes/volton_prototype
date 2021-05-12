
var anglex = 0;
var angley = 0;
let radius = 200;
let width = 20; 
let detailX = 30;
let detailY = 16;


function setup() {
  createCanvas(1000, 1000, WEBGL);
  radius = createSlider(1, 300, 100);
  radius.position(10, height + 35);
  radius.style('width', '80px');
  
  width = createSlider(1, 200, 30);
  width.position(10, height + 25);
  width.style('width', '80px');

  detailX = createSlider(1, 60, 24);
  detailX.position(10, height + 15);
  detailX.style('width', '80px');

  detailY = createSlider(1, 16, 1);
  detailY.position(10, height + 5);
  detailY.style('width', '80px');
}

function draw() {
  background(205, 105, 94);
  
  rotateX(anglex +=0.003);
  rotateY(anglex +=0.003);

  fill(130);

  cylinder(radius.value(), width.value(), detailX.value(), detailY.value() ,false, false);
  cylinder(radius.value()-1, width.value(), detailX.value(), detailY.value() ,false, false);
  fill(30);
  cylinder(radius.value()-2, width.value(), detailX.value(), detailY.value() ,false, false);
  cylinder(radius.value()-3, width.value(), detailX.value(), detailY.value() ,false, false);
}
