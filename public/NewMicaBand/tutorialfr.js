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

const tutorialStepsEN = [
    /*0*/"0<br><br> You may restart the tutorial at any time by going to <span style='color:red'>Layout>Tutorial.</span><br><br>Welcome to the Volton Band and Plate Heater Designer! The goal of this app is to let you design your own custom part in a simple way and to send it to us!<br><br>Click <span style='color:red'>next</span> or Press <span style='color:red'>F2</span> to start the tutorial<br><br>Click <span style='color:red'>prev</span> or Press <span style='color:red'>F1</span> to go to the previous step <br><br> Press <span style='color:red'>'h'</span> to toggle between visible and transparent tutorial mode  ",
    /*1*/"1<br><br> The <span style='color:red'>toolbar</span> is on the left<br>Hover over the Icons to see what they do. <br><br>Note: Most toolbar options are used exclusively in the <span style='color:red'>planner</span>            ",
    /*2*/"2<br><br> In the background you may see the default <span style='color:red'>Band Heater</span>.<br><br> Click and drag <span style='color:red'>Left</span> mouse button to rotate the band.<br><br> Click and drag the <span style='color:red'>Right</span> mouse button to move the band around <br><br>Zoom in and out with your <span style='color:red'>MouseWheel</span><br><br> Press <span style='color:red'>'o'</span> or go to <span style='color:red'>View>Reset Camera</span> to reset to default 2D perspective",
    /*3*/"3<br><br> Click and Drag the <span style='color:blue'>blue</span> headers to move the floating windows around <br><br>Click on the <span style='color:white;background-color:#1A4082'>-</span> header icon to open or collapse floating windows.",
    /*4*/"4<br><br> Open the <span style='color:blue'>Band Size</span> window.<br><br> Here you can set the <span style='color:red'>Width</span> and <span style='color:red'>Diameter</span> of the band. You may lower the <span style='color:red'>Resolution</span> if experiencing lag. The resolution affects the band and hole detail. Recommended value = 1000<br><br> Click <span style='color:red'>Submit</span> to apply the changes ",
    /*5*/"5<br><br> Open the  <span style='color:blue'>Power Rating</span> menu<br><br> This menu indicates what the  <span style='color:red'>Current</span> required and <span style='color:red'>Power Density</span> is. If the power density becomes  <span style='color:red'>RED</span>, it means that it is over the maximal Power density possible.",
    /*6*/"6<br><br> Open the <span style='color:blue'>Gaps / Sections / Fasteners </span>menu<br><br> This menu lets you <span style='color:red'>add</span> and <span style='color:red'>remove</span> the number of sections by modifying the number of gaps. <br><br> The <span style='color:red'>Angle</span> value indicates the center point of the gap.<br><br> The <span style='color:red'>Arc</span> value indicates the angular width of the gap.<br><br> The <span style='color:red'>Length</span> value indicates the length between the beginning and the end of the gap.<br><br> The <span style='color:red'>Closing</span> indicates what fastener is used to close the gap",
    /*7*/"7<br><br> Open the <span style='color:blue'>Planner</span><br><br> The planner is where you will be able to customise <span style='color:red'>Terminals</span> and <span style='color:red'>Holes</span> on your band <br><br> The planner flattens out the band on a long rectangle, at the bottom of the planner you may notice x° marks that indicates where you are on the band. <br><br> Move around the band by using the <span style='color:red'>Horizontal Sidebar</span> at the bottom or by using your <span style='color:red'>MouseWheel</span><br><br> Note: 0° is on the left and 360° is on the right ",
    /*8*/"8<br><br> To add new <span style='color:red'>components</span>(terminals and holes), Click on a grey space to place a <span style='color:red'>Red marker</span>, Then press on one of the top 5 icons in the <span style='color:red'>toolbar</span> to add the component.<br><br> You can remove a selected component, press the <span style='color:green'>Delete Key</span> <br><br> Add one <span style='color:red'>Circular Hole</span> and one <span style='color:red'>Terminal</span><br><br>Note: Terminals are <span style='color:#6464FF'>Blue</span> and Holes are White",
    /*9*/"9<br><br> Click on the new added Circular white hole.<br><br> You can <span style='color:red'>move</span> it around by dragging its center and <span style='color:red'>resize</span> it  by dragging the edge. <br><br> Next open the <span style='color:blue'>Component</span> menu. <br><br>In this menu, you may manually enter the <span style='color:red'>Angle</span>, <span style='color:red'>Offset</span>, <span style='color:red'>Height</span> and <span style='color:red'>Width</span>.<br><br> Press 'Enter' to apply the changes<br><br>Note: Changes can only be done if the hole is selected, <span style='color:red'>Angle</span> indicates the position of the component horizontaly, <span style='color:red'>Offset</span> sets the Vertical position using the distance from the top (edge of the band)",
   /*10*/"10<br><br> Click on the new added <span style='color:blue'>Terminal</span> <br><br> The terminal works in the similar way to holes, however they <span style='color:red'>cannot</span> be resized <br><br> Changes to terminals are also done in the <span style='color:blue'>Component</span> menu.<br><br> There are additional options for terminals:<br><br> <span style='color:red'>Rotation</span> indicates which way the connector is facing. <br><br><span style='color:red'>Type</span> lets you specify which terminal you want to have.",
   /*11*/"11<br><br> <span style='color:red'>IMPORTANT</span>:<br><br> All changes made in the planner wont be applied unless you press '<span style='color:red'>Save</span>'in the toolbar<br><br> You can only modify a terminal or hole if it is <span style='color:red'>Selected</span><br><br> CLOSE the planner to look at the modified band. You can also use the last button in the toolbar to toggle the UI. You may use the presets in the navigation bar to start your project",
   /*12*/"12<br><br> Select any <span style='color:red'>component</span>, <br><br> Press <span style='color:red'>'c'</span> to center the component.<br><br> Press <span style='color:red'>'m'</span> to create a mirrored copy of the component on the opposite side of the band.<br><br>Press <span style='color:red'>'l'</span> to lock the component, this only prevents the mouse from moving it<br><br> Press <span style='color:red'>'CTRL+z'</span> to undo a change on the planner<br><br> Press the <span style='color:red'>'Arrow Keys'</span> or <span style='color:red'>'w' 'a' 's' 'd' </span>to slowly move the component. <br><br> For a reminder of shortcuts, you may go to <span style='color:red'>Help>Shortcuts</span> in the navigation bar",
   /*13*/"13<br><br> Open the <span style='color:blue'>Additional notes</span> menu. <br><br> Here you may enter any additional specifications for your item.",
    /**/"Last<br><br> Once you are done with your item, you may click on <span style='color:red'>Submit Project</span> to enter the submition menu and send us your request<br><br> Go to <span style='color:red'>Edit>Practice</span> to begin example",
    /**/"Exercise 1<br><br> Make the following band: <br><br> Width: 3in<br>Diameter:10in<br>Power: 500W<br>Voltage: 120V<br>2 Sections equally sized with QuickLatch closing and 0.38in gap length<br>1 Bornier at 30° 1inch offset<br>1 Bornier at 30° 2inch offset<br> One 1.2inch diameter hole at 60° 1.5inch offset <br> One mirrored copy of the first hole<br><br> Write down in the notes the total current draw,  the total power density and your name<br><br> Submit your project",
]
const tutorialSteps = [
    /*0*/"0<br><br> Vous pouvez redemarrer le tutoriel en allant à <span style='color:red'>Layout>Tutoriel.</span><br><br>Bienvenue au créateur de Bande et Plaque chauffantes Volton! Le but de cette application est de vous laisser créer votre propre pièce personalisée et de nous l'envoyer! <br><br>Clickez <span style='color:red'>next</span> or Pesez <span style='color:red'>F2</span> pour demarrer le tutoriel<br><br>Clickez <span style='color:red'>prev</span> or Pesez <span style='color:red'>F1</span> pour revenir à l'étape précédente <br><br> Pesez <span style='color:red'>'h'</span> pour alterner la visibilité de la fenêtre tutoriel ",
    /*1*/"1<br><br> Le <span style='color:red'>toolbar</span> se situe à la gauche. <br>Survolez les Icones pour voir ce qu'ils font. <br><br>Note: La plupart des options du toolbar sont utilisé en majorité dans le <span style='color:red'>planner</span>            ",
    /*2*/"2<br><br> Dans le fond d'écran, vous pouvez observez une <span style='color:red'>Bande Chauffante</span>.<br><br> Clickez et glissez le bouton <span style='color:red'>Gauche</span> de la souris pour faire tourner la bande.<br><br> Pesez et glisser le bouton <span style='color:red'>Droit</span> de la souris pour faire bouger la bande <br><br>Aggrandissez l'image avec <span style='color:red'>la roulette</span> de la souris.<br><br> Pesez <span style='color:red'>'o'</span> ou allez à <span style='color:red'>Vue>Reset Caméra</span> pour revenir à la perspective de départ",
    /*3*/"3<br><br> Clickez et glissez les <span style='color:blue'>bannières bleues</span> pour déplacer les fenêtres. <br><br>Clickez sur l'icone <span style='color:white;background-color:#1A4082'>-</span> de la bannière pour cacher ou ouvrir les fenêtres.",
    /*4*/"4<br><br> Ouvrez la fenêtre <span style='color:blue'>Dim. Bande</span>.<br><br> Ici vous pouvez ajuster l'attribut <span style='color:red'>Largeur</span> et <span style='color:red'>Diamètre</span> de la bande. Si vous avez des problèmes de performance, vous pouvez réduire l'attribut <span style='color:red'>Résolution</span>. La résolution affecte le détail de la bande. Valeur recommendée = 1000<br><br> Clickez <span style='color:red'>Submit</span> pour appliquer les changements.",
    /*5*/"5<br><br> Ouvrez la fenêtre <span style='color:blue'>Power Rating</span><br><br> Cette fenêtre indique le <span style='color:red'>Courant</span> requis et la <span style='color:red'>Power Density</span> approximée. Si la densité deviens <span style='color:red'>ROUGE</span>, ça veut dire qu'elle surpasse la densité maximale possible.",
    /*6*/"6<br><br> Ouvrez la fenêtre <span style='color:blue'>Gaps / Sections / Fasteners </span>menu<br><br> Cette fenêtre permet <span style='color:red'>d'ajouter</span> et de <span style='color:red'>retirer</span> le nombre de sections en ajustant le nombre de gaps. <br><br> L'attribut <span style='color:red'>Angle</span> indique le point central du gap.<br><br> L'attribut <span style='color:red'>Arc</span> indique la largeur angulaire du gap.<br><br> L'attribut <span style='color:red'>Length</span> indique la longueur entre le début et la fin du gap.<br><br> L'attribut <span style='color:red'>Closing</span> indique quel type de fermeture ferme le gap",
    /*7*/"7<br><br> Ouvrez la fenêtre <span style='color:blue'>Planner</span><br><br> Le planner est l'endroit où vous pourrez personaliser les <span style='color:red'>Terminals</span> et les <span style='color:red'>Trous</span> sur votre bande.<br><br> Le planner aplatit la bande sur un long rectangle. out the band on a long rectangle. Au bas du planner, vous pouvez y trouver des marques x° qui indique où vous vous situez sur la bande. <br><br> Déplacez vous sur la bande en utilisant la <span style='color:red'>Barre horizontale</span> au bas de la fenêtre ou en utilisant la <span style='color:red'>Roulette de souris</span><br><br> Note: 0° à la gauche et 360° est à la droite",
    /*8*/"8<br><br> Pour ajouter un nouveau <span style='color:red'>component</span>(terminals ou trous), Clickez sur un espace gris pour placer un <span style='color:red'>Marqueur rouge</span>. Ensuite clickez sur l'un des 5 icones du haut de la <span style='color:red'>toolbar</span> pour ajouter le component.<br><br> Vous pouvez retirer un component en pesant sur la touche <span style='color:green'>Delete</span> <br><br> Ajoutez un <span style='color:red'> Trou</span> et un <span style='color:red'>Terminal</span><br><br>Note: Les Terminals sont <span style='color:#6464FF'>Bleu</span> et les Trous sont Blanc",
    /*9*/"9<br><br> Clickez sur le trou blanc récemment ajouté.<br><br> Vous pouvez le <span style='color:red'>bouger</span> en glissant son centre avec la souris et le <span style='color:red'>redimensionner</span> en glissant le rebord du component. <br><br> Ensuite ouvrez la fenêtre <span style='color:blue'>Component</span>. <br><br>Dans cette fenêtre, vous pouvez manuellement entrer l'attribut <span style='color:red'>Angle</span>, <span style='color:red'>Offset</span>, <span style='color:red'>Height</span> et <span style='color:red'>Width</span> du component.<br><br> Pesez 'Enter' pour appliquer les changements<br><br>Note: Ces changements peuvent seulement être fait si un component est sélectionné. <span style='color:red'>Angle</span> indique la position du component sur l'horizontale. <span style='color:red'>Offset</span> ajuste la position Verticale en utilisant la distance entre le haut de la bande et le centre du component",
   /*10*/"10<br><br> Clickez sur le <span style='color:blue'>Terminal</span> récemment ajouté.<br><br> Le terminal fonctionne comme le trou, mais sa taille ne peut pas être ajustée.<br><br> Il ya des options additionelles pour les terminals:<br><br> <span style='color:red'>Rotation</span> indique dans quelle direction le connector fait face. <br><br><span style='color:red'>Type</span> vous permet de selectionner le type de terminal.",
   /*11*/"11<br><br> <span style='color:red'>IMPORTANT</span>:<br><br> Tout changement fait dans le planner ne seront pas appliquer amoins que vous clickez '<span style='color:red'>Save</span>'dans le toolbar<br><br> Vous pouvez seulement modifier un terminal ou un trou s'il est <span style='color:red'>Selectionné</span><br><br> Fermez le planner pour observez les modifications sur la bande. Vous pouvez aussi utiliser l'icone Show/Hide UI dans le toolbar pour fermer toutes les fenêtres",
   /*12*/"12<br><br> Sélectionnez un <span style='color:red'>component</span>, <br><br> Pesez <span style='color:red'>'c'</span> pour centrer le component verticalement.<br><br> Pesez <span style='color:red'>'m'</span> pour créer une copie mirroir du component au côté opposé de la bande.<br><br>Pesez <span style='color:red'>'l'</span> pour barrer la position du component, ceci préviens seulement la souris de déplacer le component<br><br> Pesez <span style='color:red'>'CTRL+z'</span> pour revenir en arrière sur un changement sur le planner<br><br> Pesez les <span style='color:red'>'Touches directionnelles'</span> ou <span style='color:red'>'w' 'a' 's' 'd' </span>tpour bouger le component petit par petit. <br><br> Pour un rappel des shortcuts, vous pouvez aller à <span style='color:red'>Help>Shortcuts</span> dans la barre de navigation",
   /*13*/"13<br><br> Ouvrez la fenêtre <span style='color:blue'>Additional notes</span>. <br><br> Ici vous pouvez ajouter toutes les spécification et notes manquantes pour votre item.",
    /**/"Last<br><br> Lorsque vous aurez terminé votre item, clickez sur <span style='color:red'>Submit Project</span> pour aller au menu de soumission et pour démarrer l'envoie de votre demande<br><br> Allez à <span style='color:red'>Edit>Practice</span> pour démarrer un exemple.",
    /**/"Exercise 1<br><br> Make the following band: <br><br> Width: 3in<br>Diameter:10in<br>Power: 500W<br>Voltage: 120V<br>2 Sections equally sized with QuickLatch closing and 0.38in gap length<br>1 Bornier at 30° 1inch offset<br>1 Bornier at 30° 2inch offset<br> One 1.2inch diameter hole at 60° 1.5inch offset <br> One mirrored copy of the first hole<br><br> Write down in the notes the total current draw,  the total power density and your name<br><br> Submit your project",
]

