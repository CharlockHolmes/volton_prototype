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
        //this.uploadTableData();

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
        document.getElementById('submitgapbutton').onclick = ()=>{this.loadTableData(); reload();};
        document.getElementById('addgapbutton').onclick = ()=>{this.pos={top:this.ref.style.top, left:this.ref.style.left};if(this.rows<8)this.build(this.rows+1,false)};
        document.getElementById('removegapbutton').onclick = ()=>{if(this.rows>1){this.pos={top:this.ref.style.top, left:this.ref.style.left};if(this.rows>1)this.build(this.rows-1,false);}};
        document.getElementById('gapspan').addEventListener("click", function() {addCollapse(this);});
        if(isNew||!isNew)this.uploadTableData();
        else this.uploadFromBuffer();
    }
    adjustRingGaps(num){
        if(num<=8)
        while(r.gaps.length!=num){
            let gl = r.gaps.length;
            if(gl<num){
                let cg = r.addGap(undefined,undefined,r.gaps[0].t);
                
                normalizeGap(cg);
                for(let i=0; i<r.gaps.length;i++){
                    normalizeGapAngle(r.gaps[i],[i],r.gaps.length-1)
                }
                
                if(r.gaps.length==2){
                    let ccg = r.gaps[0];
                    normalizeGap(ccg);
                    this.buffer[0][0]=((Math.abs(ccg.begin-ccg.end)*360/(2*PI)).toFixed(1));
                    this.buffer[1][0]=(Math.round((ccg.begin+ccg.end)/2*360/(2*PI)));
                    this.buffer[2][0]=(ccg.t);

                }
                    this.buffer[0].push((Math.abs(cg.begin-cg.end)*360/(2*PI)).toFixed(1));
                    this.buffer[1].push(Math.round((cg.begin+cg.end)/2*360/(2*PI)));
                    this.buffer[2].push(cg.t);
                
                console.log(r.gaps)
            }
            if(gl>num){
                r.gaps.pop();
                for(let i=0; i<r.gaps.length;i++){
                    normalizeGapAngle(r.gaps[i],[i],r.gaps.length-1)
                }
                if(r.gaps.length==1){
                    normalizeGap(r.gaps[0])
                    let ccg = r.gaps[0];
                    this.buffer[0][0]=((Math.abs(ccg.begin-ccg.end)*360/(2*PI)).toFixed(1));
                    this.buffer[1][0]=(Math.round((ccg.begin+ccg.end)/2*360/(2*PI)));
                    this.buffer[2][0]=(ccg.t);
                }
            }
        }
    }
    
    createTable(rows) {
        let firstPart = "<div id='gapboxdrag'class='dragpos' class = 'draggables'><div id='gapboxdragheader'class='headerthing'><span style='background-color:#F4A500; color:black;margin:2px;padding-left:2px;padding-right:2px;border-radius: 2px;'> 3</span> Gap / Sections / Fasteners <span id='gapspan'class = 'collapsible'>-</span></div><table class='ring-info' style='width:380px;display:block'><tr><td>#</td><td>Angle</td><td>Arc</td><td>Length</td><td>Closing</td></tr>"
        let lastPart = "<tr><td id='submitgapbutton'style='background-color:rgb(177, 0, 0);color:white'>Submit</td><td id='addgapbutton'>Add (+)</td><td id='removegapbutton'>Remove (-)</td></tr></table></div>"
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

class ComponentTableManager{
    constructor(){

        this.markerTable = document.getElementById('markertable');
        this.emptyTable = document.getElementById('emptytable');
        
        this.holeTable = document.getElementById('holetable');
        this.holeFields = [];
        this.holeFields.push(document.getElementById('h_angle'))
        this.holeFields.push(document.getElementById('h_height'))
        this.holeFields.push(document.getElementById('h_width'))
        this.holeFields.push(document.getElementById('h_offset'))
        this.holeFields.forEach(h=>{h.onchange =()=>this.changeHole()})

        this.terminalTable = document.getElementById('terminaltable');
        this.terminalFields = [];
        this.terminalFields.push(document.getElementById('c_type'))
        this.terminalFields.push(document.getElementById('c_rotation'))
        this.terminalFields.push(document.getElementById('c_angle'))
        this.terminalFields.push(document.getElementById('c_offset'))
        this.terminalFields.forEach(h=>{h.onchange =()=>this.changeConnector()})

        this.clearTerminal()
        this.clearHole()
        this.hideAll()

    }
    changeHole(){
        shapes.forEach(hole=>{
            if(hole.selected){
                let x = 1/toDeg* document.getElementById('h_angle').value;
                let h = 1/toInch* document.getElementById('h_height').value;
                let w = 1/toInch*document.getElementById('h_width').value;
                let y = 1/toInch* document.getElementById('h_offset').value;
                hole.updateValues(x,y,w,h);
            }
        })
    }

    changeConnector(){
        shapes.forEach(hole=>{
            if(hole.selected){
                if(hole.t!='vslot'||hole.t!='hslot'||hole.t!='rect'||hole.t!='circle'){ 
                    let x = 1/toDeg* document.getElementById('c_angle').value;
                    let y = 1/toInch* document.getElementById('c_offset').value;
                    let rotation = document.getElementById('c_rotation').value *2*PI/360;
                    let type = document.getElementById('c_type').value;
                    if(type!='boitier'){
                        hole.h = 0.7 / (lrwidth * inchPerUnit) * pheight;
                        hole.w = 0.7 / (lrlength * inchPerUnit) * pwidth;
                    }else{
                        hole.h = 1.5 / (lrwidth * inchPerUnit) * pheight;
                        hole.w = 1.5 / (lrlength * inchPerUnit) * pwidth;
                    }
                    hole.updateValues(x,y,undefined,undefined,rotation,type);
                }
            }
        })
    }

    showHole(){
        shapes.forEach(hole=>{
            if(hole.selected){
                if(hole.t=='circle'){
                    document.getElementById('holeheight').style.display = 'none'
                    document.getElementById('holediam').innerHTML = 'Diameter'
                }
                else{
                    document.getElementById('holeheight').style.display = 'table-row'
                    document.getElementById('holediam').innerHTML = 'Width'
                }
            }
        })
        //document.getElementById('componenttitle').innerHTML = 'Hole'
        this.markerTable.style.display = 'none'
        this.emptyTable.style.display = 'none'
        this.holeTable.style.display = 'table'
        this.terminalTable.style.display = 'none'
        this.clearTerminal();
    }
    showTerminal(){
        //document.getElementById('componenttitle').innerHTML = 'Terminal'

        this.markerTable.style.display = 'none'
        this.emptyTable.style.display = 'none'
        this.holeTable.style.display = 'none'
        this.terminalTable.style.display = 'table'
        this.clearHole();
    }
    showMarker(){
        //document.getElementById('componenttitle').innerHTML = 'Component'
        this.markerTable.style.display = 'table'
        this.emptyTable.style.display = 'none'
        this.holeTable.style.display = 'none'
        this.terminalTable.style.display = 'none'
    }
    hideAll(){
        document.getElementById('componenttitle').innerHTML = 'Component'
        this.markerTable.style.display = 'none'
        this.emptyTable.style.display = 'table'
        this.holeTable.style.display = 'none';
        this.terminalTable.style.display = 'none';
    }
    clearTerminal(){
        this.terminalFields.forEach(t=>t.value = '')
    }
    clearHole(){
        this.holeFields.forEach(t=>t.value = '')
    }
}