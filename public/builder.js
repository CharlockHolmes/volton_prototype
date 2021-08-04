class Builder{
    constructor(){
        
        createRenderer();
        createScene();
        loadSavedValues();

        this.tutorial = new TutorialHandler();
        this.gapTable = new DomTable(r.gaps.length, r.radius, inchPerUnit);
        this.gapTable.uploadTableData();
        this.layout;
        setTimeout(()=>{
            this.layout = new LayoutHandler()
            document.getElementById('loadingbanner').innerHTML = '';
        },1000);

    }
}

const build = new Builder()
document.getElementById('retro').onclick = () =>{build.layout.specialMode();}