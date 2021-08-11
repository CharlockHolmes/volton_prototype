class Summary{
    constructor(){
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
        str +='<br><br>';
        str += "Voltage:"+item.voltage+'V<br>';
        str += "Power:"+item.power+'W<br>';
        str += "Diameter:"+ring.radius*2*3+'inch<br>';
        str += "Width:"+ring.width*3+'inch<br>';
        str += "Type:"+item.type+'<br>';
        str += "Holes:"+ring.holes.length+'<br>';
        str += "Connectors:"+ring.terminals.length+'<br>';
        str += "id:"+num+'<br>';
        str += item.text+'<br>'

        let t = new HeatingItem(num, str, item.quantity)
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
        this.ref.style.left = '100px'
        this.createButtons()
    }

    createButtons(){
        let str = '<div style="position:relative;left:200px;top:-75px;"><button id="remove'+this.id+'">Remove</button>  <button id="modify'+this.id+'">Modify</button>      <button id="add'+this.id+'">+</button><input max="999"min="1"type="number"style = "width: 30px"id="quant'+this.id+'" value = "'+this.quantity+'"><button id="sub'+this.id+'">-</button></div>'
        this.ref.innerHTML+=str;

        document.getElementById('remove'+this.id).onclick = ()=>{localStorage.removeItem('item'+this.id);document.getElementById('item'+this.id).remove()}
        document.getElementById('modify'+this.id).onclick = ()=>{let i = JSON.parse(localStorage.getItem('item'+this.id));localStorage.setItem('ring', JSON.stringify(i.ring));localStorage.setItem('cartIndex',this.id);window.location.pathname = '/NewMicaBand/'}
        document.getElementById('add'+this.id).onclick = ()=>{this.quantity++;document.getElementById('quant'+this.id).value++;this.loadQuantity();}
        document.getElementById('sub'+this.id).onclick = ()=>{if(this.quantity>1){this.quantity--;document.getElementById('quant'+this.id).value--;this.loadQuantity();}}
        document.getElementById('quant'+this.id).onchange = ()=>{this.loadQuantity();}
    }

    loadQuantity(){
        let item = JSON.parse(localStorage.getItem('item'+this.id))
        item.quantity = document.getElementById('quant'+this.id).value;
        localStorage.setItem('item'+this.id,JSON.stringify(item))

    }
}


