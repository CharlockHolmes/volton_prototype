/**
 * Note:
 * Design decision:
 */


const TEXTSIZE = 11;
const TEXTSIZEA = 15;
let mode = '';
let p5canvas;
let loadedRing
let lr
let lrwidth
let lrlength
let aspectRatio
let centerResize

let mtop = 25;
let mleft = 25;
let mright = 25;
let mbot = 25;
//let pwidth = canvasWidth - mleft - mright; 
let pHeightConversionUnit = 2;
let pUnitType = 'inch';
let pRadius = 1; 

let xtrans = 0;

let canvasWidth; 
let canvasHeight;
let pheight;
let pwidth; 
let toInch;
let toDeg;
let toRad;
function letInit(){
    loadedRing = JSON.parse(localStorage.getItem('ring'));
    lr = loadedRing;
    lrwidth = loadedRing.width;
    lrlength = loadedRing.radius * 2 * Math.PI;
    aspectRatio = lrwidth / lrlength;
    centerResize = false; 

    canvasWidth = window.innerWidth*0.84; 
    canvasHeight = canvasWidth*aspectRatio+400;
    if(canvasHeight >= window.innerHeight*0.7)canvasHeight = window.innerHeight*0.7;
    if(canvasHeight <= window.innerHeight*0.6)canvasHeight = window.innerHeight*0.6;

    pheight = canvasHeight - mtop - mbot;
    pwidth = pheight/aspectRatio;
    toInch = 1/pheight*lrwidth*inchPerUnit;
    toDeg = 360/pwidth;
    toRad = 2*PI/pwidth;
}
//letInit();
let seeAll = false; 
const STARTHIDDEN = false;
let hidden = STARTHIDDEN;

let shapes = [];
let connectors = [];
let terminals = [];
let demoShapes = [];
let lastClick = {x:0,y:0, show:false}

let scrollbar;
let barrel_img;
let barrel_f_img;
let barrel_screw_img;
let barrel_screw_f_img;
let barrel_qlatch_img;
let barrel_qlatch_f_img;
let terminal_img;
let hash_img;
let scrollbar_img;
let leftarrow_img;
let rightarrow_img;
function preload(){
    barrel_img = loadImage('ressources/2dtextures/barrel.png');
    barrel_f_img= loadImage('ressources/2dtextures/barrel_f.png');
    barrel_screw_img= loadImage('ressources/2dtextures/barrel_screw.png');
    barrel_screw_f_img= loadImage('ressources/2dtextures/barrel_screw_f.png');
    barrel_qlatch_img= loadImage('ressources/2dtextures/barrel_qlatch.png');
    barrel_qlatch_f_img= loadImage('ressources/2dtextures/barrel_qlatch_f.png');
    terminal_img= loadImage('ressources/2dtextures/terminal.png');
    hash_img = loadImage('ressources/2dtextures/hash.png');
    scrollbar_img = loadImage('ressources/2dtextures/scrollbar.png');
    rightarrow_img = loadImage('ressources/2dtextures/rightarrow.png');
    leftarrow_img = loadImage('ressources/2dtextures/leftarrow.png');
}
function setup() {
    pixelDensity(2)
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.parent('p5holder');

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
    itemImport();
}
function draw() {
    xtrans = scrollbar.mapTo(scrollbar.x);
    drawBand();
    drawCursor();
    /* Draw The rounded shapes and the demoShapes */
    drawContour();
    drawDemoShapes();
    calculatePower();
    drawLastClick();
    drawTextSelected();
    drawDegrees();
    if(mouseIsPressed)
        if(scrollbar.isInArrowBoxes(mouseX, mouseY))
            scrollbar.clickArrowBoxes(mouseX, mouseY);
    scrollbar.draw();
    
}
function drawLastClick(){
    push();
    translate(xtrans,0);
    translate(mleft, mtop);
    fill(255,100,100);
    if(lastClick.show)
        ellipse(lastClick.x, lastClick.y,5)
    pop();
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
        push()
        shape.textSelected();
        pop()
    })
    pop();
}
function drawDegrees(){
    push();
    fill(0);
    translate(mleft, mtop);
    translate(xtrans,0);
    textAlign(CENTER,BOTTOM);
    strokeWeight(1);
    for(let i =0; i<=pwidth; i+=pwidth/12){
        fill(0);
        text((i/pwidth*360).toFixed(0)+'°', i, pheight);
        fill('rgba(0,0,0,0.1)')
        line(i, pheight-15, i, pheight-21);
        line(i, 5, i, 11);
        line(i+pwidth/24, pheight-15, i+pwidth/24, pheight-18);
        line(i+pwidth/24, 5, i+pwidth/24,8);
    }
    pop();
}
function drawContour(){
    push();
    noStroke();
    fill('#777777')
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
    strokeWeight(1);
    lr.gaps.forEach(gap=>{
        let gb = gap.begin/(2*PI)*pwidth;
        let ge = gap.end/(2*PI)*pwidth; 
        if(gb>=0&&ge>=0){  
            fill(115,110,110);
            rect(gb, 0, ge-gb,pheight);
            if(seeAll)
                text_with_angle('GAP', gb+(ge-gb)/2, pheight/2, -Math.PI/2)
            //image(hash_img,gb, 0, ge-gb,pheight);
        }
        else if(gb<0&&ge>=0){
            fill(115,110,110);
            gb += pwidth;
            //image(hash_img,gb,0, pwidth-gb, pheight);
            //image(hash_img,0,0, ge, pheight);
            rect(gb,0, pwidth-gb, pheight);
            rect(0,0, ge, pheight);
            if(seeAll){
                text_with_angle('GAP', gb+(pwidth-gb)/2, pheight/2, -Math.PI/2)
                text_with_angle('GAP', ge/2, pheight/2, -Math.PI/2)
            }
        }
    })
    pop();
}
function text_with_angle(msg='a', x, y = pheight/2, angle){
    push()
    translate(x,y)
    fill(0);
    textAlign(CENTER,CENTER)
    stroke(1);
    textSize(20);
    rotate(angle);
    text(msg,0, 0)
    pop()
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
document.addEventListener("keydown", function (e) {
    if([37,38,39,40].indexOf(e.keyCode) > -1){
      e.preventDefault();
      // Do whatever else you want with the keydown event (i.e. your navigation).
    }
  }, false);
function keyPressed() {
    
    if (keyCode === DELETE) shapes.forEach((shape) => {
        if (shape.selected) {
            const ind = shapes.indexOf(shape);
            shapes.splice(ind, 1);
        }
    })
    if(keyIsDown(17)){
        ctrlKeyOperation(key)
    }
    else itemKeyOperation(key);
}
function ctrlKeyOperation(key){
    if(key=='z'||key=='Z'){
        get_z_save();
    }
}
function itemKeyOperation(key) {
    console.log(key)
    if (plannerBoxFlag&&(key == 'w' || key == 'a' || key == 's' || key == 'd' || key == 'e' || key == 'q' || key=='r' || key =='f'|| key =='c'|| key =='m' || key=='t'||key == 'ArrowUp' || key == 'ArrowLeft' || key == 'ArrowDown' || key == 'ArrowRight' )) {
        shapes.forEach((shape) => {
            if (shape.selected) {
                add_z_save();
                switch (key) {
                    case "ArrowUp":
                    case "w":
                        shape.y -= 1;
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        shape.x -= 1;
                        break;
                    case 'ArrowDown':
                    case 's':
                        shape.y += 1;
                        break;
                    case 'ArrowRight':
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
                        break;
                    case 'c':
                        shape.center();
                        break;
                    case 'm':
                        if(shape instanceof Connector)
                            shapes.push(...shape.mirror());
                        else shapes.push(shape.mirror());
                        break;
                    case 't':
                        shapes.forEach(s=>{
                            const mx = mouseX - mleft-xtrans;
                            const my = mouseY - mtop;
                            if(s.selected){s.translateTo(mx,my)}
                        })
                        break;
                    default:
                        break;
                }
            }
        })
    }else if(!plannerBoxFlag&&(key=='o')){
        switch (key) {
            case 'o':
                resetToDefaultView();
                break;
        
            default:
                break;
        }
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
    if(!infoBoxFlag && plannerBoxFlag){
        if(mouseX > 0 && mouseX < width &&mouseY>0 && mouseY<height){
            shapes.forEach(shape => {
                shape.unSelect();
            });
            scrollbar.selected =false;
            let makeNew = false;
            let oneClicked = false; 
            /*demoShapes.forEach(shape =>{
                if(shape.isInOuterBoundary(mouseX,mouseY)){
                    if(shape.t=='rect'){
                        add_z_save();
                        //console.log('make new rectangle')
                        if(lastClick.show){
                            shapes.push(new Rectangle(lastClick.x,lastClick.y, 50,50))
                        }
                        else {
                            shapes.push(new Rectangle(50,50, 50,50))
                        }
                    }
                    if(shape.t=='circle'){
                        add_z_save();
                        //console.log('make new circle')
                        if(lastClick.show){
                            shapes.push(new Circle(lastClick.x,lastClick.y, 50))
                        }
                        else {
                            shapes.push(new Circle(50,50, 50))
                        }
                    }
                    if(shape.t=='vslot'){
                        add_z_save();
                        //console.log('make new v_slot')
                        if(lastClick.show){
                            shapes.push(new Vertical_Slot(lastClick.x,lastClick.y, 50,50))
                        }
                        else shapes.push(new Vertical_Slot(50,50,50,50))
                    }
                    if(shape.t=='hslot'){
                        add_z_save();
                        //console.log('make new h_slot')
                        if(lastClick.show){
                            shapes.push(new Horizontal_Slot(lastClick.x,lastClick.y, 50,50))
                        }
                        else shapes.push(new Horizontal_Slot(50,50,50,50))
                    }
                    oneClicked = true;
                }
            }) */
            lastClick.show = false;
            shapes.some(shape => {
                const mx = mouseX - mleft-xtrans;
                const my = mouseY - mtop;
                if(!oneClicked&&shape.isInOuterBoundary(mx,my)){
                    add_z_save();
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

            if(scrollbar.isInArrowBoxes(mouseX, mouseY))scrollbar.clickArrowBoxes(mouseX, mouseY);

            else if(mouseY>height-mbot){
                if(scrollbar.isInOuterBoundary(mouseX,mouseY)){
                    scrollbar.selected = true;
                    oneClicked = true; 
                }
            }
            /** Red pointer select */
            else if(!oneClicked){
                lastClick.x = mouseX - mleft - xtrans;
                lastClick.y = mouseY - mtop;
                lastClick.show = true;
            }
        }
    }
}
function mouseReleased(){
    scrollbar.selected = false;
    shapes.forEach(s=>s.snapToGrid())
    
}
function mouseDragged() {
    if(!infoBoxFlag && plannerBoxFlag){
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

}
function mouseWheel(event){
    if(!hidden&&plannerBoxFlag){
        if(mouseX>0&&mouseX<width&&mouseY>0&&mouseY<height)
            if(event.delta>0)for(let i=0;i<3;i++)scrollbar.moveLeft()
            else for(let i=0;i<3;i++)scrollbar.moveRight()
            return false;
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
    switch(hole.t){
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
        case 'vslot':
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
        case 'hslot':
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
        case 'boitier':
        case 'barrel_qlatch':
        case 'barrel_screw_qlatch':
        case 'barrel':
        case 'barrel_screw':
            if(hole.arrowIndex==0){
                x = hole.tx - hole.w/2;
                y = hole.y - hole.h/2;
            }
            if(hole.arrowIndex==1){
                x = hole.tx - hole.w/2;
                y = hole.y + hole.h/2;
            }
            if(hole.arrowIndex==2){
                x = hole.tx + hole.w/2;
                y = hole.y + hole.h/2;
            }
            if(hole.arrowIndex==3){
                x = hole.tx + hole.w/2;
                y = hole.y - hole.h/2;
            }
            break;
        default: 
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
    holeExport();  
}

// document.getElementById('importholes').onclick = ()=>{
//     holeImport();
// }


function selectHole(hole){
    if(hole.t=='vslot'||hole.t=='hslot'||hole.t=='rect'||hole.t=='circle'){

        document.getElementById('h_angle').value = (hole.x*toDeg).toFixed();    
        document.getElementById('h_height').value = (hole.h*toInch).toFixed(3);    
        document.getElementById('h_width').value = (hole.w*toInch).toFixed(3);    
        document.getElementById('h_offset').value = (hole.y*toInch).toFixed(3); 

        document.getElementById('c_angle').value = '';    
        document.getElementById('c_offset').value = ''; 
        document.getElementById('c_type').value = ''; 
        if(hole.rotation!=null)document.getElementById('c_rotation').value ='';
    }else{
        document.getElementById('c_angle').value = (hole.x*toDeg).toFixed();    
        document.getElementById('c_offset').value = (hole.y*toInch).toFixed(3); 
        document.getElementById('c_type').value = hole.t; 
        if(hole.rotation!=null)document.getElementById('c_rotation').value = Math.round(hole.rotation*360/(2*PI));

        document.getElementById('h_angle').value = '';    
        document.getElementById('h_height').value ='';    
        document.getElementById('h_width').value ='';    
        document.getElementById('h_offset').value = ''; 
    }
}  
/** This is the automatic changing of Terminals according to the entry in the table */
document.getElementById('c_type').onchange =()=>changeConnector();
document.getElementById('c_rotation').onchange =()=>changeConnector();
document.getElementById('c_angle').onchange =()=>changeConnector();
document.getElementById('c_offset').onchange =()=>changeConnector();
function changeConnector(){
    shapes.forEach(hole=>{
        if(hole.selected){
            if(hole.t!='vslot'||hole.t!='hslot'||hole.t!='rect'||hole.t!='circle'){ 
                let x = 1/toDeg* document.getElementById('c_angle').value;
                let y = 1/toInch* document.getElementById('c_offset').value;
                let rotation = document.getElementById('c_rotation').value *2*PI/360;
                let type = document.getElementById('c_type').value;
                if(type!='boitier'){
                    hole.h = 0.7 / (lrwidth * inchPerUnit) * pheight;
                    hole.w = 0.7 / (lrlength * inchPerUnit) * pwidth;
                }else{
                    hole.h = 1.5 / (lrwidth * inchPerUnit) * pheight;
                    hole.w = 1.5 / (lrlength * inchPerUnit) * pwidth;
                }
                hole.updateValues(x,y,undefined,undefined,rotation,type);
            }
        }
    })
}

/** This is the automatic changing of Holes according to the entry in the table */
document.getElementById('h_angle').onchange =()=>changeHole();
document.getElementById('h_height').onchange =()=>changeHole();
document.getElementById('h_width').onchange =()=>changeHole();
document.getElementById('h_offset').onchange =()=>changeHole();
function changeHole(){
    shapes.forEach(hole=>{
        if(hole.selected){
            let x = 1/toDeg* document.getElementById('h_angle').value;
            let h = 1/toInch* document.getElementById('h_height').value;
            let w = 1/toInch*document.getElementById('h_width').value;
            let y = 1/toInch* document.getElementById('h_offset').value;
            hole.updateValues(x,y,w,h);
        }
    })
}

document.getElementById('tasksave').onclick = ()  =>{holeExport();}
document.getElementById('taskcircle').onclick = ()=>{addhole('circle')}
document.getElementById('taskrect').onclick = ()  =>{addhole('rect')}
document.getElementById('taskvslot').onclick = ()  =>{addhole('vslot')}
document.getElementById('taskhslot').onclick = ()  =>{addhole('hslot')}
document.getElementById('taskterminal').onclick = ()  =>{addhole('terminal')}
document.getElementById('taskmirror').onclick = ()  =>{itemKeyOperation('m')}
document.getElementById('taskcenter').onclick = ()  =>{itemKeyOperation('c')}


function addhole(type){
    if(lastClick.show){
        add_z_save();
        let t;
        switch (type) {
            case 'circle':
                t = new Circle(lastClick.x,lastClick.y, 50)
                break;
            case 'rect':
                t = new Rectangle(lastClick.x,lastClick.y, 50,50)
                break;
            case 'vslot':
                t = new Vertical_Slot(lastClick.x,lastClick.y, 50,50)
                break;
            case 'hslot':
                t = new Horizontal_Slot(lastClick.x,lastClick.y, 50,50)
                break;
            case 'terminal':
                t = new Terminal(lastClick.x,lastClick.y)
                break;
            default:
                break;
        }
        t.selected = true;
        shapes.push(t);
        selectHole(t)
        lastClick.show = false
    }

}
function itemImport(){
    let con = loadedRing.connectors
    let ter = loadedRing.terminals
    con.forEach(c=>{
        let pos = rad_to_XY_pixels(c.angle, -c.offset);
        shapes.push(new Connector(pos.x, pos.y, c.flipped,c.t,undefined,c.id))
    })
    ter.forEach(t=>{
        let pos= rad_to_XY_pixels(t.angle, -t.offset);
        shapes.push(new Terminal(pos.x, pos.y, t.flipped,t.t,2*PI-t.rotation))
    })
    attachConnectors();
}

function attachConnectors(){
    shapes.forEach(s=>{
        let id=0;
        if(s.t=='barrel')id = s.id;
        shapes.forEach(other=>{
            if(other.t=='barrel_screw'&&other.id==id){
                other.appendCon(s);
                s.appendCon(other);
            }
        })
        if(s.t=='barrel_qlatch')id = s.id;
        shapes.forEach(other=>{
            if(other.t=='barrel_screw_qlatch'&&other.id==id){
                other.appendCon(s);
                s.appendCon(other);
            }
        })
    })        
}
function holeExport(){
    const DECI = 1000;
    let holes = [];
    let tring = loadedRing;
    tring.terminals = [];
    tring.connectors = [];
    shapes.forEach(shape => {
        const yoff = Math.round((lrwidth/2-shape.y/pheight*lrwidth )*DECI)/DECI;
        if(shape.t === 'circle'){
            holes.push({
                r: shape.w/2/(pheight)*(lrwidth),
                offset:yoff,
                angle: shape.x*toRad,
                t: shape.t,
            })
        }
        else if(shape.t === 'rect'){
            holes.push({
                r: {w:shape.w/2/(pheight)*(lrwidth), h:shape.h/2/(pheight)*(lrwidth)},
                offset:yoff,
                angle: shape.x*toRad,
                t: shape.t,
            })
        }
        else if(shape.t === 'vslot'){
            randID = (Math.random()*10000).toFixed(0);
            holes.push({
                r: {w:shape.w/2/(pheight)*(lrwidth), h:shape.h/2/(pheight)*(lrwidth)},
                offset:yoff,
                angle: shape.x*toRad,
                t: 'rect',
                id:'vslot'+randID
            })
            holes.push({
                r: shape.w/2/(pheight)*(lrwidth),
                offset:Math.round((lrwidth/2-(shape.y+shape.h/2)/pheight*lrwidth)*DECI)/DECI,
                angle: shape.x*toRad,

                t: 'circle',
                id:'vslot'+randID
            })
            holes.push({
                r: shape.w/2/(pheight)*(lrwidth),
                offset:Math.round((lrwidth/2-(shape.y-shape.h/2)/pheight*lrwidth)*DECI)/DECI,
                angle: shape.x*toRad,
                t: 'circle',
                id:'vslot'+randID
            })
        }
        else if(shape.t === 'hslot'){
            randID = (Math.random()*10000).toFixed(0);
            holes.push({
                r: {w:shape.w/2/(pheight)*(lrwidth), h:shape.h/2/(pheight)*(lrwidth)},
                offset:yoff,
                angle: shape.x*toRad,
                t: 'rect',
                id:'hslot'+randID
            })
            holes.push({
                r: shape.h/2/(pheight)*(lrwidth),
                offset:yoff,
                angle: (shape.x+shape.w/2)*2*PI/pwidth,
                t: 'circle',
                id:'hslot'+randID
            })
            holes.push({
                r: shape.h/2/(pheight)*(lrwidth),
                offset:yoff,
                angle:(shape.x-shape.w/2)*2*PI/pwidth,
                t: 'circle',
                id:'hslot'+randID
            })
        }
        else if(shape.t=='barrel'||shape.t=='barrel_screw'||shape.t=='barrel_qlatch'||shape.t=='barrel_screw_qlatch'||shape.t=='penture'){ /* if its a connector */
            tring.connectors.push({
                angle: shape.x*toRad,
                flipped: shape.flipped,
                offset:yoff,
                t:shape.t,
                id:shape.id,
            })
        }
        else if(true){ /* if its a terminal */
            tring.terminals.push({
                angle: shape.x*toRad,
                offset:yoff,
                t:shape.t,
                rotation:2*PI-shape.rotation,
            })
        }
    })
    localStorage.setItem('ring', JSON.stringify(tring));
    localStorage.setItem('holes', JSON.stringify(holes));
    loadRingFromDrawing();
}
function holeImport(){
    let holes = loadedRing.holes;
    shapes = [];
    holes.forEach(hole =>{
        const pos = rad_to_XY_pixels(hole.angle, -hole.offset);

        if(hole.id==undefined){
            if(hole.t=='circle'){
                shapes.push(new Circle(pos.x, pos.y, 
                hole.r*2/lrwidth*pheight))
            }
            if(hole.t=='rect'){
                shapes.push(new Rectangle(pos.x, pos.y, 
                    hole.r.w*2/lrwidth*pheight,
                    hole.r.h*2/lrwidth*pheight)); 
            }
        }
        else if(hole.id.charAt(0)=='v'&&hole.t=='rect'){
            shapes.push(new Vertical_Slot(pos.x, pos.y, 
                hole.r.w*2/lrwidth*pheight,
                hole.r.h*2/lrwidth*pheight)); 
        }
        else if(hole.id.charAt(0)=='h'&&hole.t=='rect'){
            shapes.push(new Horizontal_Slot(pos.x, pos.y, 
                hole.r.w*2/lrwidth*pheight,
                hole.r.h*2/lrwidth*pheight)); 
        }
    })
}

function rad_to_XY_pixels(angle,offset){
    let xp = angle/(2*PI)*pwidth;
    let yp = (lrwidth/2+offset)/lrwidth*pheight;

    if(xp<0)xp = pwidth + xp;
    return {x:xp, y:yp};
}

function deg_to_XY_pixels(angle,offset){
    let xp = angle/360*pwidth;
    let yp = (lrwidth/2+offset)/lrwidth*pheight;

    if(xp<0)xp = pwidth + xp;
    return {x:xp, y:yp};
}

function add_z_save(obj = shapes){
    if(!hidden){
        let things = []
        things =  JSON.parse(localStorage.getItem('shapesZ'));
        if(things==null)things = []
        clear_begining_of_array(things, 20);
        
        let temp = [];
        obj.forEach(shape =>{
            if(shape.t=='barrel'||shape.t=='barrel_screw'||shape.t=='barrel_qlatch'||shape.t=='barrel_screw_qlatch'||shape.t=='hinge'){ /* if its a connector */
                temp.push({
                    x: shape.x,
                    flipped: shape.flipped,
                    y:shape.y,
                    t:shape.t,
                    id:shape.id,
                    t:shape.t
                })
            }
            else if(shape.t == 'vslot'||shape.t == 'hslot'||shape.t == 'rect'){
                temp.push({
                    x: shape.x,
                    y:shape.y,
                    w: shape.w,
                    h:shape.h,
                    t:shape.t
                })
            }
            else if(shape.t == 'circle'){
                temp.push({
                    x: shape.x,
                    y:shape.y,
                    d: shape.d,
                    t:shape.t
                })
            }
            else if(true){ /* if its a terminal */
                temp.push({
                    x: shape.x,
                    y:shape.y,
                    flipped: shape.flipped,
                    t:shape.t,
                    rotation:shape.rotation,
                })
            }
        })
        console.log(things)
        things.push(temp)
        localStorage.setItem('shapesZ', JSON.stringify(things))
    }
}
function get_z_save(){
    
    let temp = JSON.parse(localStorage.getItem('shapesZ'))
    if(temp.length>0){
        shapes = [];
        let restore = temp.pop();
        restore.forEach(c=>{
            if(c.t=='circle')shapes.push(new Circle(c.x, c.y, c.d))
            else if(c.t=='rect')shapes.push(new Rectangle(c.x, c.y, c.w, c.h))
            else if(c.t=='vslot')shapes.push(new Vertical_Slot(c.x, c.y, c.w, c.h))
            else if(c.t=='hslot')shapes.push(new Horizontal_Slot(c.x, c.y, c.w, c.h))
            else if(c.t=='barrel'||c.t=='barrel_screw'||c.t=='barrel_qlatch'||c.t=='barrel_screw_qlatch')shapes.push(new Connector(c.x, c.y, c.flipped,c.t,undefined,c.id))
            else shapes.push(new Terminal(c.x, c.y, c.flipped,c.t,c.rotation))
        })
        console.log(temp)
        localStorage.setItem('shapesZ', JSON.stringify(temp));
        attachConnectors();
    }
}
/**
 * Cleans up the beginning of the array by clearing it. 
 * @param {*} array     The array to clear
 * @param {*} maxLength The maximal length of the array
 * @returns The changed array
 */
function clear_begining_of_array(array,maxLength = 25){
    let tpv = true; 
    while(tpv){
        if(array.length>maxLength)array.shift()
        else tpv = false;
    }
    return array
}
function clearSelect(){
    shapes.forEach(s=>{
        s.selected = false;
    })
}