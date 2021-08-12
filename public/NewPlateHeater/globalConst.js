/**
 * In this file you will find all constant global data as well as some functions that utilises them.
 */

const inchPerUnit = 3;
const MAX_MIN_TYPES = 'inch'
const MAX_WIDTH = 20; 
const MIN_WIDTH = 1;
const MIN_DIAMETER = 1;
const MAX_CIRCOMFERENCE_PER_SECTION = 96;
const MAX_DIAMETER_PER_SECTION = MAX_CIRCOMFERENCE_PER_SECTION / Math.PI;
const FOLDOVER_WIDTH = 0.3; 
const MIN_HOLE_OFFSET = 1/16;
const INCH_PER_UNIT = 3;
const PI = Math.PI;
const CONNECTOR_ANGLE_OFFSET = 0.1;
const STANDARD_GAP_SCREW = [
    {   /* First STD */
        diameter:{
            min:0,
            max:2.5
        },
        gap:{
            single: 0.31,
            multiple:0.25
        },
        barrel:{
            size:'6-32x1.00',
            spring:false,
        },
        tab:{
            size:'10-24x1.00',
            spring:false,
        }
    },
    {   /* Second STD */
        diameter:{
            min:2.5,
            max:4
        },
        gap:{
            single: 0.38,
            multiple:0.38
        },
        barrel:{
            size:'10-24x2.00',
            spring:false,
        },
        tab:{
            size:'10-24x1.50',
            spring:false,
        }
    },
    {   /* Third STD */
        diameter:{
            min:4,
            max:8
        },
        gap:{
            single: 0.5,
            multiple:0.38
        },
        barrel:{
            size:'1/4-20x2.75',
            spring:true,
        },
        tab:{
            size:'10-24x2.00',
            spring:true,
        }
    },
    {   /* Fourth STD */
        diameter:{
            min:8,
            max:12
        },
        gap:{
            single: 0.62,
            multiple:0.38
        },
        barrel:{
            size:'1/4-20x2.75',
            spring:true,
        },
        tab:{
            size:'10-24x2.50',
            spring:true,
        }
    },
    {   /* Fifth STD */
        diameter:{
            min:12,
            max:18
        },
        gap:{
            single: 0.75,
            multiple:0.5
        },
        barrel:{
            size:'1/4-20x2.75',
            spring:true,
        },
        tab:{
            size:'10-24x2.50',
            spring:true,
        }
    },
    {   /* Sixth STD */
        diameter:{
            min:18,
            max:100
        },
        gap:{
            single: 1,
            multiple:0.62
        },
        barrel:{
            size:'1/4-20x3.50',
            spring:true,
        },
        tab:{
            size:'1/4-20x3.50',
            spring:true,
        }
    },
]
/**
 * Standard barrel nut values for width
 */
const STANDARD_BARREL_NUM = [
    {width:0,   num:1},
    {width:2.5, num:2},
    {width:6,   num:3},
    {width:9,   num:4},
    {width:12,  num:5},
    {width:15,  num:6},
    {width:18,  num:7},
]
const STANDARD_TAB_NUM = [
    {width:0,   num:2},
    {width:2.5, num:3},
    {width:6,   num:4},
    {width:9,   num:5},
    {width:12,  num:6},
    {width:15,  num:7},
    {width:18,  num:8},
]
/**
 * 
 * @param {*} width     in INCH 
 * @param {*} diameter  in INCH
 * @param {*} type      gap type;
 * @returns a {gap, screw, num} object
 */
function getStandardData(width, diameter, type){
    let gap;
    let num; 
    let screw;
    if(type=='barrel'||type=='tab'){
        if(type=='barrel'){
            STANDARD_BARREL_NUM.forEach(b=>{
                if(width>=b.width)num = b.num;
            })     
            STANDARD_GAP_SCREW.forEach(b=>{
                if(diameter>=b.diameter.min&&diameter<b.diameter.max){
                    screw = b.barrel;
                    gap = b.gap; 
                }
            })  
        } 
        if(type=='tab'){
            STANDARD_TAB_NUM.forEach(b=>{
                if(width>=b.width)num = b.num;
            })     
            STANDARD_GAP_SCREW.forEach(b=>{
                if(diameter>=b.diameter.min&&diameter<b.diameter.max){
                    screw = b.tab;
                    gap = b.gap; 
                }
            })  
            
        } 
        console.log(gap,screw, num)
        return {gap:gap, screw:screw, num:num};
    }
    return false;
}
function normalizeGap(g){
    let std = 0;
    if(g.t=='tab') std = getStandardData(r.width*inchPerUnit, r.radius*2*inchPerUnit,  'tab')
    else std = getStandardData(r.width*inchPerUnit, r.radius*2*inchPerUnit,  'barrel')
    if(g.begin>2*PI)g.begin-=2*PI;
    if(g.end>2*PI)g.begin-=2*PI;
    let gcenter = (g.begin+g.end)/2;
    let length = 0; 
    if(r.gaps.length>1)length = std.gap.multiple;
    else length = std.gap.single;
    const radius = r.radius*inchPerUnit;
    let gawidth = Math.acos(((radius*radius*2)-(length*length))/(2*radius*radius));
    g.begin = gcenter-gawidth/2;
    g.end = gcenter+gawidth/2;
}

function normalizeGapAngle(g,num,total){
    let offset = gapCenterPerNum[num][total];
    let gcenter = (g.begin+g.end)/2;
    let diff = gcenter - g.begin;
    if(diff>=2*PI)diff-2*PI;
    gcenter = offset;
    g.begin = gcenter - diff;
    g.end = gcenter+diff;
}
const gapCenterPerNum = [
    /*0*/[0,0,0,0             , 0     ,0     ,0       ,0     ],
    /*1*/[0,PI,2*PI/3,PI/2    , 0.4*PI,1/3*PI,1/3.5*PI,1/4*PI],
    /*2*/[0,0,4*PI/3, PI      , 0.8*PI,2/3*PI,2/3.5*PI,2/4*PI],
    /*3*/[0,0,0,3*PI/2        , 1.2*PI,3/3*PI,3/3.5*PI,3/4*PI],
    /*4*/[0,0,0,0             , 1.6*PI,4/3*PI,4/3.5*PI,4/4*PI],
    /*5*/[0,0,0,0             , 0     ,5/3*PI,5/3.5*PI,5/4*PI],
    /*6*/[0,0,0,0             , 0     ,0     ,6/3.5*PI,6/4*PI],
    /*7*/[0,0,0,0             , 0     ,0     ,0       ,7/4*PI],
]
