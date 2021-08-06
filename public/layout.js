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
        this.initToggleView();
    }
    initToggleView(){
        document.getElementById('toggle1').onclick = ()=> this.toggleSpecificDisplay('ringboxdrag')
        document.getElementById('toggle2').onclick = ()=> this.toggleSpecificDisplay('powerboxdrag')
        document.getElementById('toggle3').onclick = ()=> this.toggleSpecificDisplay('gapdiv')
        document.getElementById('toggle4').onclick = ()=> this.toggleSpecificDisplay('p5holder')
        document.getElementById('toggle5').onclick = ()=> this.toggleSpecificDisplay('selectedholeboxdrag')
        document.getElementById('toggle6').onclick = ()=> this.toggleSpecificDisplay('selectedconboxdrag')
        document.getElementById('toggle7').onclick = ()=> this.toggleSpecificDisplay('textdrag')
        document.getElementById('toggletuto').onclick = ()=> this.toggleSpecificDisplay('tutorialdrag')
        document.getElementById('toggletoolbar').onclick = ()=> this.toggleSpecificDisplay('taskbar')
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
    toggleSpecificDisplay(id){
        const item = document.getElementById(id);
        if(item.style.display == 'none') item.style.display = 'block';
        else item.style.display = 'none';
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
        if(tuto.style.opacity=='0.2'){tuto.style.opacity =  '1';tuto.style.pointerEvents = 'auto'}
        else {tuto.style.opacity =  '0.2';tuto.style.pointerEvents = 'none'}
    }
    

}

window.onerror = function(error) {
    localStorage.setItem('layoutbuff', JSON.stringify(defaultLayoutnoTutorial))
    setTimeout(()=>window.location.reload(),1000)
    alert(error +'will reload'); 
  };
const defaultLayout = [{"top":295,"left":820,"id":"taskbar","display":""},{"top":59,"left":12,"id":"ringboxdrag","display":"block"},{"top":58,"left":730,"id":"selectedconboxdrag","display":"block"},{"top":59,"left":178,"id":"powerboxdrag","display":"block"},{"top":58,"left":361,"id":"gapboxdrag","display":"block"},{"top":58,"left":913,"id":"textdrag","display":"block"},{"top":294,"left":877,"id":"tutorialdrag","display":"block"},{"top":260,"left":6,"id":"p5holder","display":"none"}]
const defaultLayoutnoTutorial = [{"top":259,"left":1623,"id":"taskbar","display":""},{"top":59,"left":12,"id":"ringboxdrag","display":"block"},{"top":58,"left":730,"id":"selectedconboxdrag","display":"block"},{"top":59,"left":178,"id":"powerboxdrag","display":"block"},{"top":58,"left":361,"id":"gapboxdrag","display":"block"},{"top":58,"left":913,"id":"textdrag","display":"block"},{"top":57,"left":1316,"id":"tutorialdrag","display":"none"},{"top":260,"left":6,"id":"p5holder","display":"none"}]


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