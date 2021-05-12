
var anglex = 0;
var angley = 0;
let radius = 200;
let width = 20; 
let detailX = 30;
let detailY = 16;


function setup() {
  createCanvas(1000, 1000, WEBGL);
  sliderInit();
}

function draw() {
  //console.log(mouseX);
  let msx = mouseX-this.width/2;
  //msx -= ;
  const msy = (mouseY - this.height / 2);

  let v = createVector(msx, msy, 0);
  //v.div(200);
  v.normalize();
  //console.log(width/2);

  ambientLight(20,20,20); // light coming from all directions
  pointLight(255,255,255, 0,500,0);
  pointLight(255,255,255, 0,0,600);
  pointLight(255,255,255, 0,200,400);
  directionalLight(255,255,240,v);
  background(205, 105, 94);
  
  rotateX(anglex +=0.006);
  rotateY(angley +=0.01);
  showRing();

  
  
}

function showRing(){
  //normalMaterial(); // ranbow color for debug
  ambientMaterial(255,255,255); // only reacts of there is light
  cylinder(radius.value(), width.value(), detailX.value(), detailY.value() ,false, false);
  cylinder(radius.value()-1, width.value(), detailX.value(), detailY.value() ,false, false);
  ambientMaterial(200,200,200);
  cylinder(radius.value()-2, width.value(), detailX.value(), detailY.value() ,false, false);
  cylinder(radius.value()-3, width.value(), detailX.value(), detailY.value() ,false, false);
}

function sliderInit(){
  radius = createSlider(1, 500, 250);
  radius.position(10, height + 35);
  radius.style('width', '80px');
  
  width = createSlider(1, 500, 110);
  width.position(10, height + 25);
  width.style('width', '80px');

  detailX = createSlider(1, 60, 24);
  detailX.position(10, height + 15);
  detailX.style('width', '80px');

  detailY = createSlider(1, 60, 15);
  detailY.position(10, height + 5);
  detailY.style('width', '80px');
}