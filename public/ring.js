/**
 * radius ratio: 
 * width : total width length 
 * hole radius : proportional to the width. d = 2r
 * hole offset = proportional to the width, starts at the middle;
 */




class Ring {
    constructor(radius, width, resolution,holes = [], gaps = [], terminals = [], connectors = [], thickness = 0.98) {
        this.holes = holes;
        this.radius = radius;
        this.width = width;
        this.resolution = resolution;
        this.gaps = gaps;
        this.connectors = connectors;
        this.terminals = terminals;
        this.thickness = thickness;
    }

    makeShape() {

        console.log("Presort: ", this.holes)
        const width = this.width;
        const resolution = this.resolution;
        const numComponents = 3;
        const numVertices = resolution * 6;
        const nfloats = this.countFloats(resolution, width);
        const positions = new Float32Array(nfloats);
        const indices = [];
        const t = this.thickness;

        let posNdx = 0;
        let ndx = 0;

        let a = 0;
        let da = 2 * Math.PI / resolution;
        //let count = 0;
        this.holes.sort((a, b) => {
            return a.offset - b.offset;
        }); // This sorts the array by offset from higher value to lower value

        /**
         * Here we make the little tab where the screws goes to tighten the ring.
         */
        if (this.gaps.length > 0) {
            this.gaps.forEach(gap => {
                if (gap.type == 'screws') {
                    const x0 = Math.cos(gap.begin) * this.radius;
                    const y0 = Math.sin(gap.begin) * this.radius;
                    const z0 = -width / 2;
                    const z1 = width / 2;
                    makeTriangle(x0, y0, z0, x0 * 1.08, y0 * 1.08, z1);
                }
                if (gap.type == 'screws') {
                    const x0 = Math.cos(gap.end) * this.radius;
                    const y0 = Math.sin(gap.end) * this.radius;
                    const z0 = -width / 2;
                    const z1 = width / 2;
                    makeTriangle(x0, y0, z0, x0 * 1.08, y0 * 1.08, z1);
                }

            });

        }
        /**
         * This loop goes through every angle of the ring starting at 0 radiants.
         * makes as many passes as the resolution indicates. 
         * the angle increases through each loop
         */
        for (let i = 0; i < resolution; i++, a += da) {
            let skip = false;
            this.gaps.forEach(gap => {
                if (a >= gap.begin + Math.PI * 2 && a <= gap.end + Math.PI * 2) skip = true;
                if (a >= gap.begin && a <= gap.end) skip = true;
            });
            if (!skip) {
                const x0 = Math.cos(a) * this.radius;
                const x1 = Math.cos(a + da) * this.radius;
                const y0 = Math.sin(a) * this.radius;
                const y1 = Math.sin(a + da) * this.radius;
                const z0 = -width / 2; // Largeur extérieure a ne pas changer
                const z1 = width / 2;
                const holeOnPass = [];
                // Here we look 
                this.holes.forEach(holeSearch => {
                    const v0 = new THREE.Vector3(x0, y0, holeSearch.offset);
                    const v1 = new THREE.Vector3(x1, y1, holeSearch.offset);
                    const c = new THREE.Vector3(holeSearch.x, holeSearch.y, holeSearch.offset);
                    if (v0.distanceTo(c) < holeSearch.r)
                        if (v1.distanceTo(c) < holeSearch.r) {
                            holeOnPass.push(holeSearch);
                        }
                });

                if (holeOnPass.length > 0) {
                    //console.log("There are adjacent " + holeOnPass.length + " at pass " + i);
                    const v0 = [];
                    const v1 = [];
                    const c = [];
                    const xyDelta = [];
                    const hz = [];
                    //Here look for every hole in the section
                    for (let ii = 0; ii < holeOnPass.length; ii++) {
                        v0.push(new THREE.Vector3(x0, y0, holeOnPass[ii].offset));
                        v1.push(new THREE.Vector3(x1, y1, holeOnPass[ii].offset));
                        c.push(new THREE.Vector3(holeOnPass[ii].x, holeOnPass[ii].y, holeOnPass[ii].offset));
                        xyDelta.push(c[ii].distanceTo(v0[ii]));
                        const alpha = Math.asin(xyDelta[ii] / holeOnPass[ii].r);
                        if (holeOnPass[ii].type == 'square') hz.push(holeOnPass[ii].r);
                        else if (xyDelta[ii] == 0) {
                            hz.push(holeOnPass[ii].r);
                        } else hz.push(xyDelta[ii] / Math.tan(alpha));

                    }
                    // Looking if a hole is in the foldover
                    let leftCheck = true; 
                    let rightCheck = true; 
                    holeOnPass.forEach(hole=>{
                        if(hole.z - hole.r <= z0  )leftCheck = false;
                        if(hole.z + hole.r >= z1 )rightCheck = false;
                    });
                    if(leftCheck)makeFoldover(z0);
                    if(rightCheck)makeFoldover(z1)

                    //Make the ring
                    LimitedmakeTriangle(x0, y0, z0, x1, y1, -hz[0] + holeOnPass[0].offset);
                    for (let x = 0; x < holeOnPass.length - 1; x++) {
                        if(hz[x]+holeOnPass[x].offset<-hz[x + 1] +holeOnPass[x+1].offset)
                        LimitedmakeTriangle(x0, y0, hz[x] + holeOnPass[x].offset, x1, y1, -hz[x + 1] + holeOnPass[x + 1].offset); // in between holes
                    }
                    LimitedmakeTriangle(x0, y0, hz[holeOnPass.length - 1] + holeOnPass[holeOnPass.length - 1].offset, x1, y1, z1);


                } 
                else {
                    makeFoldover(z0);
                    makeFoldover(z1);
                    LimitedmakeTriangle(x0, y0, z0, x1, y1, z1);
                }
                /**
                 * This is the part where you create the over ring on both sides. 
                 */
                function makeFoldover(hz) {
                    const rw = 0.10; // ring width
                    const ro = 0.04; //side offset
                    const rh = 1.015 //elevation
                    makeTriangleSingleZ(x0, y0, x1, y1, hz, hz * (1 - ro), rh); //bottom left to top
                    makeTriangle(x0 * rh, y0 * rh, hz * (1 - ro), x1 * rh, y1 * rh, hz * (1 - rw + ro));
                    makeTriangleSingleZ(x0, y0, x1, y1, hz * (1 - rw), hz * (1 - rw + ro), rh);
                }

                function LimitedmakeTriangle(a, b, c, d, e, f) {
                    let singleZ = true;
                    if (c <= z0) {c = z0;singleZ = false;}
                    if (c >= z1){c = z1;singleZ = false;}
                    if (f <= z0) {f = z0;singleZ = false;}
                    if (f >= z1) {f = z1;singleZ = false;}
                    makeTriangle(a, b, c, d, e, f); // firstt plane
                    makeTriangle(a * t, b * t, c, d * t, e * t, f); // Second plane
                    if(singleZ)makeTriangleSingleZ(a * t, b * t, d * t, e * t, c, c, 1 / t); // in between

                    makeTriangle(a, b, c, d * t, e * t, f); // in between
                }

                // This function generates two triangles and makes vertexes for the mesh between four connected points.

            }
        }

        function makeTriangle(tx0, ty0, tz0, tx1, ty1, tz1) {
            //if(isNaN(tx0)|| isNaN(ty0) || isNaN(tz0) || isNaN(tx1) || isNaN(ty1) || isNaN(tz1) )console.log("NAN detected: ",tx0, ty0, tz0, tx1, ty1, tz1);

            positions.set([tx0, ty0, tz0], posNdx);
            posNdx += numComponents;
            positions.set([tx0, ty0, tz1], posNdx);
            posNdx += numComponents;
            positions.set([tx1, ty1, tz0], posNdx);
            posNdx += numComponents;
            positions.set([tx1, ty1, tz1], posNdx);
            posNdx += numComponents;
            indices.push(
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3, // This is 6 vertexes that are used to create two triangles, which amounts to 1 rectangle. 
            );
            ndx += 4;
        }

        function makeTriangleSingleZ(tx0, ty0, tx1, ty1, tz0, tz1, multi) {
            //if(isNaN(tx0)|| isNaN(ty0) || isNaN(tz0) || isNaN(tx1) || isNaN(ty1) || isNaN(tz1) )console.log("NAN detected: ",tx0, ty0, tz0, tx1, ty1, tz1);

            positions.set([tx0, ty0, tz0], posNdx);
            posNdx += numComponents;
            positions.set([tx1, ty1, tz0], posNdx);
            posNdx += numComponents;
            positions.set([tx0 * multi, ty0 * multi, tz1], posNdx);
            posNdx += numComponents;
            positions.set([tx1 * multi, ty1 * multi, tz1], posNdx);
            posNdx += numComponents;
            indices.push(
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3, // This is 6 vertexes that are used to create two triangles, which amounts to 1 rectangle. 
            );
            ndx += 4;
        }

        return {
            positions,
            indices
        };
    }
    addHole(angle, r, offset, type = 'circle') {
        console.log('adding a hole at', angle, r,offset,type)
        this.holes.push({
            x: Math.cos(angle) * this.radius,
            y: Math.sin(angle) * this.radius,
            z: offset,
            r: r,
            offset: offset,
            type: type,
            angle:angle,

        });
        console.log(this.holes);
        // type can be either vertical slot, horizontal, circle or rectangle
    }
    /**
     * To add a custom gap
     * @param {} begin The start angle, lower value in RAD
     * @param {*} end  The end angle, higher value in RAD
     * @param {*} type Screw or barrel
     * @param {*} options Enter a 'position' for angle begining and a 'angle' for the gap angle
     */
    addGap(begin, end, type = 'screws',options) {
        if(options!==undefined&&options.position!==undefined&&options.angle!==undefined){
            this.gaps.push({
                begin: options.position - options.angle/2,
                end: options.position + options.angle/2,
                type : type,
            })
        }
        else{
            this.gaps.push({
                begin: begin,
                end: end,
                type: type
            });
        }
    }
    /**
     * Loads a connector into the ring
     * @param {*} connector Properties : angle ; type; offset; flipped
     */
    addConnector(connector){
        this.connectors.push(connector);
    }
    addTerminal(terminal){
        this.connectors.push(terminal);
    }
    //Only used to count the space needed to construct the ring
    countFloats(res, width) {
        const resolution = res;

        let posNdx = 0;
        let a = 0;
        let da = 2 * Math.PI / resolution;

        this.holes.sort((a, b) => {
            return a.offset - b.offset;
        }); // This sorts the array by offset from higher value to lower value

        for (let i = 0; i < resolution; i++, a += da) {

            const x0 = Math.cos(a) * this.radius;
            const x1 = Math.cos(a + da) * this.radius;
            const y0 = Math.sin(a) * this.radius;
            const y1 = Math.sin(a + da) * this.radius;
            const holeOnPass = [];
            // Here we look 
            this.holes.forEach(holeSearch => {
                const v0 = new THREE.Vector3(x0, y0, holeSearch.offset);
                const v1 = new THREE.Vector3(x1, y1, holeSearch.offset);
                const c = new THREE.Vector3(holeSearch.x, holeSearch.y, holeSearch.offset);
                if (v0.distanceTo(c) < holeSearch.r)
                    if (v1.distanceTo(c) < holeSearch.r) {
                        holeOnPass.push(holeSearch);
                    }
            });
            posNdx += 12 + 12 * holeOnPass.length;
        }
        console.log(posNdx * 3 + this.gaps.length * 12 * 4);
        return posNdx * 9 + this.gaps.length * 12 * 4;
    }
}