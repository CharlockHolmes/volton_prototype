class LayoutHandler{
    constructor(){
        this.domElements = document.getElementsByClassName('dragpos');
        this.buffer = [];
        this.layoutToBuffer() 
    }
    layoutToBuffer(){
        let tempBuff = localStorage.getItem('layoutbuff');
        if(tempBuff!=null){
            this.buffer = JSON.parse(tempBuff);
            this.bufferToLayout();
        }
        else this.update();
    }
    bufferToLayout(){
        this.buffer.forEach(e=>{
            let ref = document.getElementById(e.id);
            ref.style.left = e.left+'px';
            ref.style.top = e.top+'px';

        })
    }
    update(){
        this.buffer = []
        this.domElements.forEach(e=>{
            this.buffer.push({top:e.offsetTop, left:e.offsetLeft,id:e.id,display:'block'})
        })
        console.log(this.buffer)
        localStorage.setItem('layoutbuff', JSON.stringify(this.buffer))
    }
}
const layout = new LayoutHandler();