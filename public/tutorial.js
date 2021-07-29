class TutorialHandler{
    constructor(){
        this.writeDelay = 20;
        this.writingloop=0;
        this.running = false;
        this.last = document.getElementById('tutoriallast');
        this.next = document.getElementById('tutorialnext');
        this.content = document.getElementById('tutorialcontent');
        if(localStorage.getItem('tutorialStep')=='null')localStorage.setItem('tutorialStep',0);
        this.update();
        this.last.onclick = ()=> this.lastStep()
        this.next.onclick = ()=> this.nextStep()
    }
    update(){
        if(this.running)clearInterval(this.writingloop)
        const str =  tutorialSteps[parseInt(localStorage.getItem('tutorialStep'))];
        this.content.innerHTML  = "";
        let index = 0;
        this.writingloop = setInterval(()=>{
            this.running = true;
            let tstr = '';
            if(str[index]=='<'){
                if(str[index+1]=='b'){
                    tstr = '<br>'
                    index+=4;
                }
                else if(str[index+1]=='s'){
                    tstr = '<';
                    index++;
                    let goOn = true;
                    while(goOn){
                        tstr+=str[index++]
                        if(str[index] == '/'&& str[index+1]=='s'){
                            tstr+='/span>'
                            index+=6;
                            goOn = false;
                        }
                    }
                }
            }
            else tstr=str[index++];
            //console.log(tstr)
            this.content.innerHTML +=tstr;
            if(index>=str.length){
                clearInterval(this.writingloop)
                this.running = false;
            }
        },this.writeDelay)
    }
    nextStep(){
        let step = parseInt(localStorage.getItem('tutorialStep'));
        if(step+1>=tutorialSteps.length);
        else{
            localStorage.setItem('tutorialStep',step+1);
            this.update();
        }
    }
    lastStep(){
        let step = parseInt(localStorage.getItem('tutorialStep'));
        if(step-1<0);
        else{
            localStorage.setItem('tutorialStep',step-1);
            this.update();
        }
        
    }
}

const tutorialSteps = [
    /*0*/"0<br><br> Welcome to the Volton Band and Plate Heater Designer! The goal of this app is to let you design your own custom part in a simple way and to send it to us!<br><br>Click <span style='color:red'>next</span> or press <span style='color:red'>space</span> to start the tutorial            ",
    /*1*/"1<br><br> The <span style='color:red'>toolbar</span> is on the right<br>Hover over the Icons to see their purpose. <br><br>Note: Most options are used only in the <span style='color:red'>planner</span>            ",
    /*2*/"2<br><br> Click and Drag the blue banners to move the windows around <br><br>Press on the <span style='color:red'>-</span> icon to open the planner window.   ",
    /*3*/"3<br><br> This is the <span style='color:red'>planner</span>, This is where you will be able to customise <span style='color:red'>Items</span> and <span style='color:red'>Holes</span> on your band<br><br>To add new <span style='color:red'>components</span>(items and holes), Click on a grey space to place a <span style='color:red'>Red marker</span>, Then press on one of the top 5 icons in the <span style='color:red'>toolbar</span><br><br> Add one <span style='color:red'>Circular Hole</span> and one <span style='color:red'>Terminal</span><br><br>Note: Terminals are <span style='color:#6464FF'>Blue</span> and Holes are White",
    /*4*/"4<br><br>",
    /*5*/"5<br><br>",
    /*6*/"6<br><br>",
]
const tutorial = new TutorialHandler();
