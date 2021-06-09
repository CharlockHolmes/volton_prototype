/**
 * Note:
 * Design decision:
 */
const TEXTSIZE = 10;
let mode = '';
let p5canvas;
let loadedRing = JSON.parse(localStorage.getItem('ring'));
const lr = loadedRing;
let lrwidth = loadedRing.width;
let lrlength = loadedRing.radius * 2 * Math.PI;
let aspectRatio = lrwidth / lrlength;
let centerResize = false; 

let canvasWidth = window.innerWidth*0.75; 
let canvasHeight = canvasWidth*aspectRatio+200;
let mtop = 75;
let mleft = 25;
let mright = 25;
let mbot = 25;
//let pwidth = canvasWidth - mleft - mright; 
let pheight = canvasHeight - mtop - mbot;
let pwidth = pheight/aspectRatio; 
let pHeightConversionUnit = 2;
let pUnitType = 'inch';
let pRadius = 1; 

let xtrans = 0;

const toInch = 1/pheight*lrwidth*inchPerUnit;
const toDeg = 360/pwidth;

let seeAll = false; 
const STARTHIDDEN = true;
let hidden = STARTHIDDEN;

shapes = [];
demoShapes = [];

let scrollbar;

function setup() {
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.parent('p5holder');

    demoShapes.push(new DemoRectangle(10, 10, 15,15));
    demoShapes.push(new DemoCircle(30, 10, 15));
    demoShapes.push(new DemoVertical_Slot(50, 10, 15,10));
    demoShapes.push(new DemoHorizontal_Slot(80, 10, 15,10));

    /* Scrollbar init */
    scrollbar = new ScrollBar(canvasWidth/2, canvasHeight-mbot/2);
    scrollbar.w = (canvasWidth-mleft-mright)/pwidth*canvasWidth;
    //Here we toggle the drawing thing
    if(STARTHIDDEN)p5canvas.hide();
    document.getElementById('drawing').onclick = () => {
        if (!hidden) {
            p5canvas.hide();
            console.log('the canvas got spooked away')
            hidden = true;
        } else {
            p5canvas.show();
            console.log('guess whoss back baby')
            hidden = false;
        }
    };
    document.getElementById('selectall').onclick = () => seeAll = !seeAll; 
    holeImport();
}

function draw() {
    xtrans = scrollbar.mapTo(scrollbar.x);
    drawBand();
    drawCursor();
    /* Draw The rounded shapes and the demoShapes */
    drawContour();
    drawDemoShapes();
    calculatePower();

    drawTextSelected();
    drawDegrees();
    scrollbar.draw();
    
}
function drawBand(){
    push();
    translate(xtrans,0)
    translate(mleft, mtop);
    background(220);
    drawGaps();
    fill(255);
    stroke(1);
    for (let i = shapes.length - 1; i >= 0; i--) {
        shapes[i].draw();
    }
    pop();
}
function drawCursor(){
    push();
    translate(xtrans,0);
    let runloop = true;
    shapes.forEach(shape =>{
        if(runloop){
            if(shape.isInOuterBoundary(mouseX-mleft-xtrans, mouseY-mtop))
                if(shape.isInInnerBoundary(mouseX-mleft-xtrans, mouseY-mtop)){
                    runloop = false; 
                    cursor('grab');
                }
                else {
                    runloop = false; 
                    cursor('pointer');
                }
            if(shape.selected)runloop = false;
        }
    })
    if(runloop)cursor(ARROW);
    if(scrollbar.isInOuterBoundary(mouseX, mouseY)||scrollbar.selected)cursor('ew-resize');
    pop();
}
function drawDemoShapes(){
    demoShapes.forEach(shape =>{
        shape.draw();
    })
}
function drawTextSelected(){
    push();
    translate(mleft, mtop);
    translate(xtrans,0);
    shapes.forEach(shape=>{
        shape.textSelected();
    })
    pop();
}
function drawDegrees(){
    push();
    fill(0);
    translate(mleft, mtop);
    translate(xtrans,0);
    textAlign(CENTER,BOTTOM);
    for(let i =0; i<=pwidth; i+=pwidth/12){
        fill(0);
        text((i/pwidth*360).toFixed(0)+'°', i, pheight);
        fill('rgba(0,0,0,0.1)')
        line(i, pheight-15, i, pheight-20);
        line(i, 5, i, 10);
    }
    pop();
}

function drawContour(){
    push();
    noStroke();
    fill(100)
    rectMode(CORNER);
    rect(0, 0, width, mtop);
    rect(0, 0, mleft, height);
    rect(width - mright, 0, mright, height);
    rect(0, height - mbot, width, mbot);
    pop();
}
function drawGaps(){
    push();
    rectMode(CORNER);
    noStroke();
    lr.gaps.forEach(gap=>{
        let gb = gap.begin/(2*PI)*pwidth;
        let ge = gap.end/(2*PI)*pwidth; 
        fill(255,10,10);
        if(gb>=0&&ge>=0){  
            rect(gb, 0, ge-gb,pheight);
        }
        else if(gb<0&&ge>=0){
            gb += pwidth;
            rect(gb,0, pwidth-gb, pheight);
            rect(0,0, ge, pheight);
        }
    })
    pop();
}
function calculatePower(){

    let arcLength=0;
    lr.gaps.forEach(gap=>{
        arcLength += lrlength*INCH_PER_UNIT*(gap.end - gap.begin)/(2*PI);
    })
    let u = (lrlength*INCH_PER_UNIT)-arcLength;
    let k;
    if(lr.width*INCH_PER_UNIT < 2)k = (u - 0.8) * (lr.width*INCH_PER_UNIT- 0.36)
    if(lr.width*INCH_PER_UNIT >= 2)k = (u - 0.8) * (lr.width*INCH_PER_UNIT- 0.72)
    let holeArea = 0; 
    shapes.forEach((shape)=>{
        holeArea += shape.getArea() + (1*0.5); // Calculate hole area with an added 0.5 inch^2 per hole for the surrounding area
    })
    const area = k - holeArea - lr.terminals.length*0.75; // roughly 0.75 inch sqr per terminal 
    const powerAsked = document.getElementById('powerasked').value||0;
    // console.log('u', u);
    // console.log('arcLength', arcLength);
    // console.log('k', k);
    // console.log('holeArea', holeArea);
    const ppsi = powerAsked/area;
    document.getElementById('powerpersqrinch').value = ppsi.toFixed(2);
    if(ppsi<42)document.getElementById('powerpersqrinch').style = 'color:black';
    else if(ppsi<52)document.getElementById('powerpersqrinch').style = 'color:orange';
    else document.getElementById('powerpersqrinch').style = 'color:red';
    
    const voltage = document.getElementById('voltage').value;
    const current = (powerAsked/voltage).toFixed(2);
    document.getElementById('current').value = current;
    if(current<25)document.getElementById('current').style = 'color:black';
    else document.getElementById('current').style = 'color:red';
}

function keyPressed() {
    if (keyCode === DELETE) shapes.forEach((shape) => {
        if (shape.selected) {
            const ind = shapes.indexOf(shape);
            shapes.splice(ind, 1);
        }
    })
    itemKeyOperation(key);
}

function itemKeyOperation(key) {
    if (key == 'w' || key == 'a' || key == 's' || key == 'd' || key == 'e' || key == 'q' || key=='r' || key =='f') {
        shapes.forEach((shape) => {
            if (shape.selected) {
                switch (key) {
                    case "w":
                        shape.y -= 1;
                        break;
                    case 'a':
                        shape.x -= 1;
                        break;
                    case 's':
                        shape.y += 1;
                        break;
                    case 'd':
                        shape.x += 1;
                        break;
                    case 'e':
                        shape.w += 1;
                        break;
                    case 'q':
                        shape.w -= 1;
                        break;
                    case'r':
                        shape.h +=1;
                        break;
                    case 'f':
                        shape.h-=1;
                    default:
                        break;
                }
            }
        })
    }
}

function doubleClicked() {
    if(mouseX > 0 && mouseX < width &&mouseY>0 && mouseY<height){

        const mx = mouseX - mleft;
        const my = mouseY - mtop;
        let happened = false; 
        shapes.forEach(shape =>{
            if(!happened)
                if(shape.isInOuterBoundary){
                    shape.doubleClicked()
                    happened = true;
                }       
        });
    }
}

function mousePressed() {
    if(mouseX > 0 && mouseX < width &&mouseY>0 && mouseY<height){
        shapes.forEach(shape => {
            shape.unSelect();
        });
        scrollbar.selected =false;
        let makeNew = false;
        demoShapes.forEach(shape =>{
            if(shape.isInOuterBoundary(mouseX,mouseY)){
                if(shape.type=='rect'){
                    console.log('make new rectangle')
                    shapes.push(new Rectangle(50,50, 50,50))
                }
                if(shape.type=='circle'){
                    console.log('make new circle')
                    shapes.push(new Circle(50,50, 50))
                }
                if(shape.type=='v_slot'){
                    console.log('make new v_slot')
                    shapes.push(new Vertical_Slot(50,50,50,50))
                }
                if(shape.type=='h_slot'){
                    console.log('make new h_slot')
                    shapes.push(new Horizontal_Slot(50,50,50,50))
                }
            }
        })
        let oneClicked = false; 
        shapes.some(shape => {
            const mx = mouseX - mleft-xtrans;
            const my = mouseY - mtop;
            if(!oneClicked&&shape.isInOuterBoundary(mx,my)){
                shape.select(mx, my);
                oneClicked = true;
            }
        });
        /* Puts selected shape in front and at the begining of the array */
        shapes.sort((a,b)=>{
            if(a.selected)return -1;
            if(b.selected)return 1;
            return 0;
        })
        if(mouseY>height-mbot){
            if(scrollbar.isInOuterBoundary(mouseX,mouseY))scrollbar.selected = true;
        }
}
}
function mouseReleased(){
    scrollbar.selected = false;
}
function mouseDragged() {
    if(mouseX > 0 && mouseX < width &&mouseY>0 && mouseY<height){
        shapes.forEach(shape => {
            const mx = this.mouseX - mleft-xtrans;
            const my = this.mouseY - mtop ;
            if (shape.selected) {
                shape.dragged(mx,my);
            }
        });
        
    }
    if(scrollbar.selected){
        scrollbar.dragged(mouseX);
        //scrollbar.x = mouseX;
        //xtrans = pwidth-(mouseX/width*(pwidth-(canvasWidth-mleft-mright)/2))-pwidth+(canvasWidth-mleft-mright)/2;
     }

}


function drawArrow(x, y, l, w, horizontal = true, txt = '') {
    
    if (l < 0) l = l * -1;
    if (w < 0) w = w * -1;
    const spacing = txt.toFixed(3).toString().length * 3;

    //console.log(spacing);
    if (horizontal) {
        fill(50);
        stroke(2);
        line(x - l / 2, y, x - spacing, y);
        line(x + l / 2, y, x + spacing, y);
        line(x - l / 2, y, x - l / 2 + w / 2, y - w / 2)
        line(x - l / 2, y, x - l / 2 + w / 2, y + w / 2)
        line(x + l / 2, y, x + l / 2 - w / 2, y - w / 2)
        line(x + l / 2, y, x + l / 2 - w / 2, y + w / 2)

    } else {
        fill(50);
        stroke(2);
        line(x, y - l / 2, x + w / 2, y - l / 2 + w / 2)
        line(x, y - l / 2, x - w / 2, y - l / 2 + w / 2)
        line(x, y - l / 2, x, y - 10);
        line(x, y + l / 2, x, y + 10);
        line(x, y + l / 2, x + w / 2, y + l / 2 - w / 2)
        line(x, y + l / 2, x - w / 2, y + l / 2 - w / 2)
    }
    textSize(TEXTSIZE);
    textAlign(CENTER, CENTER);
    if(typeof txt == 'number')
    txt = txt.toFixed(3);
    
    if(txt.charAt(0)==='0')txt = txt.replace('0','');
    else if(txt.charAt(1)==='0')txt = txt.replace('0','');

    text(txt, x, y);
}
const xoff = [20,22]
const yoff = [15,15]
const _UPLEFT = {p1:{x:-xoff[0], y:-yoff[0]},p2:{x:-xoff[1], y:-yoff[1]},align:'right'}
const _DOWNLEFT = {p1:{x:-xoff[0], y:yoff[0]},p2:{x:-xoff[1], y:yoff[1]},align:'right'}
const _UPRIGHT = {p1:{x:xoff[0], y:-yoff[0]},p2:{x:xoff[1], y:-yoff[1]}, align:'left'}
const _DOWNRIGHT = {p1:{x:xoff[0], y:yoff[0]},p2:{x:xoff[1], y:yoff[1]}, align:'left'}
const _POSITIONING = [_UPLEFT,_DOWNLEFT,_DOWNRIGHT,_UPRIGHT]
function pointArrow(hole,txt){
    /* Remove the first zero if in position 0 or 1 */
    if(txt.charAt(0)==='0')txt = txt.replace('0','');
    else if(txt.charAt(1)==='0')txt = txt.replace('0','');

    let pts = _POSITIONING[hole.arrowIndex]; 
    let x, y; 
    switch(hole.type){
         case 'rect':
            break;
        case 'circle':
            if(hole.arrowIndex==0){
                x = hole.x + Math.cos(PI*3/4)*hole.w/2;
                y = hole.y - Math.sin(PI*3/4)*hole.w/2;
            }
            if(hole.arrowIndex==1){
                x = hole.x + Math.cos(PI*5/4)*hole.w/2;
                y = hole.y - Math.sin(PI*5/4)*hole.w/2;
            }
            if(hole.arrowIndex==2){
                x = hole.x + Math.cos(PI*7/4)*hole.w/2;
                y = hole.y - Math.sin(PI*7/4)*hole.w/2;
            }
            if(hole.arrowIndex==3){
                x = hole.x + Math.cos(PI*1/4)*hole.w/2;
                y = hole.y - Math.sin(PI*1/4)*hole.w/2;
            }
            break;
        case 'v_slot':
            if(hole.arrowIndex==0){
                x = hole.x + Math.cos(PI*3/4)*hole.w/2;
                y = hole.y -hole.h/2- Math.sin(PI*3/4)*hole.w/2;
            }
            if(hole.arrowIndex==1){
                x = hole.x + Math.cos(PI*5/4)*hole.w/2;
                y = hole.y +hole.h/2- Math.sin(PI*5/4)*hole.w/2;
            }
            if(hole.arrowIndex==2){
                x = hole.x + Math.cos(PI*7/4)*hole.w/2;
                y = hole.y +hole.h/2- Math.sin(PI*7/4)*hole.w/2;
            }
            if(hole.arrowIndex==3){
                x = hole.x + Math.cos(PI*1/4)*hole.w/2;
                y = hole.y -hole.h/2- Math.sin(PI*1/4)*hole.w/2;
            }
            break;
        case 'h_slot':
            if(hole.arrowIndex==0){
                x = hole.x - hole.w/2+ Math.cos(PI*3/4)*hole.h/2;
                y = hole.y - Math.sin(PI*3/4)*hole.h/2;
            }
            if(hole.arrowIndex==1){
                x = hole.x - hole.w/2+ Math.cos(PI*5/4)*hole.h/2;
                y = hole.y - Math.sin(PI*5/4)*hole.h/2;
            }
            if(hole.arrowIndex==2){
                x = hole.x + hole.w/2+ Math.cos(PI*7/4)*hole.h/2;
                y = hole.y - Math.sin(PI*7/4)*hole.h/2;
            }
            if(hole.arrowIndex==3){
                x = hole.x + hole.w/2+ Math.cos(PI*1/4)*hole.h/2;
                y = hole.y - Math.sin(PI*1/4)*hole.h/2;
            }
            break;
        default: console.log('Wrong type entry, only {upleft, downleft, upright, downright} are accepted')
    }
    if(pts!=0){
        stroke(2);
        line(x, y, x+pts.p1.x, y+pts.p1.y);
        line(x+pts.p2.x, y+pts.p2.y, x+pts.p1.x, y+pts.p1.y);
        textAlign(pts.align, CENTER);
        textSize(TEXTSIZE);
        text(txt, pts.p2.x+x, pts.p2.y+y)
    }

}
document.getElementById('exportholes').onclick = ()=>{
    let holes = [];
    shapes.forEach(shape => {
        if(shape.type === 'circle'){
            holes.push({
                r: shape.w/2/(pheight)*(lrwidth),
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: shape.x*2*PI/pwidth,
                type: shape.type,
            })
        }
        if(shape.type === 'rect'){
            holes.push({
                r: {w:shape.w/2/(pheight)*(lrwidth), h:shape.h/2/(pheight)*(lrwidth)},
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: shape.x*2*PI/pwidth,
                type: shape.type,
            })
        }
        if(shape.type === 'v_slot'){
            randID = (Math.random()*10000).toFixed(0);
            holes.push({
                r: {w:shape.w/2/(pheight)*(lrwidth), h:shape.h/2/(pheight)*(lrwidth)},
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: shape.x*2*PI/pwidth,
                type: 'rect',
                id:'v_slot'+randID
            })
            holes.push({
                r: shape.w/2/(pheight)*(lrwidth),
                offset:(shape.y+shape.h/2)/pheight*lrwidth- lrwidth/2,
                angle: shape.x*2*PI/pwidth,
                type: 'circle',
                id:'v_slot'+randID
            })
            holes.push({
                r: shape.w/2/(pheight)*(lrwidth),
                offset:(shape.y-shape.h/2)/pheight*lrwidth- lrwidth/2,
                angle: shape.x*2*PI/pwidth,
                type: 'circle',
                id:'v_slot'+randID
            })
        }
        if(shape.type === 'h_slot'){
            randID = (Math.random()*10000).toFixed(0);
            holes.push({
                r: {w:shape.w/2/(pheight)*(lrwidth), h:shape.h/2/(pheight)*(lrwidth)},
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: shape.x*2*PI/pwidth,
                type: 'rect',
                id:'h_slot'+randID
            })
            holes.push({
                r: shape.h/2/(pheight)*(lrwidth),
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: (shape.x+shape.w/4)*2*PI/pwidth,
                type: 'circle',
                id:'h_slot'+randID
            })
            holes.push({
                r: shape.h/2/(pheight)*(lrwidth),
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: (shape.x-shape.w/4)*2*PI/pwidth,
                type: 'circle',
                id:'h_slot'+randID
            })
        }
    })
    localStorage.setItem('holes', JSON.stringify(holes));
    loadRingHoles();
}

document.getElementById('importholes').onclick = ()=>{
    holeImport();
}
function holeImport(){
    let holes = loadedRing.holes;
    shapes = [];
    holes.forEach(hole =>{
        if(hole.id==undefined){
            if(hole.type=='circle'){
                shapes.push(new Circle(hole.angle/(2*PI)*pwidth, 
                (lrwidth/2+hole.offset)/lrwidth*pheight, 
                hole.r*2/lrwidth*pheight))
            }
            if(hole.type=='rect'){
                shapes.push(new Rectangle(hole.angle/(2*PI)*pwidth, 
                    (lrwidth/2+hole.offset)/lrwidth*pheight, 
                    hole.r.w*2/lrwidth*pheight,
                    hole.r.h*2/lrwidth*pheight)); 
            }
        }
        else if(hole.id.charAt(0)=='v'&&hole.type=='rect'){
            shapes.push(new Vertical_Slot(hole.angle/(2*PI)*pwidth, 
                (lrwidth/2+hole.offset)/lrwidth*pheight, 
                hole.r.w*2/lrwidth*pheight,
                hole.r.h*2/lrwidth*pheight)); 
        }
        else if(hole.id.charAt(0)=='h'&&hole.type=='rect'){
            shapes.push(new Horizontal_Slot(hole.angle/(2*PI)*pwidth, 
                (lrwidth/2+hole.offset)/lrwidth*pheight, 
                hole.r.w*2/lrwidth*pheight,
                hole.r.h*2/lrwidth*pheight)); 
        }
    })
}

function selectHole(hole){
    document.getElementById('h_angle').value = (hole.x*toDeg).toFixed(1);    
    document.getElementById('h_height').value = (hole.h*toInch).toFixed(3);    
    document.getElementById('h_width').value = (hole.w*toInch).toFixed(3);    
    document.getElementById('h_offset').value = (hole.y*toInch).toFixed(3);    
}  
document.getElementById('submitholebutton').onclick = ()=>{
    shapes.forEach(hole=>{
        if(hole.selected){
            hole.x = 1/toDeg* document.getElementById('h_angle').value;
            hole.h = 1/toInch* document.getElementById('h_height').value;
            hole.w = 1/toInch*document.getElementById('h_width').value;
            hole.y = 1/toInch* document.getElementById('h_offset').value;
        }
    })
}