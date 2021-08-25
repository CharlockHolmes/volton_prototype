class TutorialHandler{
    constructor(){
        
        this.writeDelay = 15;
        this.writingloop=0;
        this.running = false;
        this.last = document.getElementById('tutoriallast');
        this.next = document.getElementById('tutorialnext');
        this.content = document.getElementById('tutorialcontent');
        this.initLocalStorage();
        setTimeout(()=>this.update(),1000);
        this.last.onclick = ()=> this.lastStep()
        this.next.onclick = ()=> this.nextStep()
        document.addEventListener('keydown', (e)=>{
            if([113].indexOf(e.keyCode) > -1){
                e.preventDefault();
                this.nextStep();
            }
            if([112].indexOf(e.keyCode) > -1){
                e.preventDefault();
                this.lastStep();
            }
        })
    }
    initLocalStorage(){
        let ts = localStorage.getItem('tutorialStep');
        if(ts==null||isNaN(ts))localStorage.setItem('tutorialStep',0);
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
    /*0*/"0<br><br> You may restart the tutorial at any time by going to <span style='color:red'>Layout>Tutorial.</span><br><br>Welcome to the Volton Band and Plate Heater Designer! The goal of this app is to let you design your own custom part in a simple way and to send it to us!<br><br>Click <span style='color:red'>next</span> or Press <span style='color:red'>F2</span> to start the tutorial<br><br>Click <span style='color:red'>prev</span> or Press <span style='color:red'>F1</span> to go to the previous step <br><br> Press <span style='color:red'>'h'</span> to toggle between visible and transparent tutorial mode  ",
    /*1*/"1<br><br> The <span style='color:red'>toolbar</span> is on the left<br>Hover over the Icons to see what they do. <br><br>Note: Most toolbar options are used exclusively in the <span style='color:red'>planner</span>            ",
    /*2*/"2<br><br> In the background you may see the default <span style='color:red'>Band Heater</span>.<br><br> Click and drag <span style='color:red'>Left</span> mouse button to rotate the band.<br><br> Click and drag the <span style='color:red'>Right</span> mouse button to move the band around <br><br>Zoom in and out with your <span style='color:red'>MouseWheel</span><br><br> Press <span style='color:red'>'o'</span> or go to <span style='color:red'>View>Reset Camera</span> to reset to default 2D perspective",
    /*3*/"3<br><br> Click and Drag the <span style='color:blue'>blue</span> headers to move the floating windows around <br><br>Click on the <span style='color:white;background-color:#1A4082'>-</span> header icon to open or collapse floating windows.",
    /*4*/"4<br><br> Open the <span style='color:blue'>Band Size</span> window.<br><br> Here you can set the <span style='color:red'>Width</span> and <span style='color:red'>Diameter</span> of the band. You may lower the <span style='color:red'>Resolution</span> if experiencing lag. The resolution affects the band and hole detail. Recommended value = 1000<br><br> Click <span style='color:red'>Submit</span> to apply the changes ",
    /*5*/"5<br><br> Open the  <span style='color:blue'>Power Rating</span> menu<br><br> This menu indicates what the  <span style='color:red'>Current</span> required and <span style='color:red'>Power Density</span> is. The power if the power density becomes  <span style='color:red'>RED</span>, it means that it is over the maximal Power density possible.",
    /*7*/"7<br><br> Open the <span style='color:blue'>Planner</span><br><br> The planner is where you will be able to customise <span style='color:red'>Terminals</span> and <span style='color:red'>Holes</span> on your band <br><br> The planner flattens out the band on a long rectangle, at the bottom of the planner you may notice x° marks that indicates where you are on the band. <br><br> Move around the band by using the <span style='color:red'>Horizontal Sidebar</span> at the bottom or by using your <span style='color:red'>MouseWheel</span><br><br> Note: 0° is on the left and 360° is on the right ",
    /*8*/"8<br><br> To add new <span style='color:red'>components</span>(terminals and holes), Click on a grey space to place a <span style='color:red'>Red marker</span>, Then press on one of the top 5 icons in the <span style='color:red'>toolbar</span> to add the component.<br><br> Add one <span style='color:red'>Circular Hole</span> and one <span style='color:red'>Terminal</span><br><br>Note: Terminals are <span style='color:#6464FF'>Blue</span> and Holes are White",
    /*9*/"9<br><br> Click on the new added Circular white hole.<br><br> You can <span style='color:red'>move</span> it around by dragging its center and <span style='color:red'>resize</span> it  by dragging the edge. <br><br> Next open the <span style='color:blue'>Component</span> menu. <br><br>In this menu, you may manually enter the <span style='color:red'>Angle</span>, <span style='color:red'>Offset</span>, <span style='color:red'>Height</span> and <span style='color:red'>Width</span>.<br><br> Press 'Enter' to apply the changes<br><br>Note: Changes can only be done if the hole is selected, <span style='color:red'>Angle</span> indicates the position of the component horizontaly, <span style='color:red'>Offset</span> sets the Vertical position using the distance from the top (edge of the band)",
   /*10*/"10<br><br> Click on the new added <span style='color:blue'>Terminal</span> <br><br> The terminal works in the similar way to holes, however they <span style='color:red'>cannot</span> be resized <br><br> Changes to terminals are also done in the <span style='color:blue'>Component</span> menu.<br><br> There are additional options for terminals:<br><br> <span style='color:red'>Rotation</span> indicates which way the connector is facing. <br><br><span style='color:red'>Type</span> lets you specify which terminal you want to have.",
   /*11*/"11<br><br> <span style='color:red'>IMPORTANT</span>:<br><br> All changes made in the planner wont be applied unless you press '<span style='color:red'>Save</span>'in the toolbar<br><br> You can only modify a terminal or hole if it is <span style='color:red'>Selected</span><br><br> CLOSE the planner to look at the modified band",
   /*12*/"12<br><br> Select any <span style='color:red'>component</span>, <br><br> Press <span style='color:red'>'c'</span> to center the component.<br><br> Press <span style='color:red'>'m'</span> to create a mirrored copy of the component on the opposite side of the band.<br><br>Press <span style='color:red'>'l'</span> to lock the component, this only prevents the mouse from moving it<br><br> Press <span style='color:red'>'CTRL+z'</span> to undo a change on the planner<br><br> Press the <span style='color:red'>'Arrow Keys'</span> or <span style='color:red'>'w' 'a' 's' 'd' </span>to slowly move the component. <br><br> For a reminder of shortcuts, you may go to <span style='color:red'>Help>Shortcuts</span> in the navigation bar",
   /*13*/"13<br><br> Open the <span style='color:blue'>Additional notes</span> menu. <br><br> Here you may enter any additional specifications for your item.",
    /**/"Last<br><br> Once you are done with your item, you may click on <span style='color:red'>Submit Project</span> to enter the submition menu and send us your request<br><br> Go to <span style='color:red'>Edit>Practice</span> to begin example",
    /**/"Exercise 1<br><br> Make the following band: <br><br> Width: 3in<br>Diameter:10in<br>Power: 500W<br>Voltage: 120V<br>2 Sections equally sized with QuickLatch closing and 0.38in gap length<br>1 Bornier at 30° 1inch offset<br>1 Bornier at 30° 2inch offset<br> One 1.2inch diameter hole at 60° 1.5inch offset <br> One mirrored copy of the first hole<br><br> Write down in the notes the total current draw,  the total power density and your name<br><br> Submit your project",
]

