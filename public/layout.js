class LayoutHandler{
    constructor(){
        this.domElements = document.getElementsByClassName('dragpos');
        this.buffer = [];
        this.layoutToBuffer();
        this.manageVariables();
        this.hidden = false;
        document.getElementById('taskview').onclick = ()=>this.toggleDisplay();
        document.getElementById('tutoriallayout').onclick = ()=>this.setTutorialLayout();
        document.getElementById('defaultlayout').onclick = ()=>this.setDefaultLayout();
        document.getElementById('savelayout').onclick = ()=>this.saveButtonLayout();
        document.getElementById('loadlayout').onclick = ()=>this.loadButtonLayout();
    }
    layoutToBuffer(){
        let tempBuff = localStorage.getItem('layoutbuff');
        if(tempBuff!=null){
            this.buffer = JSON.parse(tempBuff);
            this.bufferToLayout();
        }
        else {
            this.setTutorialLayout();
        }
        this.manageVariables();
    }
    setTutorialLayout(){
        localStorage.setItem('tutorialStep', 0)
        tutorial.update()
        localStorage.setItem('layoutbuff', JSON.stringify(defaultLayout))
        this.layoutToBuffer();
    }
    setDefaultLayout(){
        localStorage.setItem('layoutbuff', JSON.stringify(defaultLayoutnoTutorial))
        this.layoutToBuffer();
    }
    saveButtonLayout(){
        localStorage.setItem('layoutsave', JSON.stringify(this.buffer))
    }
    loadButtonLayout(){
        let temp = JSON.parse(localStorage.getItem('layoutsave'))
        if(temp!=null){
            localStorage.setItem('layoutbuff', JSON.stringify())
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


const defaultLayout = [{"top":227,"left":1464,"id":"taskbar","display":""},{"top":58,"left":7,"id":"ringboxdrag","display":"none"},{"top":58,"left":360,"id":"selectedholeboxdrag","display":"none"},{"top":57,"left":504,"id":"selectedconboxdrag","display":"none"},{"top":58,"left":176,"id":"powerboxdrag","display":"none"},{"top":57,"left":691,"id":"gapboxdrag","display":"none"},{"top":57,"left":1054,"id":"textdrag","display":"none"},{"top":226,"left":1060,"id":"tutorialdrag","display":"block"},{"top":101,"left":8,"id":"p5holder","display":"none"}]
const defaultLayoutnoTutorial = [{"top":101,"left":1622,"id":"taskbar","display":""},{"top":58,"left":7,"id":"ringboxdrag","display":"none"},{"top":58,"left":360,"id":"selectedholeboxdrag","display":"none"},{"top":57,"left":504,"id":"selectedconboxdrag","display":"none"},{"top":58,"left":176,"id":"powerboxdrag","display":"none"},{"top":57,"left":691,"id":"gapboxdrag","display":"none"},{"top":57,"left":1054,"id":"textdrag","display":"none"},{"top":57,"left":1457,"id":"tutorialdrag","display":"none"},{"top":101,"left":8,"id":"p5holder","display":"block"}]