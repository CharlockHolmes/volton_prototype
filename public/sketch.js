//http://learningthreejs.com/blog/2011/12/10/constructive-solid-geometry-with-csg-js/ 
// guide how to do csg
//import { OBJLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/OBJLoader.js';






let gui = new dat.GUI();

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/ressources/alphamap.png');
// Renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.localClippingEnabled = true;



// Camera
const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const scene = new THREE.Scene();

const controls = new THREE.OrbitControls(camera, renderer.domElement);


// Lights
function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
}



/*
// function makeSpherePositions(segmentsAround, segmentsDown) {
//     const numVertices = segmentsAround * segmentsDown * 6;
//     const numComponents = 3;
//     const positions = new Float32Array(numVertices * numComponents);
//     const indices = [];

//     const longHelper = new THREE.Object3D();
//     const latHelper = new THREE.Object3D();
//     const pointHelper = new THREE.Object3D();
//     longHelper.add(latHelper);
//     latHelper.add(pointHelper);
//     pointHelper.position.z = 1;
//     const temp = new THREE.Vector3();

//     function getPoint(lat, long) {
//         latHelper.rotation.x = lat;
//         longHelper.rotation.y = long;
//         longHelper.updateMatrixWorld(true);
//         return pointHelper.getWorldPosition(temp).toArray();
//     }

//     let posNdx = 0;
//     let ndx = 0;
//     for (let down = 0; down < segmentsDown; ++down) {
//         const v0 = down / segmentsDown;
//         const v1 = (down + 1) / segmentsDown;
//         const lat0 = (v0 - 0.5) * Math.PI;
//         const lat1 = (v1 - 0.5) * Math.PI;

//         for (let across = 0; across < segmentsAround; ++across) {
//             const u0 = across / segmentsAround;
//             const u1 = (across + 1) / segmentsAround;
//             const long0 = u0 * Math.PI * 2;
//             const long1 = u1 * Math.PI * 2;

//             positions.set(getPoint(lat0, long0), posNdx);
//             posNdx += numComponents;
//             positions.set(getPoint(lat1, long0), posNdx);
//             posNdx += numComponents;
//             positions.set(getPoint(lat0, long1), posNdx);
//             posNdx += numComponents;
//             positions.set(getPoint(lat1, long1), posNdx);
//             posNdx += numComponents;

//             indices.push(
//                 ndx, ndx + 1, ndx + 2,
//                 ndx + 2, ndx + 1, ndx + 3,
//             );
//             ndx += 4;
//         }
//     }
//     return {
//         positions,
//         indices
//     };
// }
*/
let pp;
let nn;
let pa;
let r;
let cubes = [];
const segmentsAround = 1000;
// Loads an object 
function loadBox() {
    const loader = new THREE.GLTFLoader();
    loader.load('ressources/box.glb',
        (gltf) => {
            gui.destroy();
            gui = new dat.GUI();
            const gpos = gui.addFolder("Position");
            const gscale = gui.addFolder("Scale");
            const grot = gui.addFolder("Rotation");

            gscale.add(gltf.scene.scale, 'x').min(0).max(1).step(0.01);
            gscale.add(gltf.scene.scale, 'y').min(0).max(1).step(0.01);
            gscale.add(gltf.scene.scale, 'z').min(0).max(1).step(0.01);

            gpos.add(gltf.scene.position, 'x').min(-5).max(5).step(0.01);
            gpos.add(gltf.scene.position, 'y').min(-5).max(5).step(0.01);
            gpos.add(gltf.scene.position, 'z').min(-5).max(5).step(0.01);

            grot.add(gltf.scene.rotation, 'x').min(0).max(5).step(0.01);
            grot.add(gltf.scene.rotation, 'y').min(0).max(5).step(0.01);
            grot.add(gltf.scene.rotation, 'z').min(0).max(5).step(0.01);

            gltf.scene.scale.x = 0.1;
            gltf.scene.scale.y = 0.1;
            gltf.scene.scale.z = 0.1;
            console.log(gltf);
            scene.add(gltf.scene);
            console.log("Added to scene")
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        (error) => {
            console.log('An error happened')
        });
}

defaultRing();
//strangeRing();
function defaultRing() {
    createRing();
    addRingHole();
    addRingGap();
    loadCustomItem();
}

function strangeRing() {
    createRing(1, 1, 2500);
    addRingHole();
    addRingHole(0, 0.2, 0.1);
    addRingHole(2, 0.1, -0.2, 'square');
    addRingHole(2, 0.1, 0.2, "square");
    addRingHole(-2, 0.1, -0.2, "square");
    addRingHole(-2, 0.1, 0.2, "square");

    addRingHole(0, 0.02, 0.4);
    addRingHole(0.1, 0.02, 0.4);
    addRingHole(-0.1, 0.02, 0.4);

    addRingHole(0, 0.02, -0.4);
    addRingHole(0.1, 0.02, -0.4);
    addRingHole(-0.1, 0.02, -0.4);

    addRingGap();
    loadCustomItem();
}
//loadCustomItem();

function createRing(radius = 1, width = 1, resolution = segmentsAround) {
    r = new Ring(radius, width, resolution);
}

function clearHoles() {
    r.holes = [];
}

function addRingGap(begin = Math.PI - 0.25, end = Math.PI + 0.25) {
    r.addGap(begin, end);
}

function addRingHole(angle = 0, radius = 0.3, offset = 0, type = 'circle') {
    r.addHole(angle, radius, offset, type);
}

function loadCustomItem() {

    loadBox();
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    addLight(-1, 20, 4);
    addLight(2, -20, 3);
    //Ring material
    //const segmentsAround = 1500; // This is where you et the precision degree
    const segmentsDown = 16;
    //r = new Ring(1, 1, segmentsAround);
    //r.addHole(0, 0.3, 0, 'circle');
    //r.addHole(2, 0.5, 0.3, 'circle');
    //r.addHole(1, 0.3, 0.01, 'circle');
    const {
        positions,
        indices
    } = r.makeShape(segmentsAround, 1); //makeSpherePositions(segmentsAround, segmentsDown);




    console.log("ShapeCompleted", positions.length, indices.length);
    //console.log(indices);
    const normals = positions.slice();
    pp = positions;
    nn = normals;
    // Making the geometry 
    const geometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;


    renderer.renderLists.dispose();
    const positionAttribute = new THREE.BufferAttribute(positions, positionNumComponents);
    positionAttribute.setUsage(THREE.DynamicDrawUsage); // becasue it needs to know the attribute may change
    geometry.setAttribute('position', positionAttribute); // we use attributes to move around things
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setIndex(indices);
    console.log(geometry);
    pa = positionAttribute;

    //Sets an instance of the whole object 
    function makeInstance(geometry, color, x) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        const material = new THREE.MeshPhongMaterial({
            color,
            side: THREE.DoubleSide,
            shininess: 100,
            alphaMap: normalTexture
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }



    cubes = [
        makeInstance(geometry, 0x999999, 0),
    ];
    requestAnimationFrame(render);
}


function render(time) {
    const positions = pp;
    const normals = nn;
    const positionAttribute = pa;
    time *= 0.001; // the callback sets the time value

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    /*
    for (let i = 0; i < positions.length; i += 3) {
        const quad = (i / 12 | 0);
        const ringId = quad / segmentsAround | 0;
        const ringQuadId = quad % segmentsAround;
        const ringU = ringQuadId / segmentsAround;
        const angle = ringU * Math.PI * 2;
        temp.fromArray(normals, i);
        temp.multiplyScalar(THREE.MathUtils.lerp(1, 1.4, Math.sin(time + ringId + angle) * .5 + .5));
        temp.toArray(positions, i);
    }
    positionAttribute.needsUpdate = true; //Need to say it to update the thing
    */
    // cubes.forEach((cube, ndx) => {
    //     const speed = -0.2 + ndx * .1;
    //     const rot = time * speed;
    //     cube.rotation.y = rot * 2;
    //     scene.children[scene.children.length-1].rotation.y = rot * 2;
    //     //cube.rotation.x = rot*8.2;
    // });
    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(render);
}

// Ajusts to the canvas size
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const temp = new THREE.Vector3();


// Window resize
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//requestAnimationFrame(render); // initiates the first reloop; 