//http://learningthreejs.com/blog/2011/12/10/constructive-solid-geometry-with-csg-js/ 
// guide how to do csg
//import { OBJLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/OBJLoader.js';



let borniers = [];
let connectors = [];
let loaderCount = 0; // Used in the GUI

let inverseConnectors = false;

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

let pp;
let nn;
let pa;
let r;
let cubes = [];
const segmentsAround = 500;

function loadBasicGUI(gltf, num, name) {

    const f = gui.addFolder(name + ' ' + num);
    const gpos = f.addFolder("Position");
    const gscale = f.addFolder("Scale");
    const grot = f.addFolder("Rotation");

    gscale.add(gltf.scene.scale, 'x').min(-1).max(0.01).step(0.001);
    gscale.add(gltf.scene.scale, 'y').min(-1).max(0.01).step(0.001);
    gscale.add(gltf.scene.scale, 'z').min(-1).max(0.01).step(0.001);

    gpos.add(gltf.scene.position, 'x').min(-5).max(5).step(0.01);
    gpos.add(gltf.scene.position, 'y').min(-5).max(5).step(0.01);
    gpos.add(gltf.scene.position, 'z').min(-5).max(5).step(0.01);

    grot.add(gltf.scene.rotation, 'x').min(0).max(Math.PI * 2).step(0.01);
    grot.add(gltf.scene.rotation, 'y').min(0).max(Math.PI * 2).step(0.01);
    grot.add(gltf.scene.rotation, 'z').min(0).max(Math.PI * 2).step(0.01);
}
// Loads a bornier object;
function loadBornier(offsetZ, radius, angle = Math.PI / 2, num = loaderCount++) {
    const loader = new THREE.GLTFLoader();
    loader.load('ressources/bornier.glb', //'ressources/bornier.glb',
        (gltf) => {
            loadBasicGUI(gltf, num, 'Bornier');
            //angle-=Math.PI/2;
            gltf.scene.scale.x = 0.01;
            gltf.scene.scale.y = 0.01;
            gltf.scene.scale.z = 0.01;

            gltf.scene.position.x = Math.cos(angle) * radius;
            gltf.scene.position.y = Math.sin(angle) * radius;
            gltf.scene.position.z = offsetZ;

            gltf.scene.rotation.z = angle - Math.PI / 2;

            scene.add(gltf.scene);
            console.log("A Bornier was Added to scene");
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        (error) => {
            console.log('An error happened')
        });
}



function loadConnector(offsetZ, radius, angle = Math.PI / 2, name, flipped = false, num = loaderCount++) {
    const loader = new THREE.GLTFLoader();
    loader.load('ressources/' + name + '.glb', //'ressources/bornier.glb',
        (gltf) => {
            loadBasicGUI(gltf, num, name);
            //angle-=Math.PI/2;
            if (flipped) gltf.scene.scale.x = -0.01;
            else gltf.scene.scale.x = 0.01;
            gltf.scene.scale.y = 0.01;
            gltf.scene.scale.z = 0.01;

            gltf.scene.position.x = Math.cos(angle) * radius;
            gltf.scene.position.y = Math.sin(angle) * radius;
            gltf.scene.position.z = offsetZ;
            if (inverseConnectors) {
                if (name == "barrel") angle -= 0.1;
                if (name == 'barrel_screw') angle += 0.1;
            } else {
                if (name == "barrel") angle += 0.1;
                if (name == 'barrel_screw') angle -= 0.1;
            }

            gltf.scene.rotation.z = angle - Math.PI / 2;


            scene.add(gltf.scene);
            console.log("A " + name + " was Added to scene");
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        (error) => {
            console.log('An error happened' + error)
        });
}


defaultRing();
//strangeRing();
//Default ring that will appear on first load
function defaultRing() {
    //Create default ring
    createRing();

    // Adding default hole
    addRingHole();
    addRingGap(-Math.PI / 16, Math.PI / 16);

    //Add borniers
    addBornier(undefined, -0.25);
    addBornier(undefined, 0.25);

    //Adding the special connectors depending on if they are reeversed or not
    r.gaps.forEach(gap => {
        if (gap.type == 'barrel') {
            if (!inverseConnectors) {
                addConnector(gap.begin, 0.25, 'barrel_screw');
                addConnector(gap.begin, 0, 'barrel_screw');
                addConnector(gap.begin, -0.25, 'barrel_screw');
                addConnector(gap.end, 0.25, 'barrel', true);
                addConnector(gap.end, 0, 'barrel', true);
                addConnector(gap.end, -0.25, 'barrel', true);
            }
            if(inverseConnectors){
                addConnector(gap.end, 0.25, 'barrel_screw', true);
                addConnector(gap.end, 0, 'barrel_screw', true);
                addConnector(gap.end, -0.25, 'barrel_screw', true);
                addConnector(gap.begin, 0.25, 'barrel');
                addConnector(gap.begin, 0, 'barrel');
                addConnector(gap.begin, -0.25, 'barrel');
            }


        }
    });


    // Loading the item
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

function addConnector(angle = 0, offset = 0, type = 'barrel', flipped = false) {
    connectors.push({
        angle: angle,
        offset: offset,
        type: type,
        flipped: flipped
    })
}

function addBornier(angle = Math.PI / 2, offset = 0) {
    borniers.push({
        angle: angle,
        offset: offset
    });
}

function createRing(radius = 1, width = 1, resolution = segmentsAround) {
    r = new Ring(radius, width, resolution);
}

function clearHoles() {
    r.holes = [];
}

function addRingGap(begin = -0.25, end = 0.25, type = 'barrel') {
    r.addGap(begin, end, type);
}

function addRingHole(angle = Math.PI, radius = 0.2, offset = 0, type = 'circle') {
    r.addHole(angle, radius, offset, type);
}

function loadCustomItem() {


    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Load bornier connectors
    gui.destroy();
    gui = new dat.GUI();

    borniers.forEach(borne => {
        loadBornier(borne.offset, r.radius, borne.angle);
    });

    connectors.forEach(connector => {
        loadConnector(connector.offset, r.radius, connector.angle, connector.type, connector.flipped);
    });


    addLight(-2, 20, 4);
    addLight(2, -20, 3);
    //addLight(-3, 10, 0.5);

    //Ring material
    const segmentsDown = 16;
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