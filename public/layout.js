class LayoutHandler{
    constructor(){
        this.domElements = document.getElementsByClassName('dragpos');
        this.buffer = [];
        this.layoutToBuffer();
        this.manageVariables();
        this.hidden = false;
        document.getElementById('taskview').onclick = ()=>this.toggleDisplay();
    }
    layoutToBuffer(){
        let tempBuff = localStorage.getItem('layoutbuff');
        if(tempBuff!=null){
            this.buffer = JSON.parse(tempBuff);
            this.bufferToLayout();
        }
        else {
            localStorage.setItem('layoutbuff', JSON.stringify(defaultLayout))
            this.layoutToBuffer();
        }
    }
    bufferToLayout(){
        this.buffer.forEach(e=>{
            let ref = document.getElementById(e.id);
            ref.style.left = e.left+'px';
            ref.style.top = e.top+'px';
            document.getElementById(e.id).children[1].style.display = e.display;
            
        })
    }
    update(){
        print('layoutupdate')
        this.buffer = []
        this.domElements.forEach(e=>{
            const state = document.getElementById(e.id).children[1].style.display;
            this.buffer.push({top:e.offsetTop, left:e.offsetLeft,id:e.id,display:state})
        })
        //console.log(this.buffer)
        localStorage.setItem('layoutbuff', JSON.stringify(this.buffer))
    }

    toggleDisplay(){
        if(!this.hidden){
            this.hidden = true; 
            plannerBoxFlag = false;
            this.domElements.forEach(e=>{if(e.id!='taskbar') document.getElementById(e.id).style.display = 'none'})
        }
        else{
            this.hidden = false; 
            this.domElements.forEach(e=>{if(e.id!='taskbar') document.getElementById(e.id).style.display = 'block'})
            this.manageVariables();
            this.update();
        }
        this.displayIcon()
    }
    displayIcon(){
        const src = ['ressources/2dtextures/menueyes1.png', 'ressources/2dtextures/menueyes2.png']
        let element = document.getElementById('taskview');
        if(this.hidden)element.src = src[1];
        else element.src = src[0];
        console.log(element)
    }

    manageVariables(){
        this.buffer.forEach(e=>{
            if(e.id=='p5holder'&&e.display=='none')plannerBoxFlag = false;
            else if(e.id=='p5holder')plannerBoxFlag = true;
        })
    }

}


const defaultLayout = [{"top":299,"left":1151,"id":"taskbar","display":""},{"top":59,"left":6,"id":"ringboxdrag","display":"none"},{"top":58,"left":178,"id":"selectedholeboxdrag","display":"none"},{"top":58,"left":324,"id":"selectedconboxdrag","display":"none"},{"top":57,"left":508,"id":"powerboxdrag","display":"none"},{"top":57,"left":691,"id":"gapboxdrag","display":"none"},{"top":56,"left":1052,"id":"textdrag","display":"none"},{"top":298,"left":746,"id":"tutorialdrag","display":"block"},{"top":101,"left":8,"id":"p5holder","display":"none"}]