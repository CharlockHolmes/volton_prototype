class Summary{
    constructor(){
        this.things = [];
        this.items = [];
        this.nums = [];
        this.getItems();
        this.showItems();
    }
    getItems(){
       // var items = [];
        var keys = Object.keys(localStorage)
        keys.forEach(k=>{
            console.log(k)
            if(k[0]=='i'&&k[1]=='t'&&k[2]=='e'&&k[3]=='m'){
                this.items.push(JSON.parse(localStorage.getItem(k)))
                let i = k.replace('item','');
                this.nums.push(i)
            }
        })
    }
    showItems(){
        for(let i = this.items.length-1; i>=0;i--){
            this.itemSummary(this.items[i], this.nums[i])
        }
    }

    itemSummary(item, num){
        let ref = document.getElementById('listi')
 

        if(item.quantity == undefined) {
            item.quantity = 1;
            localStorage.setItem('item'+num, JSON.stringify(item))
        }
        //console.log(item.quantity)
        const ring = item.ring;
        let str = '';
        let bkrad = 'background: radial-gradient(circle, rgba(255,255,255,1) 11%, rgba(255,255,255,0.7931547619047619) 49%, rgba(0,212,255,0) 100%);'
        let bkrad2 = 'background: linear-gradient(90deg, rgba(26,64,130,1) 24%, rgba(247,181,0,1) 100%);'
        str +='<br><br><div style="'+bkrad2+'display:inline-block; background-color:#1A4082; width:100%">';
        let ww = window.innerWidth *0.2+'px';
        let wh = window.innerHeight *0.2+'px';
        str +='<image style = "'+bkrad+'border:2px;width:'+ww+'; height:'+wh+'; position:relative; float:left; z-index:10" id="image'+num+'"></image>';
        str += "<div style='margin:10px;padding:20px;position:relative;float:left; background-color:#1A4082; color:#F7B500'>";
        str += "<pre>Voltage   : "+item.voltage+'V<br>';
        str += "Power     : "+item.power+'W<br>';
        str += "Diameter  : "+ring.radius*2*3+'inch<br>';
        str += "Width     : "+ring.width*3+'inch<br>';
        str += "Type      : "+item.type+'<br>';
        str += "Holes     : "+ring.holes.length+'<br>';
        str += "Connectors: "+ring.terminals.length+'<br>';
        str += "id        : "+num+'<br></pre>';
        str += "Notes     : "+item.text+'<br>'
        str += '</div></div>'


        this.things.push(new HeatingItem(num, str, item.quantity))
        //ref.innerHTML+= str;
    }
}

class HeatingItem{
    constructor(id, summary,quantity=1){
        this.quantity = quantity;
        this.id = id;
        this.ref = document.createElement('div')
        this.ref.id = 'item'+id
        document.getElementById('listi').appendChild(this.ref)
        this.ref.innerHTML = summary;

        this.ref.style.position = 'relative'
        this.ref.style.left = '5px'
        this.createButtons()

        document.getElementById('image'+this.id).src = JSON.parse(localStorage.getItem('image'+this.id))

    }

    createButtons(){
        let str = '<div style="position:relative;left:100px;top:-10px;z-index:11;"><button id="remove'+this.id+'">Remove</button>  <button id="modify'+this.id+'">Modify</button>      <button id="add'+this.id+'">+</button><input max="999"min="1"type="number"style = "width: 30px"id="quant'+this.id+'" value = "'+this.quantity+'"><button id="sub'+this.id+'">-</button></div>'
        this.ref.innerHTML+=str;

        document.getElementById('remove'+this.id).onclick = ()=>{this.removeSelf()}
        document.getElementById('modify'+this.id).onclick = ()=>{let i = JSON.parse(localStorage.getItem('item'+this.id));localStorage.setItem('ring', JSON.stringify(i.ring));localStorage.setItem('cartIndex',this.id);window.location.pathname = '/NewMicaBand/'}
        document.getElementById('add'+this.id).onclick = ()=>{this.quantity++;document.getElementById('quant'+this.id).value++;this.loadQuantity();}
        document.getElementById('sub'+this.id).onclick = ()=>{if(this.quantity>1){this.quantity--;document.getElementById('quant'+this.id).value--;this.loadQuantity();}}
        document.getElementById('quant'+this.id).onchange = ()=>{this.loadQuantity();}
    }

    removeSelf(){
        localStorage.removeItem('item'+this.id);localStorage.removeItem('image'+this.id);document.getElementById('item'+this.id).remove()
    }
    loadQuantity(){
        let item = JSON.parse(localStorage.getItem('item'+this.id))
        item.quantity = document.getElementById('quant'+this.id).value;
        localStorage.setItem('item'+this.id,JSON.stringify(item))

    }
}


