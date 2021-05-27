/*
commands:
ctrl+l : select line
shift+alt+arrow: copy down up
ctrl+k+0: collapse all
ctrl+k+1: namespace
ctrl+k+2: class
ctrl+k+3: methods
ctrl+k+4: blocks
ctrl+k+] or [: current cursor
ctrrl+k+j: uncollapse
ctrl+k+s : save all
*/
// Global variables
let reloadCount=0;
let groupGlobal;
let groupConnectors;
let pp;
let nn;
let pa;
let r;
let cubes = [];
let showGroupGlobal = true; 
const cameraPositionZ = 30;
const segmentsAround = 1000;
let defaultWidth = 1.234;
let defaultRadius = 1.66;
const inchPerUnit = 3;
const PI = Math.PI;

let beginMove;
let endMove;
let repeatMove;
let countMove;
let deltaMove;

let loaderCount = 0; // Used in the GUI
let inverseConnectors = false;
let gui = new dat.GUI();

let renderer;

const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/ressources/alphamap.png');
// Renderer
const canvas = document.querySelector('canvas.webgl');

function createRenderer(){
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

}

// Scene and camera
let scene;
let camera;
const fov = 5;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000; 

function createScene(){
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = cameraPositionZ*defaultRadius;
    scene = new THREE.Scene();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

createRenderer();
createScene();




// Lights
function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
}
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
            gltf.scene.scale.x = 0.015;
            gltf.scene.scale.y = 0.015;
            gltf.scene.scale.z = 0.015;

            gltf.scene.position.x = Math.cos(angle) * radius*1.001;
            gltf.scene.position.y = Math.sin(angle) * radius*1.001;
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
            if (flipped) gltf.scene.scale.x = -0.015;
            else gltf.scene.scale.x = 0.015;
            gltf.scene.scale.y = 0.015;
            gltf.scene.scale.z = 0.015;

            gltf.scene.position.x = Math.cos(angle) * radius*1.006;
            gltf.scene.position.y = Math.sin(angle) * radius*1.006;
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
if(localStorage.getItem('ring')!= null){
    loadRing();
    defaultRadius = r.radius;
    camera.position.z = cameraPositionZ*defaultRadius;

    loadCustomItem();
}
else defaultRing();

//Default ring that will appear on first load
function defaultRing() {
    //Create default ring
    createRing();
    clearObjectArrays();

    // Adding default hole
    addRingHole();
    addRingGap(-Math.PI / 16, Math.PI / 16);

    //Add borniers
    
    //Adding the special connectors depending on if they are reeversed or not
    
    // Loading the item
    loadCustomItem();
}
function loadDefaultConnectorSettings(){
    connectors = [];
    r.gaps.forEach(gap => {
        if (gap.type == 'barrel') {
            const conNum = Math.floor(r.width);
            if(conNum%2==1){
                addConnector(gap.begin, 0, 'barrel_screw'); 
                addConnector(gap.end, 0, 'barrel', true) 
            }
            if(conNum>1){
                for(let i =0; i<Math.floor(conNum/2); i++){
                    let offset;
                    offset = r.width/(3*(i+1));
                    addConnector(gap.begin,offset , 'barrel_screw');
                    addConnector(gap.end, offset, 'barrel', true);
                    addConnector(gap.begin, -offset, 'barrel_screw');
                    addConnector(gap.end, -offset, 'barrel', true);
                }
            } 
        }
    });
}
function loadDefaultBorniersSettings(){
    addBornier(undefined, -0.3);
    addBornier(undefined, 0.3);

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
    r.addConnector({
        angle: angle,
        offset: offset,
        type: type,
        flipped: flipped
    })
}

function addBornier(angle = Math.PI / 2, offset = 0, type='bornier') {
    r.addTerminal({
        angle: angle,
        offset: offset,
        type:type,
    });
}

function createRing(radius = defaultRadius, width = defaultWidth, resolution = segmentsAround) {
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
//Ø°

function addRingClock() {
    const rad = r.radius;
    const wide = r.width;
    const inchWide = wide * inchPerUnit;
    const inchDiam = rad * inchPerUnit * 2;
    const txtPosOffset = 0.92;
    addText('0°', rad * Math.cos(0) * txtPosOffset, rad * Math.sin(0) * txtPosOffset);
    addText('90°', rad * Math.cos(Math.PI / 2) * txtPosOffset, rad * Math.sin(Math.PI / 2) * txtPosOffset);
    addText('180°', rad * Math.cos(Math.PI) * txtPosOffset, rad * Math.sin(Math.PI) * txtPosOffset);
    addText('270°', rad * Math.cos(Math.PI * 3 / 2) * txtPosOffset, rad * Math.sin(Math.PI * 3 / 2) * txtPosOffset);

    addText('Ø ' + inchDiam.toFixed(2) + ' in', rad * Math.cos(Math.PI * 3 / 4) * txtPosOffset / 2, rad * Math.sin(Math.PI * 3 / 4) * txtPosOffset / 2, Math.PI * 7 / 4, {color: 0x003333});
    addText('<< ' + inchWide.toFixed(2) + ' in >>', undefined, undefined, Math.PI * 7 / 4, {color: 0x330033}, false, {
        px: rad * Math.cos(Math.PI * 3 / 4) * txtPosOffset,
        py: rad * Math.sin(Math.PI * 3 / 4) * txtPosOffset,
        pz: 0,
        rx: 0,
        ry: -PI * 3 / 2,
        rz: 0
    });

    const clock0180Geo = new THREE.BoxGeometry(rad * 1.8, 0.005, 0.005);
    const clock0180Mesh = new THREE.MeshBasicMaterial({color: 0x333333});
    const clock0180 = new THREE.Mesh(clock0180Geo, clock0180Mesh);

    const clock90270Geo = new THREE.BoxGeometry(rad * 1.8, 0.005, 0.005);
    const clock90270Mesh = new THREE.MeshBasicMaterial({color: 0x333333});
    const clock90270 = new THREE.Mesh(clock90270Geo, clock90270Mesh);
    clock90270.rotation.z = Math.PI / 2;

    const clockDiameterGeo = new THREE.BoxGeometry(rad * 1.9, 0.003, 0.003);
    const clockDiameterMesh = new THREE.MeshBasicMaterial({color: 0x003333});
    const clockDiameter = new THREE.Mesh(clockDiameterGeo, clockDiameterMesh);
    clockDiameter.rotation.z = Math.PI * 3 / 4;

    const clockWidthGeo = new THREE.BoxGeometry(0.003, 0.003, wide);
    const clockWidthMesh = new THREE.MeshBasicMaterial({color: 0x003333});
    const clockWidth = new THREE.Mesh(clockWidthGeo, clockWidthMesh);
    clockWidth.position.x = rad * .95 * Math.cos(PI * 3 / 4);
    clockWidth.position.y = rad * .95 * Math.sin(PI * 3 / 4);

    groupGlobal.add(clock0180);
    groupGlobal.add(clock90270);
    groupGlobal.add(clockDiameter);
    groupGlobal.add(clockWidth);
    scene.add(groupGlobal);
}
/**
 * Adds the Inner Information text and shapes. Ring must be defined. Depends on Global variable : r, groupGlobal, camera
 * @param {*} msg The text value. 
 * @param {*} px X coordiinate of the center of the text
 * @param {*} py Y coordinate of the center of the text
 * @param {*} rz Set special z axis rotation
 * @param {*} color Add custom color, red is set by default
 * @param {*} followCamera makes the text turn around if enabled 
 * @param {*} options {px, py, pz, rx, ry, rz} if defined, followcamera becomes false. 
 */
 function addText(msg, px, py = 0, rz = 0, color = {
    color: 0x990000
}, followCamera = true, options = undefined) {
    const textLoader = new THREE.FontLoader();
    textLoader.load('/ressources/Roboto Black_Regular.json', function (font) {
        const geoTxt = new THREE.TextGeometry(msg, {
            font: font,
            size: 0.03*r.radius,
            height: 0.002,
        })
        geoTxt.computeBoundingBox();
        const centerOffset = -0.5 * (geoTxt.boundingBox.max.x - geoTxt.boundingBox.min.x);
        const matTxt = new THREE.MeshBasicMaterial(color);
        const txtThing = new THREE.Mesh(geoTxt, matTxt);
        if (options === undefined) {
            txtThing.position.x = centerOffset + px;
            txtThing.position.y = py;
            txtThing.rotation.z = rz;
        } else {
            txtThing.position.x = options.px ;
            txtThing.position.y = options.py ;
            txtThing.position.z = options.pz ;
            txtThing.rotation.x = options.rx ;
            txtThing.rotation.y = options.ry ;
            txtThing.rotation.z = options.rz ;
            followCamera = false;
        }
        groupGlobal.add(txtThing); // add to group 
        controls.addEventListener('change', () => {
            if (followCamera) {
                if (camera.position.z <= 0) {
                    txtThing.rotation.y = Math.PI;
                    txtThing.rotation.z = -rz;
                    txtThing.position.x = px - centerOffset;
                } else {
                    txtThing.rotation.y = 0;
                    txtThing.rotation.z = rz;
                    txtThing.position.x = px + centerOffset;
                }
            }
        })
    });
}

function initGlobals(){
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    gui.destroy();
    gui = new dat.GUI();
    groupGlobal = new THREE.Group();
    groupConnectors = new THREE.Group();
}

function clearObjectArrays(){
    r.terminals = [];
    r.connectors = [];
}

function loadCustomItem() {
    loadMenuThings();
    clearObjectArrays();

    initGlobals();
    addRingClock();
    loadDefaultConnectorSettings();
    loadDefaultBorniersSettings();

    r.terminals.forEach(borne => {
        loadBornier(borne.offset, r.radius, borne.angle);
    });

    r.connectors.forEach(connector => {
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
            shininess: 12,
            alphaMap: normalTexture,
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
    renderer.render(scene, camera);
    
    if(countMove<=repeatMove){
        camera.position.x += deltaMove.px;
        camera.position.y += deltaMove.py;
        camera.position.z += deltaMove.pz;
        controls.target.x += deltaMove.tx;
        controls.target.y += deltaMove.ty;
        controls.target.z += deltaMove.tz;
        
        camera.rotation._x += deltaMove.rx;
        camera.rotation._y += deltaMove.ry;
        camera.rotation._z += deltaMove.rz; 
        countMove++
        camera.updateProjectionMatrix();
        camera.updateMatrix();
    }
    
    controls.update(); // Needs to be after the camera movement to update properly
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
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }
// window.addEventListener('resize', () => {
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;
//     renderer.setSize(sizes.width, sizes.height);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

//requestAnimationFrame(render); // initiates the first reloop; 

/**
 * Event Handlers with buttons
 */
 window.addEventListener( 'resize', onWindowResize, false );

 function onWindowResize(){
 
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
 
     renderer.setSize( window.innerWidth, window.innerHeight );
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 }
document.getElementById('clocktoggle').onclick = () => {
    showGroupGlobal = !showGroupGlobal;
    groupGlobal.visible = showGroupGlobal;
}
document.getElementById('resetcamera').onclick = () => {
    beginMove = {
        px:camera.position.x.toFixed(10),
        py:camera.position.y.toFixed(10),
        pz:camera.position.z.toFixed(10),
        rx:camera.rotation.x.toFixed(10),
        ry:camera.rotation.y.toFixed(10),
        rz:camera.rotation.z.toFixed(10),
        tx: controls.target.x,
        ty: controls.target.y,
        tz: controls.target.z
    }
    endMove = {
        px:0,
        py:0,
        pz:(cameraPositionZ*defaultRadius).toFixed(10),
        rx:0,
        ry:0,
        rz:0,
        tx:0,
        ty:0,
        tz:0
    } 
    
    repeatMove = 50;
    deltaMove = {
        px: (endMove.px - beginMove.px)/repeatMove,
        py: (endMove.py - beginMove.py)/(repeatMove),
        pz: (endMove.pz - beginMove.pz)/(repeatMove),
        rx: (endMove.rx - beginMove.rx)/(repeatMove),
        ry: (endMove.ry - beginMove.ry)/repeatMove,
        rz: (endMove.rz - beginMove.rz)/repeatMove,
        tx: (endMove.tx - beginMove.tx)/repeatMove,
        ty: (endMove.ty - beginMove.ty)/repeatMove,
        tz: (endMove.tz - beginMove.tz)/repeatMove,
    }

    countMove = 0;
    
    

}

document.getElementById('submitbutton').onclick = () =>{
    let twidth = document.getElementById('ringwidth').value;
    let tdiameter = document.getElementById('ringdiameter').value;
    document.getElementById('ringgap').value = 'not implemented';
    let tresolution = document.getElementById('ringresolution').value;
    console.log(twidth, tdiameter, tresolution);
    if(!Number.isFinite(twidth))r.width = twidth/inchPerUnit;
    else console.log('Error: variable width is not a number')
    if(!Number.isFinite(tdiameter))r.radius = tdiameter/2/inchPerUnit;
    else console.log('Error: variable height is not a number')
    if(!Number.isFinite(tresolution))r.resolution = tresolution;
    else console.log('Error: variable resolution is not a number')
    
    defaultRadius = tdiameter/inchPerUnit/2;
    camera.position.z = cameraPositionZ*defaultRadius;
    saveRing(); 
}
document.getElementById('loadbutton').onclick = () =>{
    loadMenuThings();
}
document.getElementById('submitgapbutton').onclick = () =>{
    let twidth = document.getElementById('gapwidth').value;
    let tangle = document.getElementById('gapangle').value;
    console.log(twidth, tangle)
    if(!Number.isFinite(twidth)&&!Number.isFinite(tangle)){
        r.gaps = [];
        r.addGap(undefined, undefined, 'barrel', {position:tangle*2*PI/360, angle:twidth*2*PI/360});
        saveRing();
    }
    else console.log('angle entries are invalid')

}
document.getElementById('loadgapbutton').onclick = () =>{
    loadMenuThings();
}
document.getElementById('defaultring').onclick = () =>{
    defaultRing();
    saveRing();
}

function saveRing(){
    localStorage.setItem('ring', JSON.stringify(r));
    reloadCount++;
    if(reloadCount>5)
    location.reload();
    else loadCustomItem();
}
function loadRing(){
    const ring = JSON.parse(localStorage.getItem('ring'));
    r = new Ring(ring.radius, ring.width, ring.resolution,ring.holes, ring.gaps, ring.terminals, ring.connectors, ring.thickness);
}

function loadMenuThings(){
    document.getElementById('ringwidth').value = (r.width*inchPerUnit).toFixed(2);
    document.getElementById('ringdiameter').value = (r.radius*2*inchPerUnit).toFixed(2);
    document.getElementById('ringgap').value = 'not implemented';
    document.getElementById('ringresolution').value = r.resolution;
    document.getElementById('gapwidth').value = (r.gaps[0].begin-r.gaps[0].end)*360/(2*PI);
    document.getElementById('gapangle').value = (r.gaps[0].begin+r.gaps[0].end)/2*360/(2*PI);
}