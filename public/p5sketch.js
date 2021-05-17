let mode = '';

const SELECTCOLOR = 125;
const SELECTRESIZE = 200;
const SELECTPADDING = 2 / 5;
shapes = [];

function setup() {
    createCanvas(400, 400);
    const rect = new Rectangle(100, 100);
    shapes.push(rect);
    const circle = new Circle(100, 100);
    shapes.push(circle);
}

function draw() {
    background(220);
    fill(255);
    for (let i = shapes.length - 1; i >= 0; i--) {
        shapes[i].draw();
    }
}


function doubleClicked() {
    console.log('double click');
    let clicked = false;
    for (let i = 0 ; i < shapes.length; i++) {
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

function mousePressed() {

    shapes.forEach(shape => {
        shape.selected = false;
        shape.rectFill(255);
    });

    shapes.some(shape => {
        if (mouseX <= shape.x + SELECTPADDING * abs(shape.w) &&
            mouseX >= shape.x - SELECTPADDING * abs(shape.w) &&
            mouseY <= shape.y + SELECTPADDING * abs(shape.h) &&
            mouseY >= shape.y - SELECTPADDING * abs(shape.h)) {
            shape.rectFill(SELECTCOLOR);
            mode = 'move'
            shape.selected = true;
            return true;
        } else if (mouseX <= shape.x + SELECTPADDING * 1.5 * abs(shape.w) && //lower than +4/5
            mouseX >= shape.x - SELECTPADDING * 1.5 * abs(shape.w) && //higher than +2/5
            mouseY <= shape.y + SELECTPADDING * 1.5 * abs(shape.h) &&
            mouseY >= shape.y - SELECTPADDING * 1.5 * abs(shape.h)) {
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
        if (shape.selected) {
            if (mode === 'move') {
                shape.x = this.mouseX;
                shape.y = this.mouseY;
            }
            if (mode === 'resize') {
                if (shape.type == 'circle') shape.w = (mouseX - shape.x) *2;
                else {
                    if (abs((mouseX - shape.x) / shape.w) >= abs((mouseY - shape.y) / shape.h))
                        shape.w = (mouseX - shape.x) * 2;
                    else shape.h = (mouseY - shape.y) * 2;
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
    }
}