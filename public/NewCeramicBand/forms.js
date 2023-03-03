const exw = 3;
class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 50;
        this.color = 255;
        this.selected = false;
        this.selectMode = '';
        this.t = '';
        this.SELECTMOVE = 125;
        this.SELECTRESIZE = 200;
        this.SELECTPADDING = 3 / 5;
        this.arrowIndex = 0;
        this.isLocked = false;
        this.degPosY = pheight-10
    }
    doubleClicked() {
        this.arrowIndex++;
        if (this.arrowIndex > 3) this.arrowIndex = 0;
    }
    draw() {

    }
    drawLock(){
        if(this.isLocked){
            imageMode(CENTER);
            image(lock_img,this.x, this.y, 20, 20)
        }
    }
    translateTo(mx,my){
        this.x = mx;
        this.y = my;
    }
    rectFill(color) {
        this.color = color;
    }
    textSelected() {
        if (this.selected || seeAll) {
            push()
            fill(0)
            const x = this.x
            const y = this.y
            const w = this.w
            line(x,-10, x, pheight+10)
            line(x-w/2-15, y, x+w/2+15, y)
            pointArrow(this, this.t);
            degTxtFormat();
            text((this.x * 360 / pwidth).toFixed(0) + '°', this.x, this.degPosY);
            pop()
        }
    }
    isInOuterBoundary(mx, my) {
        if (mx < this.x + this.w / 2 && mx > this.x - this.w / 2 &&
            my < this.y + this.h / 2 && my > this.y - this.h / 2) return true;
        else return false;
    }
    select(mx, my) {
        this.selected = true;
        selectHole(this);
        if (this.isInInnerBoundary(mx, my)) {
            this.selectMode = 'move';
            this.color = this.SELECTMOVE;
        } else {
            this.selectMode = 'resize';
            this.color = this.SELECTRESIZE;
        }
    }
    isInInnerBoundary(mx, my) {
        const xr = this.x + ((this.w / 2) * this.SELECTPADDING);
        const xl = this.x - ((this.w / 2) * this.SELECTPADDING);
        const yb = this.y + ((this.h / 2) * this.SELECTPADDING);
        const yt = this.y - ((this.h / 2) * this.SELECTPADDING);
        if ((mx < xr && mx > xl) && (my < yb && my > yt)) {
            return true;
        } else {
            return false;
        }
    }
    dragged(mx, my) {
            if (this.selectMode === 'move') {
                this.x = mx;
                this.y = my;
            }
            if (this.selectMode === 'resize') {
                cursor('pointer');
                let sl = this.x - this.w / 2,
                sr = this.x + this.w / 2,
                su = this.y - this.h / 2,
                sd = this.y + this.h / 2;
                const dx = Math.abs(this.x - mx);
                const dy = Math.abs(this.y - my);
                if (this.t === 'circle' || centerResize == true) {
                    if (dx > dy) {
                        this.w = 2 * dx;
                        this.h = this.w;
                    } else {
                        this.h = 2 * dy;
                        this.w = this.h;
                    }
                    if (dx > this.w / 2) {
                        this.w = 2 * dx;
                        this.h = this.w;
                    }
                    if (dy > this.h / 2) {
                        this.h = 2 * dy;
                        this.w = this.h;
                    }
                    
                } else {
                    if (dx > dy) {
                        if (mx > this.x) {
                            this.x = (sl + (this.x + dx)) / 2;
                            this.w = mx - sl;
                        } else {
                            this.x = (sr + (this.x - dx)) / 2;
                            this.w = sr - mx;
                        }
                    } else {
                        if (my > this.y) {
                            this.y = (su + (this.y + dy)) / 2;
                            this.h = my - su;
                        } else {
                            this.y = (sd + (this.y - dy)) / 2;
                            this.h = sd - my;
                        }
                    }
                }
                
            
        }
        selectHole(this);
    }
    snapToGrid(){
        let roundingT = this.x*360/pwidth
        roundingT = Math.round(roundingT)
        this.x = roundingT/360*pwidth
    }
    unSelect() {
        this.selected = false;
        this.color = 255;
    }
    getArea() {
        return (this.w * toInch) * (this.h * toInch);
    }
    // isUnder(x, y) {
    //     if (x > this.x - this.w / 2 && x < this.x + this.w / 2 + 35 && this.y - this.h / 2 > y && (this.selected || seeAll)) return this.y - this.h / 2;
    //     return false;
    // }
    isOver(x,y){
        if(this.x+this.w/2+15>x&&this.x-this.w/2-15<x&&this.y<y&&(this.selected||seeAll))return {x:this.x, y:this.y}
        return false;
    }
    updateValues(x, y, w, h, rotation,type=undefined) {
        this.x = x;
        this.y = y;
        if(w!=undefined)this.w = w;
        if(h!=undefined)this.h = h;
        this.rotation = rotation;
        if(type!=undefined)this.t=type;
    }
    center(){
        this.y = pheight/2;
    }

    mirror(){
        let tx
        if(this.x < pwidth/2) tx = this.x+pwidth/2
        else tx = this.x-pwidth/2
        return  this.copySelf(tx)
        
    }
    copySelf(x){

    }
    lockPos(){
        this.isLocked = !this.isLocked;
    }
}
class Rectangle extends Shape {
    constructor(x, y, w, h) {
        super(x, y);
        this.t = 'rect';
        this.w = w;
        this.h = h;
    }
    draw() {
        rectMode(CENTER);
        fill(this.color);
        rect(this.x, this.y, this.w, this.h);
        if(this.isLocked)this.drawLock()
    }
    textSelected() {
        if (this.selected || seeAll) {
            fill(0);
            textSize(16);
            textAlign(LEFT, BOTTOM);
            const w = abs(this.w);
            const h = abs(this.h);
            let below = pheight;
            /* Top down arrow, insert the inch offset here */
            // shapes.forEach(shape => {
            //     let temp = shape.isOver(this.x + this.w / 2 + 15, this.y);
            //     if (temp != false && temp < below) below = temp;
            //     // if(below!= false)console.log(below)
            // })
            let overClear = true;
            shapes.forEach(s=>{
                const o = s.isOver(this.x+this.w/2+10, this.y);
                if(o===false);
                else{
                    overClear=false;
                     drawArrow(this.x+this.w/2+15, (this.y-o.y)/2+o.y-this.h/4, this.y-o.y-this.h/2, 15, false, (this.y-o.y)*toInch)
                }
            })
            if(overClear)drawArrow(this.x+this.w/2+15, (this.y-this.h/2)/2, this.y-this.h/2, 15, false, (this.y-this.h/2)*toInch)


            const offsetVal = (below - this.y - h / 2) / below * loadedRing.width * inchPerUnit;
            //drawArrow(this.x + this.w / 2 + 15, this.y + h / 2 + (below - this.y - h / 2) / 2, below - this.y - h / 2, 5, false, offsetVal)
            push()
            strokeWeight(1);
            stroke(50);
            line(this.x, -10, this.x, pheight + 10);
            pop();

            //text('x = ' + this.x + '\ny = ' + this.y, this.x, this.y)
            //line(this.x + (w / 2), this.y, this.x + (w / 2), -35);
            //line(this.x - (w / 2), this.y, this.x - (w / 2), -35);
            line(this.x, this.y + (h / 2), this.x + w / 2 + 20, this.y + (h / 2));
            line(this.x, this.y - (h / 2), this.x + w / 2 + 20, this.y - (h / 2));
            //console.log(a);
            let a = w / pheight * lrwidth * inchPerUnit;
            let b = h / pheight * lrwidth * inchPerUnit;
            //console.log(b);
            drawArrow(this.x, this.y+this.h/2+10, w, 10, true, a);
            drawArrow(this.x + w / 2 + 15, this.y, h, 10, false, b);
            degTxtFormat();
            text((this.x * 360 / pwidth).toFixed(0) + '°', this.x, this.degPosY);
        }
    }
    copySelf(x){
        return new Rectangle(x, this.y, this.w, this.h)   
    }
    isOver(x,y){
        if(this.x+this.w/2+15>x&&this.x-this.w/2-15<x&&this.y<y&&(this.selected||seeAll))return {x:this.x, y:this.y+this.h/2}
        return false;
    }

}
function degTxtFormat(){
    textSize(TEXTSIZEA);
    textAlign(CENTER, BOTTOM);
    fill(0)
    stroke(0)
    //strokeWeight(3)
    //textFont('Courier')
}
class Circle extends Shape {
    constructor(x, y, d = 50) {
        super(x, y);
        this.t = 'circle';
        this.w = d;
        this.h = d;
    }
    draw() {
        fill(this.color);
        ellipse(this.x, this.y, this.w, this.w);
        if(this.isLocked)this.drawLock()
    }

    textSelected() {
        if (this.selected || seeAll) {
            fill(0);
            const w = abs(this.w);
            let below = pheight;
            /* Top down arrow, insert the inch offset here */
            // shapes.forEach(shape => {
            //     let temp = shape.isOver(this.x + this.w / 2 + 15, this.y);
            //     if (temp != false && temp < below) below = temp;
            //     // if(below!= false)console.log(below)
            // })
            // const offsetVal = (below - this.y) / below * loadedRing.width * inchPerUnit;
            // drawArrow(this.x + this.w / 2 + 15, this.y + (below - this.y) / 2, below - this.y, 5, false, offsetVal)

            let overClear = true;
            shapes.forEach(s=>{
                const o = s.isOver(this.x+this.w/2+10, this.y);
                if(o===false);
                else{
                    overClear=false;
                     drawArrow(this.x+this.w/2+15, (this.y-o.y)/2+o.y, this.y-o.y, 15, false, (this.y-o.y)*toInch)
                }
            })
            if(overClear)drawArrow(this.x+this.w/2+15, (this.y)/2, this.y, 15, false, (this.y)*toInch)


            push()
            strokeWeight(1);
            stroke(50);
            line(this.x, -10, this.x, pheight + 10);
            line(this.x - this.w / 2 - 10, this.y, this.x + this.w / 2 + 20, this.y);
            pop();

            //line(this.x, this.y + (w / 2), this.x + w / 2 + 20, this.y + (w / 2));
            //line(this.x, this.y - (w / 2), this.x + w / 2 + 20, this.y - (w / 2));
            //drawArrow(this.x + w / 2 + 15, this.y, w, 10, false, w/pheight*loadedRing.width*inchPerUnit);
            pointArrow(this, 'Ø' + (w * toInch).toFixed(3));

            degTxtFormat();
            text((this.x * 360 / pwidth).toFixed(0) + '°', this.x, this.degPosY);
        }
    }
    isUnder(x, y) {
        if (x > this.x - this.w / 2 - 10 && x < this.x + this.w / 2 + 35 && this.y > y && (this.selected || seeAll)) return this.y;
        return false;
    }
    copySelf(x){
        return new Circle(x, this.y, this.w)   
    }
}
class Vertical_Slot extends Rectangle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.t = 'vslot';
    }
    draw() {
        push();
        rectMode(CENTER)
        noStroke();
        fill(0);
        rect(this.x, this.y, this.w, this.h);
        arc(this.x, this.y - this.h / 2, this.w + exw, this.w + exw, PI, 0);
        arc(this.x, this.y + this.h / 2, this.w + exw, this.w + exw, 0, PI);
        rect(this.x, this.y, this.w + exw, this.h + exw);
        stroke(this.color);
        fill(this.color);
        arc(this.x, this.y - this.h / 2, this.w, this.w, PI, 0);
        arc(this.x, this.y + this.h / 2, this.w, this.w, 0, PI);
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);

        if(this.isLocked)this.drawLock()
        pop();
    }
    textSelected() {
        if (this.selected || seeAll) {
            fill(0);
            textSize(16);
            textAlign(LEFT, BOTTOM);
            const w = abs(this.w);
            const h = abs(this.h);
            const offsetVal = (pheight - this.y - this.h / 2) / pheight * loadedRing.width * inchPerUnit;
            let overClear = true;
            shapes.forEach(s=>{
                const o = s.isOver(this.x+this.w/2+10, this.y);
                if(o===false);
                else{
                    overClear=false;
                     drawArrow(this.x+this.w/2+15, (this.y-o.y)/2+o.y-this.h/4, this.y-o.y-this.h/2, 15, false, (this.y-o.y)*toInch)
                }
            })
            if(overClear)drawArrow(this.x+this.w/2+15, (this.y-this.h/2)/2, this.y-this.h/2, 15, false, (this.y-this.h/2)*toInch)

            push()
            strokeWeight(1);
            stroke(50);
            line(this.x, -10, this.x, pheight + 10);
            pop();
            line(this.x - 7, this.y + (h / 2), this.x + w / 2 + 25, this.y + (h / 2));
            line(this.x - 7, this.y - (h / 2), this.x + w / 2 + 25, this.y - (h / 2));
            let a = w / pheight * lrwidth * inchPerUnit;
            let b = h / pheight * lrwidth * inchPerUnit;
            //drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a);
            pointArrow(this, 'R' + (w / 2 / pheight * loadedRing.width * inchPerUnit).toFixed(3))
            drawArrow(this.x + w / 2 + 15, this.y, h, 10, false, b);
            degTxtFormat();
            text((this.x * 360 / pwidth).toFixed(0) + '°', this.x, this.degPosY);
        }
    }
    getArea() {
        return (this.w * toInch) * ((this.h + this.w) * toInch);
    }
    isInOuterBoundary(mx, my) {
        if (mx <= this.x + this.w / 2 && mx >= this.x - this.w / 2)
            if (my <= this.y + this.h / 2 + this.w / 2 && my >= this.y - this.h / 2 - this.w / 2)
                return true;
        return false;
    }
    copySelf(x){
        return new Vertical_Slot(x, this.y, this.w, this.h)   
    }
}
class Horizontal_Slot extends Rectangle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.t = 'hslot';
    }
    draw() {
        push();
        noStroke();
        fill(0)
        rectMode(CENTER);
        arc(this.x - this.w / 2, this.y, this.h+ exw, this.h+ exw, PI / 2, -PI / 2);
        arc(this.x + this.w / 2, this.y, this.h+ exw, this.h+ exw, -PI / 2, PI / 2);
        rect(this.x, this.y, this.w+exw, this.h+exw);
    
        stroke(this.color);
        fill(this.color);
        arc(this.x - this.w / 2, this.y, this.h, this.h, PI / 2, -PI / 2);
        arc(this.x + this.w / 2, this.y, this.h, this.h, -PI / 2, PI / 2);
        rect(this.x, this.y, this.w, this.h);;
        if(this.isLocked)this.drawLock()
        pop();
    }
    textSelected() {
        if (this.selected || seeAll) {
            fill(0);
            textSize(16);
            textAlign(LEFT, BOTTOM);
            const w = abs(this.w);
            const h = abs(this.h);
            const offsetVal = (pheight - this.y - this.h / 2) / pheight * loadedRing.width * inchPerUnit;
            let overClear = true;
            shapes.forEach(s=>{
                const o = s.isOver(this.x+this.w/2+this.h/2+10, this.y);
                if(o===false);
                else{
                    overClear=false;
                     drawArrow(this.x+this.w/2+h/2+15, (this.y-o.y)/2+o.y-this.h/4, this.y-o.y-this.h/2, 15, false, (this.y-o.y)*toInch)
                }
            })
            if(overClear)drawArrow(this.x+this.w/2+h/2+15, (this.y-this.h/2)/2, this.y-this.h/2, 15, false, (this.y-this.h/2)*toInch)
            push()
            strokeWeight(1);
            stroke(50);
            line(this.x, -10, this.x, pheight + 10);
            pop();
            line(this.x, this.y + (h / 2), this.x + w / 2 + h / 2 + 20, this.y + (h / 2));
            line(this.x, this.y - (h / 2), this.x + w / 2 + h / 2 + 20, this.y - (h / 2));
            //line(this.x + (w / 2), this.y, this.x + (w / 2), -35);
            //line(this.x - (w / 2), this.y, this.x - (w / 2), -35);
            let a = w / pheight * lrwidth * inchPerUnit;
            let b = h / pheight * lrwidth * inchPerUnit;
            //drawArrow(this.x, this.y + h / 2 + 15, w, 10, true, a);
            drawArrow(this.x + w / 2 + h / 2 + 15, this.y, h, 10, false, b);
            pointArrow(this, 'R' + (h / 2 * toInch).toFixed(3))
            //drawArrow(this.x, -30, w, 10, true, a);
            drawArrow(this.x, this.y-this.h/2-10, w, 10, true, a);
            degTxtFormat();
            text((this.x * 360 / pwidth).toFixed(0) + '°', this.x, this.degPosY);
        }
    }
    getArea() {
        return (this.h * toInch) * ((this.h + this.w) * toInch);
    }

    copySelf(x){
        return new Horizontal_Slot(x, this.y, this.w, this.h)   
    }

    isOver(x,y){
        if(this.x+this.w/2+this.h/2+15>x&&this.x-this.w/2-15<x&&this.y<y&&(this.selected||seeAll))return {x:this.x, y:this.y+this.h/2}
        return false;
    }

}
class DemoRectangle extends Rectangle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
    dragged() {}
    textSelected() {}
}
class DemoCircle extends Circle {
    constructor(x, y, r) {
        super(x, y, r);
    }
    dragged() {}
    textSelected() {}
}
class DemoVertical_Slot extends Vertical_Slot {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
    dragged() {}
    textSelected() {}
}
class DemoHorizontal_Slot extends Horizontal_Slot {
    constructor(x, y, w, h) {
        super(x, y, w, h);
    }
    dragged() {}
    textSelected() {}
}
class ScrollBar extends Shape {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.w = 50;
        this.h = 20;
        this.color = 255;
        this.selected = false;
        this.selectMode = '';
        this.t = 'scrollbar';
        this.SELECTMOVE = 125;
        this.SELECTRESIZE = 200;
        this.SELECTPADDING = 3 / 5;
        this.arrowIndex = 0;
    }
    translateTo(mx,my){}
    draw() {
        imageMode(CENTER);
        image(scrollbar_img,this.x, this.y, this.w, this.h)
        image(leftarrow_img, mleft/2, height - mbot/2, mleft-4, mbot-4)
        image(rightarrow_img, width - mright/2, height - mbot/2, mright-4, mbot-4)
        // rectMode(CENTER);
        // rect(this.x, this.y, this.w, this.h)

    }
    dragged(mx) {
        const w = this.w;
        this.x = mx;
        if (mx - w / 2 < 0+mleft) this.x = w / 2+mleft;
        if (mx + w / 2 > width-mright) this.x = width -mright- w / 2;
    }
    mapTo(value, low1 = this.w / 2+mleft, high1 = width - this.w / 2 -mright, low2 = 0, high2 = -pwidth + canvasWidth - mright - mleft) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }
    isInArrowBoxes(x, y){
        if(y<height&&y>height - mbot){
            if(x>0&&x<width){
                if(x<mleft){
                    return true;
                }
                if(x>width-mright){
                    return true;
                }
            }
        }
        return false; 
    }
    clickArrowBoxes(x, y){
        if(y<height&&y>height - mbot){
            if(x>0&&x<width){
                if(x<mleft){
                    this.moveLeft()
                }
                if(x>width-mright){
                    this.moveRight()
                }
            }
        }
    }
    moveRight(){
        this.dragged(this.x+3)
    }
    moveLeft(){
        this.dragged(this.x-3)
    }
}
class Terminal extends Shape {
    constructor(x, y, flipped, t = 'bornier', rotation = 0) {
        super(x, y);
        this.connectors = ['bornier', 'armature_bx_vertical', 'armature_bx_horizontal']
        this.rotation = rotation;
        this.t = t;
        if (t == 'barrel' || t == 'barrel_screw'||t=='barrel_screw_qlatch') {
            this.flipped = flipped;
            this.h = 0.6/ (lrwidth * inchPerUnit) * pheight;
            this.w = 0.75 / (lrlength * inchPerUnit) * pwidth;
            if (this.flipped) this.tx = this.x + this.w / 2;
            if (!this.flipped) this.tx = this.x - this.w / 2;
        } else if (t=='barrel_qlatch') {
            this.flipped = flipped;
            this.h = 0.68 / (lrwidth * inchPerUnit) * pheight;
            this.w = 0.9 / (lrlength * inchPerUnit) * pwidth;
            if (this.flipped) this.tx = this.x + this.w / 2;
            if (!this.flipped) this.tx = this.x - this.w / 2;
        } 
        // else if (t == 'wire_tress') {
        //     this.tx = x;
        //     this.h = 0.31 / (lrwidth * inchPerUnit) * pheight;
        //     this.w = 0.31 / (lrlength * inchPerUnit) * pwidth;
        // } 
        else if (t == 'boitier') {
            this.tx = x;
            this.h = 1.5 / (lrwidth * inchPerUnit) * pheight;
            this.w = 1.5 / (lrlength * inchPerUnit) * pwidth;
        } else {
            this.tx = x;
            this.h = 0.7 / (lrwidth * inchPerUnit) * pheight;
            this.w = 0.7 / (lrlength * inchPerUnit) * pwidth;
        }
        this.rotation = rotation;
    }

    draw() {
        push()
        this.tx = this.x;
        fill(100, 100, 255);
        rectMode(CENTER);
        imageMode(CENTER)
        if (this.t == 'boitier') {
            rect(this.x, this.y, this.w, this.h)
            ellipse(this.x, this.y, this.w*2/3, this.h*2/3)
        } else {
            ellipse(this.x, this.y, this.w, this.h)
            ellipse(this.x, this.y, this.w*2/3, this.h*2/3)
            //image(terminal_img, this.x, this.y, this.w, this.h);
        } 
        if(this.isLocked)this.drawLock()
        pop()
    }

    isInOuterBoundary(mx, my) {
        if (mx < this.tx + this.w / 2 && mx > this.tx - this.w / 2 &&
            my < this.y + this.h / 2 && my > this.y - this.h / 2) return true;
        else return false;
    }
    isInInnerBoundary() {
        return true;
    }

    dragged(mx, my) {
        

            if (this.selectMode === 'move') {
                if (!(this.t == 'barrel' || this.t == 'barrel_screw'|| this.t == 'barrel_screw_qlatch'|| this.t == 'barrel_qlatch')) this.x = mx;
                this.y = my;
            }
            selectHole(this);
        
    }

    textSelected(){
        super.textSelected();
        if(this.selected||seeAll){
            this.showDirection();
            let overClear = true;
            let overClosest = {x:10000, y:-10000};
            shapes.forEach(s=>{
                const o = s.isOver(this.x+this.w/2+10, this.y);
                if(o===false);
                else{
                    overClear=false;
                    if(o.y>overClosest.y)overClosest.y = o.y;
                }
            })
            if(overClear)drawArrow(this.x+this.w/2+10, this.y/2, this.y, 10, false, this.y*toInch)
            else drawArrow(this.x+this.w/2+10, (this.y-overClosest.y)/2+overClosest.y, this.y-overClosest.y, 10, false, (this.y-overClosest.y)*toInch)
        }
    }

    isOver(x,y){
        if(this.tx+this.w/2+15>x&&this.tx-this.w/2-15<x&&this.y<y&&(this.selected||seeAll))return {x:this.tx, y:this.y}
        return false;
    }
    
    showDirection(){
        const x = this.tx;
        const y = this.y;
        const off = this.w/2;
        const rot = Math.round(this.rotation*360/(2*PI));
        if(rot >= 350 || rot<=10&&!this.flipped){
            this.rotation = 0;
            line(x-(10+off/2), y, x-(5+off/2), y-5)
            line(x-(10+off/2), y, x-(5+off/2), y+5)
        }
        if(rot >= 80 && rot<=100 ){
            this.rotation = PI/2;
            line(x, y-(10+off/2), x+5, y-(5+off/2))
            line(x, y-(10+off/2), x-5, y-(5+off/2))
            
        }
        if(rot >= 170 && rot<=190  || this.flipped){
            this.rotation = PI;
            line(x+(10+off/2), y, x+(5+off/2), y-5)
            line(x+(10+off/2), y, x+(5+off/2), y+5)
        }
        if(rot >= 260 && rot<=280 ){
            this.rotation = PI*3/2;
            line(x, y+(10+off/2), x-5, y+(5+off/2))
            line(x, y+(10+off/2), x+5, y+(5+off/2))
        }
    }
    copySelf(x){
        return new Terminal(x, this.y, this.flipped, this.t, this.rotation)   
    }
}

/** Connectors are paired with an id and that id is used to attach them together so that if one is changed,
 * the other may also be affected by the same change. 
 */
class Connector extends Terminal {
    constructor(x, y, flipped, t = 'Object', rotation = 0, id) {
        super(x, y, flipped, t, rotation);
        this.conn=null;
        this.id = id;
    }
    appendCon(conn) {
        this.conn = conn;
    }
    translateTo(mx,my){}
    draw() {
        push();
        fill(50, 168, 135)
        rectMode(CENTER);
        imageMode(CENTER);
        if(this.t =='barrel'&&!this.flipped)image(barrel_img, this.tx, this.y, this.w, this.h);
        else if(this.t =='barrel'&&this.flipped)image(barrel_f_img, this.tx, this.y, this.w, this.h);
        else if((this.t =='barrel_screw'||this.t=='barrel_screw_qlatch')&&!this.flipped)image(barrel_screw_img, this.tx, this.y, this.w, this.h);
        else if((this.t =='barrel_screw'||this.t=='barrel_screw_qlatch')&&this.flipped)image(barrel_screw_f_img, this.tx, this.y, this.w, this.h);
        else if(this.t =='barrel_qlatch'&&!this.flipped)image(barrel_qlatch_img, this.tx, this.y, this.w, this.h);
        else if(this.t =='barrel_qlatch'&&this.flipped)image(barrel_qlatch_f_img, this.tx, this.y, this.w, this.h);
        else rect(this.tx, this.y, this.w, this.h);
        if(this.isLocked)this.drawLock()
        pop();
    }
    dragged(mx, my) {

            if (this.selectMode === 'move') {
                this.y = my;
                if (this.conn != null) this.conn.y = my;
            }
            selectHole(this);
        
    }
    textSelected() {
        if (this.selected || seeAll) {
            push()
            fill(0)
            stroke(2)
            const x = this.x
            const y = this.y
            const w = this.w
            line(x,-10, x, pheight+10)
            line(this.tx-w/2-10, y, this.tx+w/2+10, y)
            //pointArrow(this, this.t);
            textSize(TEXTSIZE);
            textAlign(CENTER, BOTTOM);
            text((this.x * 360 / pwidth).toFixed(0) + '°', this.x, -11);
            pop()
        }
        if(this.selected||seeAll){
            //this.showDirection();
            let overClear = true;
            let overClosest = {x:10000, y:-10000};
            shapes.forEach(s=>{
                const o = s.isOver(this.x+this.w/2+10, this.y);
                if(o===false);
                else{
                    overClear=false;
                    if(o.y>overClosest.y)overClosest.y = o.y;
                    
                }
            })
            if(overClear&&this.flipped)drawArrow(this.tx+this.w/2+10, this.y/2, this.y, 10, false, this.y*toInch)
            else if(overClear&&!this.flipped)drawArrow(this.tx-this.w/2-10, this.y/2, this.y, 10, false, this.y*toInch)
            else if(this.flipped) drawArrow(this.tx+this.w/2+10, (this.y-overClosest.y)/2+overClosest.y, this.y-overClosest.y, 10, false, (this.y-overClosest.y)*toInch)
            else if(!this.flipped) drawArrow(this.tx-this.w/2-10, (this.y-overClosest.y)/2+overClosest.y, this.y-overClosest.y, 10, false, (this.y-overClosest.y)*toInch)
        }
    }
    mirror(){
        let ty
        if(this.y < pheight/2) ty = this.y+pheight/2
        else ty = this.y-pheight/2
        const id = Math.round(Math.random()*10000);
        let copy = [this.copySelf(ty,id), this.conn.copySelf(ty, id)];
        copy[0].appendCon(copy[1]);
        copy[1].appendCon(copy[0]);
        return copy;
    }
    copySelf(y,id){
        return new Connector(this.x, y, this.flipped, this.t, this.rotation, id)   
    } 
    center(){
        this.y = pheight/2; 
        this.conn.y = this.y;
    }  
    /** Do nothing to snap to grid */
    snapToGrid(){}
}