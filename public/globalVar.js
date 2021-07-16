class DomTable {
    constructor(rows) {
        this.rows = rows;
        this.build(rows)
        
    }
    /**
     * This function build the table and replace any preexisting table. It modifies directly the r.gaps array.
     * @param {} num the number of rows to be build in the table 
     */
    build(num){
        this.rows = num;
        let check = document.getElementById('gapboxdrag');
        if(check!=null)check.remove();
        this.adjustRingGaps(num);

        let ref = document.getElementById('gapdiv');
        ref.innerHTML += this.createTable(num);
        dragElement(document.getElementById("gapboxdrag"));
        document.getElementById('submitgapbutton').onclick = ()=>this.loadTableData();
        document.getElementById('gapspan').addEventListener("click", function() {addCollapse(this);});
    }
    adjustRingGaps(num){
        while(r.gaps.length!=num){
            let gl = r.gaps.length;
            if(gl<num)r.addGap();
            if(gl>num)r.gaps.pop();
        }
    }
    createTable(rows) {
        let firstPart = "<div id='gapboxdrag' class = 'draggables'><div id='gapboxdragheader'>Gaps <span id='gapspan'class = 'collapsible'>-</span></div><table class='ring-info' style='width:340px;'><tr><td>#</td><td>Angle</td><td>Arc</td><td>Length</td><td>Type</td></tr>"
        let lastPart = "<tr><td id='submitgapbutton'>submit</td></tr></table></div>"
        let middle='';
        for (let i = 0; i < rows; i++) {
            middle += "<tr><td>" + i + "</td><td><input class='input-data'id='gapangle" + i + "'> deg</td><td><input class='input-data'id='gapwidth" + i + "'> deg</td><td><input class='input-data'id='gaparc" + i + "'> in</td><td><select id='gaptype" + i + "' name='type' style='width:50px;'><option value='barrel'>B-Nut</option><option value='qlatch'>Q-latch</option><option value='screws'>Tabs</option><option value='hinge'>Hinge</option><option value='partial'>Partial</option></select></td></tr>"
        }
        console.log(firstPart + middle + lastPart)
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
            document.getElementById('gapwidth'+i).value = Math.abs(r.gaps[i].begin-r.gaps[i].end)*360/(2*PI);
            document.getElementById('gapangle'+i).value = (r.gaps[i].begin+r.gaps[i].end)/2*360/(2*PI);
            document.getElementById('gaptype'+i).value = r.gaps[i].t;
        }
    }
} 
