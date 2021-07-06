/**
 * In this file you will find all constant global data as well as some functions that utilises them.
 */

const inchPerUnit = 3;
const MAX_MIN_TYPES = 'inch'
const MAX_WIDTH = 12; 
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