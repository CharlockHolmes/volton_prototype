class DomTable {
    constructor(rows, ringRadius, ipu) {
        this.rows = rows;
        this.ref;
        this.pos = null; 
        this.build(rows);
        this.buffer = [];
        this.ringRadius = ringRadius;
        this.inchPerUnit = ipu;
        
    }
    /**
     * This function build the table and replace any preexisting table. It modifies directly the r.gaps array.
     * @param {} num the number of rows to be build in the table 
     */
    build(num, isNew = true){
        if(!isNew)this.saveToBuffer()
        this.rows = num;
        let check = document.getElementById('gapboxdrag');
        if(check!=null)check.remove();
        this.adjustRingGaps(num);

        let ref = document.getElementById('gapdiv');
        ref.innerHTML += this.createTable(num);
        
        this.ref = document.getElementById("gapboxdrag")
        dragElement(this.ref);
        if(this.pos==null)this.pos={top:this.ref.style.top, left:this.ref.style.left}
        else{
            this.ref.style.top = this.pos.top;
            this.ref.style.left = this.pos.left;
        }
        this.create_Arc_Length_Dependency()
        document.getElementById('submitgapbutton').onclick = ()=>this.loadTableData();
        document.getElementById('addgapbutton').onclick = ()=>{this.pos={top:this.ref.style.top, left:this.ref.style.left};this.build(this.rows+1,false)};
        document.getElementById('removegapbutton').onclick = ()=>{if(this.rows>1){this.pos={top:this.ref.style.top, left:this.ref.style.left};this.build(this.rows-1,false);}};
        document.getElementById('gapspan').addEventListener("click", function() {addCollapse(this);});
        if(isNew)this.uploadTableData();
        else this.uploadFromBuffer();
    }
    adjustRingGaps(num){
        while(r.gaps.length!=num){
            let gl = r.gaps.length;
            if(gl<num){
                let cg = r.addGap();
                normalizeGap(cg);
                this.buffer[0].push((Math.abs(cg.begin-cg.end)*360/(2*PI)).toFixed(1));
                this.buffer[1].push(Math.round((cg.begin+cg.end)/2*360/(2*PI)));
                this.buffer[2].push(cg.t);
                console.log(r.gaps)
            }
            if(gl>num)r.gaps.pop();
        }
    }
    
    createTable(rows) {
        let firstPart = "<div id='gapboxdrag'class='dragpos' class = 'draggables'><div id='gapboxdragheader'>Gap / Sections <span id='gapspan'class = 'collapsible'>-</span></div><table class='ring-info' style='width:380px;display:block'><tr><td>#</td><td>Angle</td><td>Arc</td><td>Length</td><td>Type</td></tr>"
        let lastPart = "<tr><td id='submitgapbutton'>submit</td><td id='addgapbutton'>add</td><td id='removegapbutton'>remove</td></tr></table></div>"
        let middle='';
        for (let i = 0; i < rows; i++) {
            middle += "<tr><td>" + (i+1) + "</td><td><input class='input-data'id='gapangle" + i + "'> deg</td><td><input class='input-data'id='gapwidth" + i + "'> deg</td><td><input class='input-data'id='gaplength" + i + "'> in</td><td><select id='gaptype" + i + "' name='type' style='width:50px;'><option value='barrel'>B-Nut</option><option value='qlatch'>Q-latch</option><option value='screws'>Tabs</option><option value='hinge'>Hinge</option><option value='partial'>Partial</option><option value='strap'>Strap</option></select></td></tr>"
        }
        //console.log(firstPart + middle + lastPart)
        return firstPart + middle + lastPart;
    }
    loadTableData(){
        let validentries = true;
        let clearFlag = true;
        for(let i=0;i<this.rows;i++){
            let twidth = document.getElementById('gapwidth'+i).value;
            let tangle = document.getElementById('gapangle'+i).value;
            let ttype = document.getElementById('gaptype'+i).value;
            if(!Number.isFinite(twidth)&&!Number.isFinite(tangle)){
                if(clearFlag){r.gaps = [];clearFlag = false}
                r.addGap(undefined, undefined, ttype, {position:tangle*2*PI/360, angle:twidth*2*PI/360});
            }
            else {validentries = false; console.log('angle entries are invalid')}
        }
        if(validentries){
            loadDefaultConnectorSettings();
            saveRing()
        };
    }
    uploadTableData(){
        for(let i=0;i<this.rows;i++){
            document.getElementById('gapwidth'+i).value = (Math.abs(r.gaps[i].begin-r.gaps[i].end)*360/(2*PI)).toFixed(1);
            this.setGapLength(i);
            document.getElementById('gapangle'+i).value = Math.round((r.gaps[i].begin+r.gaps[i].end)/2*360/(2*PI));
            document.getElementById('gaptype' +i).value = r.gaps[i].t;
        }
    }
    saveToBuffer(){
        this.buffer = [[],[],[]]
        for(let i=0;i<this.rows;i++){
            this.buffer[0].push(document.getElementById('gapwidth'+i).value);
            this.buffer[1].push(document.getElementById('gapangle'+i).value);
            this.buffer[2].push(document.getElementById('gaptype'+i).value);
        }
        
    }
    uploadFromBuffer(){
        let num=0;
        if(this.rows < this.buffer[0].length)num  = this.rows;
        else num = this.buffer[0].length;
        for(let i=0;i<num;i++){
            document.getElementById('gapwidth'+i).value = this.buffer[0][i];
            this.setGapLength(i);
            document.getElementById('gapangle'+i).value = this.buffer[1][i];
            document.getElementById('gaptype' +i).value = this.buffer[2][i];
        }
    }
    create_Arc_Length_Dependency(){
        for(let i=0;i<this.rows;i++){
            document.getElementById('gapwidth'  +i).onchange = (thing)=>this.setGapLength(thing.srcElement.id[thing.srcElement.id.length-1]);
            document.getElementById('gaplength' +i).onchange = (thing)=>this.setGapWidth(thing.srcElement.id[thing.srcElement.id.length-1]);
        }
    }
    setGapLength(index){
        const angle = document.getElementById('gapwidth'  + index).value*2*PI/360;
        const radius = this.ringRadius;
        let length = Math.sqrt(2*(radius*radius)-(2*(radius*radius)*Math.cos(angle)));
        document.getElementById('gaplength'  + index).value=(length*this.inchPerUnit).toFixed(2);
    }
    setGapWidth(index){
        const length = document.getElementById('gaplength'  + index).value;
        const radius = this.ringRadius*inchPerUnit;
        let angle = Math.acos(((radius*radius*2)-(length*length))/(2*radius*radius));
        document.getElementById('gapwidth'  + index).value=(angle*360/(2*PI)).toFixed(1);
    }
} 
