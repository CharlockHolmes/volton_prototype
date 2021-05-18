//http://learningthreejs.com/blog/2011/12/10/constructive-solid-geometry-with-csg-js/ 
// guide how to do csg





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

const group = new THREE.Group();

// Camera
const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const scene = new THREE.Scene();
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
let r;
let cubes = [];
const segmentsAround = 1000;
defaultRing();

function defaultRing(){
    createRing(1,1,2500);
    addRingHole(); 
    addRingHole(0,0.2,0.1);
    addRingHole(2,0.1,-0.2);
    addRingHole(2,0.1,0.2);
    addRingHole(-2,0.1,-0.2);
    addRingHole(-2,0.1,0.2);

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

function createRing(radius = 1, width = 1, resolution = segmentsAround){
    r = new Ring(radius, width, resolution);
}
function clearHoles(){
    r.holes = [];
}
function addRingGap(){
    r.addGap(Math.PI-0.25, Math.PI+0.25);
}
function addRingHole(angle = 0, radius = 0.3, offset = 0){
    r.addHole(angle, radius, offset);
}
function loadCustomItem() {
    while(scene.children.length > 0){ 
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
    
    
    //Sets an instance of the whole object 
    function makeInstance(geometry, color, x) {
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
    cubes.forEach((cube, ndx) => {
        const speed = -0.2 + ndx * .1;
        const rot = time * speed;
        cube.rotation.y = rot;
    });
    renderer.render(scene, camera);
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