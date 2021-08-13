class Builder{
    constructor(){
        if(CAPTCHA_Validate()){

            createRenderer();
            createScene();
            loadSavedValues();
            letInit();
            loadTextField()
            setTimeout(()=>{
                this.tutorial = new TutorialHandler();
                this.gapTable = new DomTable(1, r.radius, inchPerUnit);
                //this.gapTable.uploadTableData();
                this.layout = new LayoutHandler()
                this.componentTable = new ComponentTableManager();
                document.getElementById('loadingbanner').innerHTML = '';
                this.layout.toggleSpecificDisplay('gapdiv')
            },1000);
        }

    }
}

const build = new Builder()
document.getElementById('retro').onclick = () =>{build.layout.specialMode();}