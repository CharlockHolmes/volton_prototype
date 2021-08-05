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
        build.tutorial.update()
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
            console.log(e.id)
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

    specialMode(){
        let green = 'rgb(64,151,69)';
        let black = 'rgb(18,20,17)';
        let backg = 'rgb(49,67,59)'
        tcc(green,'dragpos')
        ccc(black,'headerthing')
        ccc(black,'dragpos')
        document.getElementById('body').style.backgroundColor = backg;
        document.getElementById('navbar').style.backgroundImage = 'url(ressources/srcimg/banner2.png)';
        //document.getElementById('tutorialdrag').style.backgroundColor = 'rgb(29,47,39)';
        //document.getElementById('tutorialcontent').style.color = 'rgb(44,250,159)';
    }

    tutorialVisualToggle(){
        const tuto = document.getElementById('tutorialdrag');
        if(tuto.style.opacity=='0.2')tuto.style.opacity =  '1'
        else tuto.style.opacity =  '0.2';
    }

}


const defaultLayout = [{"top":231,"left":601,"id":"taskbar","display":""},{"top":58,"left":9,"id":"ringboxdrag","display":"none"},{"top":58,"left":726,"id":"selectedholeboxdrag","display":"none"},{"top":58,"left":870,"id":"selectedconboxdrag","display":"none"},{"top":58,"left":178,"id":"powerboxdrag","display":"none"},{"top":58,"left":361,"id":"gapboxdrag","display":"none"},{"top":58,"left":1055,"id":"textdrag","display":"none"},{"top":230,"left":647,"id":"tutorialdrag","display":"block"},{"top":242,"left":44,"id":"p5holder","display":"none"}]
const defaultLayoutnoTutorial = [{"top":236,"left":16,"id":"taskbar","display":""},{"top":58,"left":9,"id":"ringboxdrag","display":"none"},{"top":58,"left":726,"id":"selectedholeboxdrag","display":"none"},{"top":58,"left":870,"id":"selectedconboxdrag","display":"none"},{"top":58,"left":178,"id":"powerboxdrag","display":"none"},{"top":58,"left":361,"id":"gapboxdrag","display":"none"},{"top":58,"left":1055,"id":"textdrag","display":"none"},{"top":57,"left":1457,"id":"tutorialdrag","display":"none"},{"top":235,"left":59,"id":"p5holder","display":"none"}]


function cc(c,id){
    document.getElementById(id).style.color = c;
}
function ccc(c,cl){
    let a = document.getElementsByClassName(cl);
    for(let d of a){
        d.style.backgroundColor = c;
    }
}
function tc(c,id){
    document.getElementById(id).style.color = c;
}
function tcc(c,cl){
    let a = document.getElementsByClassName(cl);
    for(let d of a){
        d.style.color = c;
    }
}