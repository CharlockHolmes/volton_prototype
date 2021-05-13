var anglex = 0;
var angley = 0;
let radius = 200;
let width = 20;
let detailX = 30;
let detailY = 16;
const vertexes = [];

function preload() {
  //i.e 
  // sun = loadImage('sun.jpg');

  // now you can use texture(sun) to replace the material type
}

function setup() {
  createCanvas(1000, 1000, WEBGL);
  sliderInit();
}

function draw() {
  const msx = mouseX - this.width / 2;
  const msy = (mouseY - this.height / 2);
  let v = createVector(msx, msy, 0);
  v.normalize();
  this.directionalLight(255, 255, 240, v);
  lights(msx, msy);

  background(205, 105, 94);

  //push(); //can be used to remove the rotate effect and other things
  //translate(); used to move the reeference point
  rotateX(anglex += 0.4);
  rotateY(angley += 0.4);
  //showHomeMade();
  showCustom();
  //translate(200,200,200);
  //box(255);

  //showRing();
  //pop();


}

function showRing() {
  //normalMaterial(); // ranbow color for debug
  ambientMaterial(240, 240, 240); // only reacts of there is light
  cylinder(radius.value(), width.value(), detailX.value(), detailY.value(), false, false);
  cylinder(radius.value() - 1, width.value(), detailX.value(), detailY.value(), false, false);
  ambientMaterial(200, 200, 200);
  cylinder(radius.value() - 2, width.value(), detailX.value(), detailY.value(), false, false);
  cylinder(radius.value() - 3, width.value(), detailX.value(), detailY.value(), false, false);
}

function sliderInit() {
  radius = createSlider(1, 500, 250);
  radius.position(10, height + 35);
  radius.style('width', '80px');

  width = createSlider(100, 200, 101);
  width.position(10, height + 25);
  width.style('width', '80px');

  detailX = createSlider(1, 60, 24);
  detailX.position(10, height + 15);
  detailX.style('width', '80px');

  detailY = createSlider(1, 100, 20);
  detailY.position(10, height + 5);
  detailY.style('width', '80px');
}

function lights(msx, msy) {
  this.ambientLight(20, 20, 20); // light coming from all directions
  this.pointLight(255, 255, 255, 0, 500, 0);
  this.pointLight(255, 255, 255, 0, 0, 600);
  this.pointLight(255, 255, 255, 0, 200, 400);

}

function mousePressed() {
  addV(this.mouseX - this.width / 2, this.mouseY - this.height / 2, 0);
}

function addV(ptx, pty, ptz) {
  vertexes.push({
    pointx: ptx,
    pointy: pty,
    pointz: ptz
  });
}

function showHomeMade() {
  beginShape(TESS);
  vertexes.forEach(v => {
    vertex(v.pointx, v.pointy, v.pointz);
  });
  endShape();
}

function showCustom() {

  angleMode(DEGREES);
  let a = 0;
  const n = detailX.value();
  const r = radius.value();
  const da = 360 / n;
  stroke(255);
  fill(100);
  beginShape(TESS);
  for (let i = 0; i < n + 1; i++) {
    const px = cos(a) * r;
    const py = sin(a) * r;
    vertex(px, py, 0);
    a += da;
  }
  a = 360;
  for (let i = 0; i < n + 1; i++) {
    const px = cos(a) * r;
    const py = sin(a) * r;
    vertex(px * width.value() / 100, py * width.value() / 100, 0);
    a += da;
  }
  endShape(CLOSE);
  beginShape(TESS);
  a = 0;
  for (let i = 0; i < n + 1; i++) {
    const px = cos(a) * r;
    const py = sin(a) * r;
    vertex(px, py, detailY.value());
    a += da;
  }
  a = 360;
  for (let i = 0; i < n + 1; i++) {
    const px = cos(a) * r;
    const py = sin(a) * r;
    vertex(px * width.value() / 100, py * width.value() / 100, detailY.value());
    a += da;
  }

  endShape(CLOSE);

  a = 0;
  for (let x = 0; x < n; x++) {
    noStroke();
    fill(177);
    for (let i = 0; i < detailY.value(); i+=3) {
      beginShape();
      const px1 = cos(a) * r;
      const py1 = sin(a) * r;
      const px2 = cos(a + da) * r;
      const py2 = sin(a + da) * r;
      vertex(px1, py1, i);
      vertex(px1, py1, i + 3);
      vertex(px2, py2, i);
      vertex(px2, py2, i + 3);
      endShape(CLOSE);
      //console.log("new shape");
    }
    a+=da;
  }

}