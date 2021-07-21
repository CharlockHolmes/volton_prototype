/**
 * Enter value in inch
 */
function arcToDeg_offset(radius, gap){
    return Math.atan(gap/2/radius);
}
let allTypes =[];
function compressData(data, reverse = false){
    // let objC = getContent(data)
    // console.log(objC)
    // return objC;
    // function getContent(item){
    //     const fields = Object.getOwnPropertyNames(item);
    //     let tempItem={};
    //     if(typeof item === 'object' && item !== null){
    //         fields.forEach(field => {
    //            let temp = getContent(item[field])
    //            if(isNaN(field)){ /* If it isnt a number, to prevent having to add numbers to conversion tables */
    //                if(reverse)tempItem[reverseTable[field]] = temp;
    //                else tempItem[conversionTable[field]] = temp;
    //            }
    //            else{ /* If its a number */
    //                 if(reverse)tempItem[field] = temp;
    //                 else tempItem[field] = temp;
    //            }
    //         })
    //     }else {
    //         if(typeof item === 'string' && isNaN(item)) {
    //             if(reverse)return typeRev[item];
    //             else return typeConv[item];
    //         }
    //         return item;
    //     }
    //     return tempItem;
    // }
}

function addType(t){
    let flagt = false;
    for(let i=0;i<allTypes.length;i++){
        if(allTypes[i]==t)flagt=true;
    }
    if(!flagt)allTypes.push(t);
}
/*
const conversionTable={
    angle:'a',
    begin:'b',
    connectors:'c',
    end:'e',
    flipped:'f',
    gaps:'g',
    holes:'h',
    id:'i',
    length:'l',
    offset:'o',
    radius:'ra',
    resolution:'re',
    rotation:'ro',
    sections:'s',
    t:'t',
    terminals:'te',
    thickness:'th',
    width:'w',
}
const reverseTable={
    a:'angle',
    b:'begin',
    c:'connectors',
    e:'end',
    f:'flipped',
    g:'gaps',
    h:'holes',
    i:'id',
    l:'length',
    o:'offset',
    ra:'radius',
    re:'resolution',
    ro:'rotation',
    s:'sections',
    t:'t',
    te:'terminals',
    th:'thickness',
    w:'width',
}
const typeConv = {
    armaturebx_h:'ah',
    armaturebx_v:'av',
    barrel:'b',
    barrel_qlatch:'bq',
    barrel_screw_qlatch:'bs',
    boitier:'bo',
    bornier:'br',
    wire_spring:'ws',
    wire_tress:'wt',
}
const typeRev = {
    ah:'armaturebx_h',
    av:'armaturebx_v',
    b:'barrel',
    bq:'barrel_qlatch',
    bs:'barrel_screw_qlatch',
    bo:'boitier',
    br:'bornier',
    ws:'wire_spring',
    wt:'wire_tress',
}
*/



const compT= [
    [
        'true', 'false', "undefined",'eurov','euroh','tressh','null'
        ,'circle', 'rect', 'vslot' , 'hslot'
        ,'armaturebx_h','armaturebx_v','barrel_qlatch','barrel_screw_qlatch','barrel_screw','barrel','boitier','bornier','wire_spring','wire_tress'
        ,'angle', 'begin', 'connectors', 'end', 'flipped', 'gaps', 'holes', 'length', 'offset', 'radius', 'resolution', 'rotation', 'sections', 'terminals', 'thickness', 'width'
        ,"%22%", "%2C%", "22",   "%3A%", '3A',   '7D', '~!', '%7B%','@2C%$'/*, '~7B%!','oF@*'*/
        ,'screws','%','~7B;$aN@*'
    ],
    [
        'tR', 'fA','uN', 'eV', 'eH','tS','nL'
        ,'cI', 'rC', 'vS', 'hS'
        ,'aH','aV','bQ','bS','bW','bA','bO','bR','wS','wT'         //type converts
        ,'aN', 'bE', 'cO', 'eN','fL','gA','hO','lE','oF','rA','rE','rO','sE', 'tE','tH','wI'  //obj name conv
        ,'@',    '~',    "$",    '_',    '*',    ')' ,  '(', '+'   , "cD" /* ,  ';'  , "" */     
        ,'sS',';','cE'
    ]
]

function compact(str){
    console.log(str);
    for(let i=0; i<compT[0].length; i++){
        str = str.replaceAll(compT[0][i], compT[1][i])
    }
    console.log(str)

    return str;
}
function unpact(str){
    console.log(str)
    for(let i=compT[0].length; i>0; i--){
        str = str.replaceAll(compT[1][i-1], compT[0][i-1])
    }
    console.log(str)
    return str;
}
