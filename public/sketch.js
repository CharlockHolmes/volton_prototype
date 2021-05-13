
import * as THREE from 'three.js';
import * as dat from 'https://cdn.jsdelivr.net/npm/dat.gui@0.6.5/build/dat.gui.min.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@v0.128.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});//alpha true sets the background to invisible
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();

const geometry = new THREE.BoxGeometry();
//const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const sizes = {
  width : window.innerWidth,
  height : window.innerHeight
}
window.addEventListener('resize', () =>{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();










// var plane, vertices = [],
//   planeShape;
// var planeMaterial = new THREE.MeshLambertMaterial({
//   color: 0xC0C0C0
// });

// vertices.push(
//   new THREE.Vector3(-150, -150, 0),
//   new THREE.Vector3(150, -150, 0),
//   new THREE.Vector3(150, 150, 0),
//   new THREE.Vector3(-150, 150, 0)
// );

// planeShape = new THREE.Shape(vertices);

// plane = new THREE.Mesh(new THREE.ShapeGeometry(planeShape), planeMaterial);

// scene.add(plane);

// var holes = [
//     new THREE.Vector3(-75, -75, 0),
//     new THREE.Vector3(75, -75, 0),
//     new THREE.Vector3(75, 75, 0),
//     new THREE.Vector3(-75, 75, 0)
//   ],

//   hole = new THREE.Path();
// hole.fromPoints(holes);

// var shape = new THREE.Shape(plane.geometry.vertices);
// shape.holes = [hole];
// var points = shape.extractPoints();

// plane.geometry.faces = [];

// var triangles = THREE.ShapeUtils.triangulateShape(points.shape, points.holes);

// plane.geometry.vertices.push(
//   new THREE.Vector3(-75, -75, 0),
//   new THREE.Vector3(75, -75, 0),
//   new THREE.Vector3(75, 75, 0),
//   new THREE.Vector3(-75, 75, 0)
// );
// for (var i = 0; i < triangles.length; i++) {
//   plane.geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
// }


// var plane, vertices = [],
//   planeShape;
// var planeMaterial = new THREE.MeshLambertMaterial({
//   color: 0xC0C0C0
// });

// vertices.push(
//   new THREE.Vector3(-150, -150, 0),
//   new THREE.Vector3(150, -150, 0),
//   new THREE.Vector3(150, 150, 0),
//   new THREE.Vector3(-150, 150, 0)
// );

// planeShape = new THREE.Shape(vertices);

// plane = new THREE.Mesh(new THREE.ShapeGeometry(planeShape), planeMaterial);

// scene.add(plane);

// var holes = [
//     new THREE.Vector3(-75, -75, 0),
//     new THREE.Vector3(75, -75, 0),
//     new THREE.Vector3(75, 75, 0),
//     new THREE.Vector3(-75, 75, 0)
//   ],

//   hole = new THREE.Path();
// hole.fromPoints(holes);

// var shape = new THREE.Shape(plane.geometry.vertices);
// shape.holes = [hole];
// var points = shape.extractPoints();

// plane.geometry.faces = [];

// var triangles = THREE.ShapeUtils.triangulateShape(points.shape, points.holes);

// plane.geometry.vertices.push(
//   new THREE.Vector3(-75, -75, 0),
//   new THREE.Vector3(75, -75, 0),
//   new THREE.Vector3(75, 75, 0),
//   new THREE.Vector3(-75, 75, 0)
// );
// for (var i = 0; i < triangles.length; i++) {
//   plane.geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
// }