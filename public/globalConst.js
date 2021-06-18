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

const STANDARD_CONNECTOR = [
    {   /* First STD */
        diameter:{
            min:0,
            max:2.49
        },
        gap:{
            single: 0.31,
            multiple:0.25
        },
        barrel:{
            num:1,
            size:'6-32x1.00',
            spring:false,
        },
        tab:{
            num:1,
            size:'10-24x1.00',
            spring:false,
        }
    },
    {   /* Second STD */
        diameter:{
            min:2.5,
            max:3.99
        },
        gap:{
            single: 0.38,
            multiple:0.38
        },
        barrel:{
            num:1,
            size:'10-24x2.00',
            spring:false,
        },
        tab:{
            num:1,
            size:'10-24x1.50',
            spring:false,
        }
    },
    {   /* Third STD */
        diameter:{
            min:4,
            max:7.99
        },
        gap:{
            single: 0.5,
            multiple:0.38
        },
        barrel:{
            num:1,
            size:'1/4-20x2.75',
            spring:true,
        },
        tab:{
            num:1,
            size:'10-24x1.50',
            spring:false,
        }
    },
]