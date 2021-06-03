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
let canvasHeight = canvasWidth*aspectRatio+100;
let mtop = 20;
let mleft = 0;
let mright = 0;
let mbot = 0;
let pwidth = canvasWidth-mleft; 
let pheight = canvasHeight - mtop;
let pHeightConversionUnit = 2;
let pUnitType = 'inch';
let pRadius = 1; 

const toInch = 1/pheight*lrwidth*inchPerUnit;
const toDeg = 360/pwidth;

let seeAll = false; 
const STARTHIDDEN = true;
let hidden = STARTHIDDEN;

shapes = [];
demoShapes = [];

function setup() {
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.parent('p5holder');

    demoShapes.push(new DemoRectangle(10, 10, 15,15));
    demoShapes.push(new DemoCircle(30, 10, 15));
    demoShapes.push(new DemoVertical_Slot(50, 10, 15,10));
    demoShapes.push(new DemoHorizontal_Slot(80, 10, 15,10));
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
    push();
    translate(mleft, mtop);
    background(220);
    fill(255);
    stroke(1);
    for (let i = shapes.length - 1; i >= 0; i--) {
        shapes[i].draw();
    }
    pop();
    noStroke();
    fill(100)
    rect(width/2, mtop/2, width, mtop);
    rect(0, 0, mleft, height);
    let runloop = true;
    shapes.forEach(shape =>{
        if(runloop){
            if(shape.isInOuterBoundary(mouseX-mleft, mouseY-mtop))
                if(shape.isInInnerBoundary(mouseX-mleft, mouseY-mtop)){
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

    demoShapes.forEach(shape =>{
        shape.draw();
    })
    calculatePower();
    
}

function calculatePower(){
    let arcLength = lrlength*INCH_PER_UNIT*(lr.gaps[0].end-lr.gaps[0].begin)/(2*PI);
    let u = (lrlength*INCH_PER_UNIT)-arcLength;
    let k;
    if(lr.width*INCH_PER_UNIT < 2)k = (u - 0.8) * (lr.width*INCH_PER_UNIT- 0.36)
    if(lr.width*INCH_PER_UNIT >= 2)k = (u - 0.8) * (lr.width*INCH_PER_UNIT- 0.72)
    let holeArea = 0; 
    shapes.forEach((shape)=>{
        holeArea += shape.getArea() + (1*0.5);
    })
    const area = k - holeArea; 
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
    if (keyCode === BACKSPACE || keyCode === DELETE) shapes.forEach((shape) => {
        if (shape.selected) {
            const ind = shapes.indexOf(shape);
            shapes.splice(ind, 1);
        }
    })
    itemKeyOperation(key);
}

function itemKeyOperation(key) {
    if (key == 'w' || key == 'a' || key == 's' || key == 'd' || key == 'e' || key == 'q') {
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
            const mx = mouseX - mleft;
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
}
}

function mouseDragged() {
    if(mouseX > 0 && mouseX < width &&mouseY>0 && mouseY<height){
        shapes.forEach(shape => {
            const mx = this.mouseX - mleft;
            const my = this.mouseY - mtop;
            if (shape.selected) {
                shape.dragged(mx,my);
            }
        });
    }
}

class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.color = 255;
        this.selected = false;
        this.selectMode = '';
        this.type = '';
        this.SELECTMOVE = 125;
        this.SELECTRESIZE = 200;
        this.SELECTPADDING = 3/ 5;
        this.arrowIndex = 0; 
    }
    doubleClicked(){
        this.arrowIndex++;
        if(this.arrowIndex>3)this.arrowIndex = 0;
    }
    draw() {
    
    }
    rectFill(color) {
        this.color = color;
    }
    textSelected() {
    }
    isInOuterBoundary(mx, my){
        if(mx<this.x+this.w/2&&mx>this.x-this.w/2&&
            my<this.y+this.h/2&&my>this.y-this.h/2)return true;
        else return false;
    }
    select(mx, my){
        this.selected = true;
        selectHole(this);
        if(this.isInInnerBoundary(mx,my)){
            this.selectMode = 'move';
            this.color = this.SELECTMOVE;
        }
        else {
            this.selectMode = 'resize';
            this.color = this.SELECTRESIZE;
        }
    }
    isInInnerBoundary(mx, my){
        const xr = this.x+((this.w/2)*this.SELECTPADDING);
        const xl = this.x-((this.w/2)*this.SELECTPADDING);
        const yb = this.y+((this.h/2)*this.SELECTPADDING);
        const yt = this.y-((this.h/2)*this.SELECTPADDING);
        if((mx<xr&& mx>xl)&& (my<yb&& my>yt)){
                return true;
        }
        else {
            return false;
        }
    }
    dragged(mx, my){
        if(this.selectMode==='move'){
            this.x = mx;
            this.y = my;
        }
        if(this.selectMode==='resize'){
            cursor('pointer');
            let sl = this.x - this.w/2, sr = this.x+this.w/2,su = this.y-this.h/2,sd = this.y +this.h/2; 
            const dx = Math.abs(this.x - mx);
            const dy = Math.abs(this.y - my); 
            if (this.type === 'circle'||centerResize==true){
                if(dx>dy){
                    
                    this.w = 2*dx;
                }
                else{
                    this.h = 2*dy;
                }
                if(dx>this.w/2)this.w = 2*dx;
                if(dy>this.h/2)this.h = 2*dy;
                if(this.type ==='circle')this.h = this.w;
            }
            else{
                if(dx>dy){
                    if(mx>this.x){
                        this.x = (sl+(this.x+dx))/2;
                        this.w = mx - sl;
                    }
                    else{
                        this.x = (sr+(this.x-dx))/2;
                        this.w = sr - mx;
                    }
                }
                else{
                    if(my>this.y){
                        this.y = (su+(this.y+dy))/2;
                        this.h = my - su;
                    }
                    else{
                        this.y = (sd+(this.y-dy))/2;
                        this.h = sd - my;
                    }
                }
            }
            
        }selectHole(this);
    }
    unSelect(){
        this.selected = false; 
        this.color = 255;
    }
    getArea(){
        return (this.w*toInch)*(this.h*toInch);   
    }
}
class Rectangle extends Shape {
    constructor(x, y, w, h) {
        super(x, y);
        this.type = 'rect';
        this.w = w;
        this.h = h;
    }
    draw() {
        rectMode(CENTER);
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
        this.textSelected();
    }
    textSelected() {
        if (this.selected||seeAll) {
            fill(0);
            textSize(16);
            textAlign(LEFT, BOTTOM);
            const w = abs(this.w);
            const h = abs(this.h);
            const offsetVal = this.y/pheight*loadedRing.width*inchPerUnit;
            drawArrow(this.x, this.y / 2, this.y, 10, false, offsetVal)
            //text('x = ' + this.x + '\ny = ' + this.y, this.x, this.y)
            line(this.x + (w / 2), this.y, this.x + (w / 2), this.y + h / 2 + 20);
            line(this.x - (w / 2), this.y, this.x - (w / 2), this.y + h / 2 + 20);
            line(this.x, this.y + (h / 2), this.x + w / 2 + 20, this.y + (h / 2));
            line(this.x, this.y - (h / 2), this.x + w / 2 + 20, this.y - (h / 2));
            let a = w/pheight*lrwidth*inchPerUnit;
            //console.log(a);
            let b = h/pheight*lrwidth*inchPerUnit;
            //console.log(b);
            drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a);
            drawArrow(this.x + w / 2 + 15, this.y, h, 10, false, b);
            textSize(TEXTSIZE);
            if(this.x>0.7*pwidth)textAlign(RIGHT, TOP);
            else textAlign(LEFT, TOP);
            text((this.x*360/pwidth).toFixed(1) + '°', this.x + 5, 0);
        }
    }

    
}

class Circle extends Shape {
    constructor(x, y, d = 50) {
        super(x, y);
        this.type = 'circle';
        this.w = d;
        this.h = d;
    }
    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.w, this.w);
        this.textSelected();
    }

    textSelected() {
        if (this.selected||seeAll) {
            fill(0);
            const w = abs(this.w);

            /* Top down arrow, insert the inch offset here */
            const offsetVal = this.y/pheight*loadedRing.width*inchPerUnit;
            drawArrow(this.x, this.y / 2, this.y, 10, false, offsetVal)

            //line(this.x, this.y + (w / 2), this.x + w / 2 + 20, this.y + (w / 2));
            //line(this.x, this.y - (w / 2), this.x + w / 2 + 20, this.y - (w / 2));
            //drawArrow(this.x + w / 2 + 15, this.y, w, 10, false, w/pheight*loadedRing.width*inchPerUnit);
            pointArrow(this, 'Ø'+(w*toInch).toFixed(3));

            textSize(TEXTSIZE);
            if(this.x>0.7*pwidth)textAlign(RIGHT, TOP);
            else textAlign(LEFT, TOP);
            text((this.x*360/pwidth).toFixed(1) + '°', this.x + 5, 0);
        }
    }
}
class Vertical_Slot extends Rectangle{
    constructor(x,y,w,h){
        super(x,y,w,h);
        this.type = 'v_slot';
    }
    draw(){
        push();
        fill(this.color);
        arc(this.x, this.y-this.h/2, this.w, this.w, PI, 0);
        arc(this.x, this.y+this.h/2, this.w, this.w, 0, PI);
        rectMode(CENTER);
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
        this.textSelected();
        pop();
    }
    textSelected() {
        if (this.selected||seeAll) {
            fill(0);
            textSize(16);
            textAlign(LEFT, BOTTOM);
            const w = abs(this.w);
            const h = abs(this.h);
            const offsetVal = this.y/pheight*loadedRing.width*inchPerUnit;
            drawArrow(this.x, this.y / 2, this.y, 10, false, offsetVal)
            line(this.x, this.y + (h / 2), this.x + w / 2 + 20, this.y + (h / 2));
            line(this.x, this.y - (h / 2), this.x + w / 2 + 20, this.y - (h / 2));
            let a = w/pheight*lrwidth*inchPerUnit;
            let b = h/pheight*lrwidth*inchPerUnit;
            //drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a);
            pointArrow(this, 'R'+(w/2/pheight*loadedRing.width*inchPerUnit).toFixed(3))
            drawArrow(this.x + w / 2 + 15, this.y, h, 10, false, b);
            textSize(TEXTSIZE);
            if(this.x>0.7*pwidth)textAlign(RIGHT, TOP);
            else textAlign(LEFT, TOP);
            text((this.x*360/pwidth).toFixed(1) + '°', this.x + 5, 0);
        }
    }
    getArea(){
        return (this.w*toInch)*((this.h+this.w)*toInch);   
    }
}
class Horizontal_Slot extends Rectangle{
    constructor(x,y,w,h){
        super(x,y,w,h);
        this.type = 'h_slot';
    }
    draw(){
        push();
        fill(this.color);
        arc(this.x-this.w/2, this.y, this.h, this.h, PI/2, -PI/2);
        arc(this.x+this.w/2, this.y, this.h, this.h, -PI/2, PI/2);
        rectMode(CENTER);
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
        this.textSelected();
        pop();
    }
    textSelected() {
        if (this.selected||seeAll) {
            fill(0);
            textSize(16);
            textAlign(LEFT, BOTTOM);
            const w = abs(this.w);
            const h = abs(this.h);
            const offsetVal = this.y/pheight*loadedRing.width*inchPerUnit;
            drawArrow(this.x, this.y / 2, this.y, 10, false, offsetVal)
            line(this.x + (w / 2), this.y, this.x + (w / 2), this.y + h / 2 + 20);
            line(this.x - (w / 2), this.y, this.x - (w / 2), this.y + h / 2 + 20);
            let a = w/pheight*lrwidth*inchPerUnit;
            //let b = h/pheight*lrwidth*inchPerUnit;
            //drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a);
            pointArrow(this, 'R'+(h/2*toInch).toFixed(3))
            drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a);
            textSize(TEXTSIZE);
            if(this.x>0.7*pwidth)textAlign(RIGHT, TOP);
            else textAlign(LEFT, TOP);
            text((this.x*360/pwidth).toFixed(1) + '°', this.x + 5, 0);
        }
    }
    getArea(){
        return (this.h*toInch)*((this.h+this.w)*toInch);   
    }
    
}
class DemoRectangle extends Rectangle{
    constructor(x,y,w,h){
        super(x,y,w,h);
    }
    dragged(){}
    textSelected(){}
}
class DemoCircle extends Circle{
    constructor(x,y,r){
        super(x,y,r);
    }
    dragged(){}
    textSelected(){}
}
class DemoVertical_Slot extends Vertical_Slot{
    constructor(x,y,w,h){
        super(x,y,w,h);
    }
    dragged(){}
    textSelected(){}
}
class DemoHorizontal_Slot extends Horizontal_Slot{
    constructor(x,y,w,h){
        super(x,y,w,h);
    }
    dragged(){}
    textSelected(){}
}


function drawArrow(x, y, l, w, horizontal = true, txt = '') {
    if (l < 0) l = l * -1;
    if (w < 0) w = w * -1;
    const spacing = txt.toFixed(3).toString().length * 5;

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
    text(txt.toFixed(3) + '"', x, y);
    else console.log(txt)
}
const _UPLEFT = {p1:{x:-30, y:-20},p2:{x:-35, y:-20},align:'right'}
const _DOWNLEFT = {p1:{x:-30, y:20},p2:{x:-35, y:20},align:'right'}
const _UPRIGHT = {p1:{x:30, y:-20},p2:{x:35, y:-20}, align:'left'}
const _DOWNRIGHT = {p1:{x:30, y:20},p2:{x:35, y:20}, align:'left'}
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
                angle: (shape.x+shape.w/3)*2*PI/pwidth,
                type: 'circle',
                id:'h_slot'+randID
            })
            holes.push({
                r: shape.h/2/(pheight)*(lrwidth),
                offset:shape.y/pheight*lrwidth- lrwidth/2,
                angle: (shape.x-shape.w/3)*2*PI/pwidth,
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