/**
 * radius ratio: 
 * width : total width length 
 * hole radius : proportional to the width. d = 2r
 * hole offset = proportional to the width, starts at the middle;
 */


class Ring {
    constructor(radius, width, resolution) {
        this.holes = [];
        this.radius = radius;
        this.width = width;
        this.resolution = resolution;
        this.gaps = [];
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


        let posNdx = 0;
        let ndx = 0;

        let a = 0;
        let da = 2 * Math.PI / resolution;

        let count = 0;


        this.holes.sort((a, b) => {
            return a.offset - b.offset;
        }); // This sorts the array by offset from higher value to lower value


        for (let i = 0; i < resolution; i++, a += da) {
            let skip = false;
            this.gaps.forEach(gap => {
                if (a >= gap.begin && a <= gap.end) skip = true;
            });
            if (!skip) {
                const x0 = Math.cos(a) * this.radius;
                const x1 = Math.cos(a + da) * this.radius;
                const y0 = Math.sin(a) * this.radius;
                const y1 = Math.sin(a + da) * this.radius;
                const z0 = -width / 2; // Largeur extérieure a ne pas changer
                const z1 = width / 2;
                let adjacentCount = 0;
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
                count += 12;

                if (holeOnPass.length > 1) {
                    //console.log("There are adjacent " + holeOnPass.length + " at pass " + i);
                    const v0 = [];
                    const v1 = [];
                    const c = [];
                    const xyDelta = [];
                    const hz = [];

                    for (let ii = 0; ii < holeOnPass.length; ii++) {
                        v0.push(new THREE.Vector3(x0, y0, holeOnPass[ii].offset));
                        v1.push(new THREE.Vector3(x1, y1, holeOnPass[ii].offset));
                        c.push(new THREE.Vector3(holeOnPass[ii].x, holeOnPass[ii].y, holeOnPass[ii].offset));
                        xyDelta.push(c[ii].distanceTo(v0[ii]));
                        const alpha = Math.asin(xyDelta[ii] / holeOnPass[ii].r); // Measures the angle
                        if (xyDelta[ii] == 0) {
                            hz.push(holeOnPass[ii].r);
                            console.log("there is a 0")
                        } else hz.push(xyDelta[ii] / Math.tan(alpha));

                    }

                    LimitedmakeTriangle(x0, y0, z0, x1, y1, -hz[0] + holeOnPass[0].offset);
                    for (let x = 0; x < holeOnPass.length - 1; x++) {

                        LimitedmakeTriangle(x0, y0, hz[x] + holeOnPass[x].offset, x1, y1, -hz[x + 1] + holeOnPass[x + 1].offset); // in between holes
                    }
                    LimitedmakeTriangle(x0, y0, hz[holeOnPass.length - 1] + holeOnPass[holeOnPass.length - 1].offset, x1, y1, z1);


                    function LimitedmakeTriangle(a, b, c, d, e, f) {
                        if (c < z0) c = z0;
                        if (c > z1) c = z1;
                        if (f < z0) f = z0;
                        if (f > z1) f = z1;
                        makeTriangle(a, b, c, d, e, f);
                    }


                } else if (holeOnPass[0] != null) {
                    const hole = holeOnPass[0];
                    //console.log(hole);
                    const v0 = new THREE.Vector3(x0, y0, hole.offset);
                    const v1 = new THREE.Vector3(x1, y1, hole.offset);
                    const c = new THREE.Vector3(hole.x, hole.y, hole.offset);
                    const xyDelta = c.distanceTo(v0);

                    if (xyDelta == 0) { // if on the pass line
                        makeTriangle(x0, y0, hole.r + hole.offset, x1, y1, z1); // Make a radius cut
                        makeTriangle(x0, y0, z0, x1, y1, -hole.r + hole.offset); //
                    } else {
                        const alpha = Math.asin(xyDelta / hole.r); // Measures the angle 
                        const hz = xyDelta / Math.tan(alpha); // hz : The z value differential from the center point

                        if (hz + hole.offset > z1) makeTriangle(x0, y0, z1, x1, y1, z1); // If cut is outside of the ring, do a line joint
                        else makeTriangle(x0, y0, hz + hole.offset, x1, y1, z1); // Make The positive side cut 

                        if (-hz + hole.offset < z0) makeTriangle(x0, y0, z0, x1, y1, z0); // Outside Check
                        else makeTriangle(x0, y0, z0, x1, y1, -hz + hole.offset); // Negative cut
                    }
                } else makeTriangle(x0, y0, z0, x1, y1, z1);

                // This function generates two triangles and makes vertexes for the mesh between four connected points.
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
            }
        }
        return {
            positions,
            indices
        };
    }
    addHole(angle, r, offset, type = 'circle') {
        this.holes.push({
            x: Math.cos(angle) * this.radius,
            y: Math.sin(angle) * this.radius,
            r: r,
            offset: offset,
            type: type,

        });
        console.log(this.holes);
        // type can be either vertical slot, horizontal, circle or rectangle
    }

    addGap(begin, end) {
        this.gaps.push({
            begin: begin,
            end: end
        });
    }



    //Only used to count the space needed to construct the ring
    countFloats(res, width) {
        const resolution = res;
        const numComponents = 3;
        const indices = [];

        let posNdx = 0;
        let ndx = 0;

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
            posNdx += 12 + 12 * holeOnPass.length;
        }
        console.log(posNdx);
        return posNdx;
    }
}