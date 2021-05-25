let mode = '';
let p5canvas;
const canvasWidth = 800; 
const canvasHeight = 400;
const SELECTCOLOR = 125;
const SELECTRESIZE = 200;
const SELECTPADDING = 2 / 5;
let mtop = 50;
let mleft = 100;
let mright = 50;
let mbot = 50;
let pwidth = canvasWidth-mleft; 
let pheight = canvasHeight - mtop;
let pHeightConversionUnit = 2;
let pUnitType = 'inch';
let pRadius = 1; 

let seeAll = false; 

shapes = [];

function setup() {
    p5canvas = createCanvas(canvasWidth, canvasHeight);
    p5canvas.style('position', 'fixed');
    p5canvas.style('left', '100px');
    p5canvas.style('top', '100px');
    const rect = new Rectangle(100, 100);
    shapes.push(rect);
    const circle = new Circle(100, 100);
    shapes.push(circle);
    //Here we toggle the drawing thing
    document.getElementById('drawing').onclick = () => {
        if (Math.random() < 0.5) {
            p5canvas.hide();
            console.log('the canvas got spooked away')
        } else {
            p5canvas.show();
            console.log('guess whoss back baby')
        }
    };
    document.getElementById('selectall').onclick = () => seeAll = !seeAll; 
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
    if (mouseX > 0 && mouseX < window.width && mouseY > 0 && mouseY < window.height) {
        console.log('double click');
        let clicked = false;
        for (let i = 0; i < shapes.length; i++) {
            if (mouseX <= shapes[i].x + SELECTPADDING * abs(shapes[i].w) &&
                mouseX >= shapes[i].x - SELECTPADDING * abs(shapes[i].w) &&
                mouseY <= shapes[i].y + SELECTPADDING * abs(shapes[i].h) &&
                mouseY >= shapes[i].y - SELECTPADDING * abs(shapes[i].h)) {
                if (shapes[i].type == 'circle') {
                    shapes[i] = new Rectangle(shapes[i].x, shapes[i].y);
                    clicked = true;
                    break;
                } else if (shapes[i].type == 'rect') {
                    shapes[i] = new Circle(shapes[i].x, shapes[i].y);
                    clicked = true;
                    break;
                }
            }
        }
        if (!clicked) {
            shape = new Rectangle(mouseX, mouseY);
            shapes.push(shape);
        }
    }
}

function mousePressed() {

    shapes.forEach(shape => {
        shape.selected = false;
        shape.rectFill(255);
    });

    shapes.some(shape => {
        const mx = mouseX - mleft;
        const my = mouseY - mtop;
        if (mx <= shape.x + SELECTPADDING * abs(shape.w) &&
            mx >= shape.x - SELECTPADDING * abs(shape.w) &&
            my <= shape.y + SELECTPADDING * abs(shape.h) &&
            my >= shape.y - SELECTPADDING * abs(shape.h)) {
            shape.rectFill(SELECTCOLOR);
            mode = 'move'
            shape.selected = true;
            return true;
        } else if (mx <= shape.x + SELECTPADDING * 1.5 * abs(shape.w) && //lower than +4/5
            mx >= shape.x - SELECTPADDING * 1.5 * abs(shape.w) && //higher than +2/5
            my <= shape.y + SELECTPADDING * 1.5 * abs(shape.h) &&
            my >= shape.y - SELECTPADDING * 1.5 * abs(shape.h)) {
            shape.rectFill(SELECTRESIZE);
            mode = 'resize';
            shape.selected = true;
            return true;
        } else {
            shape.rectFill(255);
            mode = '';
            shape.selected = false;
        }
    });
}

function mouseDragged() {
    shapes.forEach(shape => {
        const mx = this.mouseX - mleft;
        const my = this.mouseY - mtop;
        if (shape.selected) {
            if (mode === 'move') {
                shape.x = mx;
                shape.y = my;
            }
            if (mode === 'resize') {
                if (shape.type == 'circle') shape.w = (mx - shape.x) * 2;
                else {
                    if (abs((mx - shape.x) / shape.w) >= abs((my - shape.y) / shape.h))
                        shape.w = (mx - shape.x) * 2;
                    else shape.h = (my - shape.y) * 2;
                }
            }
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
        this.type = '';
    }

    draw() {

    }

    rectFill(color) {
        this.color = color;
    }
    textSelected() {
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
            drawArrow(this.x, this.y / 2, this.y, 10, false, this.y)
            //text('x = ' + this.x + '\ny = ' + this.y, this.x, this.y)
            line(this.x + (w / 2), this.y, this.x + (w / 2), this.y + h / 2 + 20);
            line(this.x - (w / 2), this.y, this.x - (w / 2), this.y + h / 2 + 20);
            line(this.x, this.y + (h / 2), this.x + w / 2 + 20, this.y + (h / 2));
            line(this.x, this.y - (h / 2), this.x + w / 2 + 20, this.y - (h / 2));
            drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, w);
            drawArrow(this.x + w / 2 + 15, this.y, h, 10, false, h);
            textSize(16);
            if(this.x>0.7*pwidth)textAlign(RIGHT, TOP);
            else textAlign(LEFT, TOP);
            text((this.x*360/pwidth).toFixed(1) + '°', this.x + 5, 0);
        }
    }
}

class Circle extends Shape {
    constructor(x, y) {
        super(x, y);
        this.type = 'circle';
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
            //line(this.x, this.y, this.x, 0);
            drawArrow(this.x, this.y / 2, this.y, 10, false, this.y)

            line(this.x, this.y + (w / 2), this.x + w / 2 + 20, this.y + (w / 2));
            line(this.x, this.y - (w / 2), this.x + w / 2 + 20, this.y - (w / 2));
            drawArrow(this.x + w / 2 + 15, this.y, w, 10, false, w);

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
    const spacing = txt.toString().length * 5;

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
    text(txt + '"', x, y);
}