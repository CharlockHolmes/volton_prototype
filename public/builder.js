class Builder{
    constructor(){
        
        createRenderer();
        createScene();
        loadSavedValues();
        letInit();
        this.tutorial
        this.gapTable
        this.layout;
        setTimeout(()=>{
            this.tutorial = new TutorialHandler();
            this.gapTable = new DomTable(r.gaps.length, r.radius, inchPerUnit);
            this.gapTable.uploadTableData();
            this.layout = new LayoutHandler()
            document.getElementById('loadingbanner').innerHTML = '';
        },1000);

    }
}

const build = new Builder()
document.getElementById('retro').onclick = () =>{build.layout.specialMode();}