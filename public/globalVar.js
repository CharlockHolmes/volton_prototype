class DomTable {
    constructor(rows) {
        this.rows = rows;
        let ref = document.getElementById('gapdiv');
        ref.innerHTML += this.createTable(this.rows);
        dragElement(document.getElementById("gapboxdrag"));
        document.getElementById('submitgapbutton').onclick = ()=>this.loadTableData();
    }
    createTable(rows) {
        let firstPart = "<div id='gapboxdrag' class = 'draggables'><div id='gapboxdragheader'>Gaps <span class = 'collapsible'>-</span></div><table class='ring-info' style='width:340px;'><tr><td>#</td><td>Angle</td><td>Arc</td><td>Length</td><td>Type</td></tr>"
        let lastPart = "<tr><td id='submitgapbutton'>submit</td></tr></table></div>"
        let middle='';
        for (let i = 0; i < rows; i++) {
            middle += "<tr><td>" + i + "</td><td><input class='input-data'id='gapangle" + i + "'> deg</td><td><input class='input-data'id='gapwidth" + i + "'> deg</td><td><input class='input-data'id='gaparc" + i + "'> in</td><td><select id='gaptype" + i + "' name='Direction' style='width:50px;'><option value='gap'>Gap</option><option value='hinge'>Hinge</option><option value='partial'>Partial</option></select></td></tr>"
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
                r.addGap(undefined, undefined, 'barrel', {position:tangle*2*PI/360, angle:twidth*2*PI/360});
            }
            else {validentries = false; console.log('angle entries are invalid')}
        }
        if(validentries)saveRing();
    }
    uploadTableData(){
        for(let i=0;i<this.rows;i++){
            document.getElementById('gapwidth'+i).value = Math.abs(r.gaps[i].begin-r.gaps[i].end)*360/(2*PI);
            document.getElementById('gapangle'+i).value = (r.gaps[i].begin+r.gaps[i].end)/2*360/(2*PI);
        }
    }
} 
