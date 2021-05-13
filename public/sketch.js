
// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});//alpha true sets the background to invisible
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const gui = new dat.GUI();

// Loading 

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/ressources/NormalMap.png');

// Materials

const geometry = new THREE.SphereBufferGeometry(.9,100,100);
//const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x272727);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(1,1,1);
pointLight2.intensity = 1; 
scene.add(pointLight2);

const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
scene.add(pointLightHelper2);

const light1 = gui.addFolder('light 1');
const ball = gui.addFolder('ball');

light1.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
light1.add(pointLight2.position, 'x').min(-6).max(6).step(0.01);
light1.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
ball.add(material, 'roughness').min(0).max(2).step(0.01);
ball.add(material, 'metalness').min(0).max(2).step(0.01);
light1.add(pointLight2, 'intensity').min(0).max(10).step(0.01);


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
  //cube.rotation.x += 0.01;
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