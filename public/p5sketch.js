let mode = '';
let p5canvas;
const loadedRing = JSON.parse(localStorage.getItem('ring'));
const lrwidth = loadedRing.width;
const lrlength = loadedRing.radius * 2 * Math.PI;
const aspectRatio = lrwidth / lrlength;


const canvasWidth = window.innerWidth*0.75; 
const canvasHeight = canvasWidth*aspectRatio+100;
let mtop = 20;
let mleft = 0;
let mright = 0;
let mbot = 0;
let pwidth = canvasWidth-mleft; 
let pheight = canvasHeight - mtop;
let pHeightConversionUnit = 2;
let pUnitType = 'inch';
let pRadius = 1; 

let seeAll = false; 
const STARTHIDDEN = true;
let hidden = STARTHIDDEN;

shapes = [];

function setup() {
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.parent('p5holder');

    const rect = new Rectangle(100, 100);
    shapes.push(rect);
    const circle = new Circle(100, 100);
    shapes.push(circle);
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
    rect(0, 0, width, mtop);
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
    /* to be implemented */
    shapes.push(new Circle(width/2, height/2, 50));
}

function mousePressed() {
    shapes.forEach(shape => {
        shape.unSelect();
    });
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

function mouseDragged() {
    shapes.forEach(shape => {
        const mx = this.mouseX - mleft;
        const my = this.mouseY - mtop;
        if (shape.selected) {
            shape.dragged(mx,my);
        }
    });
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
            const dx = Math.abs(this.x - mx);
            const dy = Math.abs(this.y - my); 
            if(dx>dy)
                this.w = 2*dx;
            else
                this.h = 2*dy;
            if(dx>this.w/2)this.w = 2*dx;
            if(dy>this.h/2)this.h = 2*dy
            if(this.type ==='circle')this.h = this.w;
        }
    }
    unSelect(){
        this.selected = false; 
        this.color = 255;
    }

}
class Rectangle extends Shape {
    constructor(x, y) {
        super(x, y);
        this.type = 'rect';
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
            let a = w/pwidth*lrlength*inchPerUnit;
            //console.log(a);
            let b = h/pheight*lrwidth*inchPerUnit;
            //console.log(b);
            drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a );
            drawArrow(this.x + w / 2 + 15, this.y, h, 10, false, b);
            textSize(16);
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

            line(this.x, this.y + (w / 2), this.x + w / 2 + 20, this.y + (w / 2));
            line(this.x, this.y - (w / 2), this.x + w / 2 + 20, this.y - (w / 2));
            drawArrow(this.x + w / 2 + 15, this.y, w, 10, false, w/pheight*loadedRing.width*inchPerUnit);

            textSize(16);
            if(this.x>0.7*pwidth)textAlign(RIGHT, TOP);
            else textAlign(LEFT, TOP);
            text((this.x*360/pwidth).toFixed(1) + '°', this.x + 5, 0);
        }
    }
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
    textSize(12);
    textAlign(CENTER, CENTER);
    if(typeof txt == 'number')
    text(txt.toFixed(3) + '"', x, y);
    else console.log(txt)
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
        shapes.push(new Circle(hole.angle/(2*PI)*pwidth, 
        (lrwidth/2+hole.offset)/lrwidth*pheight, 
        hole.r*2/lrwidth*pheight))
    })
}

    