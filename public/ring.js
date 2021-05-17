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
    }

    makeShape() {
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


        for (let i = 0; i < resolution; i++, a += da) {


            const x0 = Math.cos(a) * this.radius;
            const x1 = Math.cos(a + da) * this.radius;
            const y0 = Math.sin(a) * this.radius;
            const y1 = Math.sin(a + da) * this.radius;
            const z0 = -width / 2; // Largeur extérieure a ne pas changer
            const z1 = width / 2;
            let hole =1 ; 

            this.holes.forEach(holeSearch => {
                const v0 = new THREE.Vector3(x0, y0, holeSearch.offset);
                const v1 = new THREE.Vector3(x1, y1, holeSearch.offset);
                const c = new THREE.Vector3(holeSearch.x, holeSearch.y, holeSearch.offset);
                if (v0.distanceTo(c) < holeSearch.r)
                    if (v1.distanceTo(c) < holeSearch.r) {
                        //console.log(" Hole found", holeSearch);
                        hole = holeSearch;
                    }
            });

            if (hole !=1) {
                //console.log(hole);
                const v0 = new THREE.Vector3(x0, y0, hole.offset);
                const v1 = new THREE.Vector3(x1, y1, hole.offset);
                const c = new THREE.Vector3(hole.x, hole.y, hole.offset);

                const xyDelta = c.distanceTo(v0);
                if (xyDelta == 0) {
                    makeTriangle(x0, y0, hole.r + hole.offset, x1, y1, z1);
                    makeTriangle(x0, y0, z0,x1, y1, -hole.r + hole.offset);
                } else {
                    const alpha = Math.asin(xyDelta / hole.r);
                    const hz = xyDelta / Math.tan(alpha);

                    if(hz + hole.offset> z1)makeTriangle(x0, y0, z1, x1, y1, z1);
                    else makeTriangle(x0, y0, hz + hole.offset, x1, y1, z1);

                    if(-hz + hole.offset< z0)makeTriangle(x0, y0, z0, x1, y1, z0);
                    else makeTriangle(x0, y0, z0,x1, y1, -hz + hole.offset);
                }
            } else makeTriangle(x0, y0, z0, x1, y1, z1);


            // This function generates two triangles and makes vertexes for the mesh between four connected points.
            function makeTriangle(tx0, ty0, tz0, tx1, ty1, tz1) {
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
        return {
            positions,
            indices
        };
    }
    addHole(angle, r, offset, type) {
        this.holes.push({
            x: Math.cos(angle) * this.radius,
            y: Math.sin(angle) * this.radius,
            r: r,
            offset: offset,
            type: type,

        });
        // type can be either vertical slot, horizontal, circle or rectangle
    }



 //Only used to count the space needed to construct the ring
    countFloats(res, width) {
        const resolution = res;
        const numComponents = 3;
        const numVertices = resolution * 6;
        const positions = [];
        const indices = [];

        let posNdx = 0;
        let ndx = 0;

        let a = 0;
        let da = 2 * Math.PI / resolution;


        for (let i = 0; i < resolution; i++, a += da) {


            const x0 = Math.cos(a) * this.radius;
            const x1 = Math.cos(a + da) * this.radius;
            const y0 = Math.sin(a) * this.radius;
            const y1 = Math.sin(a + da) * this.radius;
            const z0 = -width / 2; // Largeur extérieure a ne pas changer
            const z1 = width / 2;
            let hole =1 ; 

            this.holes.forEach(holeSearch => {
                const v0 = new THREE.Vector3(x0, y0, holeSearch.offset);
                const v1 = new THREE.Vector3(x1, y1, holeSearch.offset);
                const c = new THREE.Vector3(holeSearch.x, holeSearch.y, holeSearch.offset);
                if (v0.distanceTo(c) < holeSearch.r)
                    if (v1.distanceTo(c) < holeSearch.r) {
                        //console.log(" Hole found", holeSearch);
                        hole = ()=>holeSearch;
                    }
            });

            if (hole !=1) {
                //console.log(hole);
                const v0 = new THREE.Vector3(x0, y0, hole.offset);
                const v1 = new THREE.Vector3(x1, y1, hole.offset);
                const c = new THREE.Vector3(hole.x, hole.y, hole.offset);

                const xyDelta = c.distanceTo(v0);
                if (xyDelta == 0) {
                    makeTriangle(x0, y0, hole.r + hole.offset, x1, y1, z1);
                    makeTriangle(x0, y0, -hole.r + hole.offset, x1, y1, z0);
                } else {
                    const alpha = Math.asin(xyDelta / hole.r);
                    const hz = xyDelta / Math.tan(alpha);
                    makeTriangle(x0, y0, hz + hole.offset, x1, y1, z1);
                    makeTriangle(x0, y0, -hz + hole.offset, x1, y1, z0);
                }

            } else makeTriangle(x0, y0, z0, x1, y1, z1);


            // This function generates two triangles and makes vertexes for the mesh between four connected points.
            function makeTriangle(tx0, ty0, tz0, tx1, ty1, tz1) {
                
                posNdx += numComponents;
                posNdx += numComponents;
                posNdx += numComponents;
                posNdx += numComponents;

                indices.push(
                    ndx, ndx + 1, ndx + 2,
                    ndx + 2, ndx + 1, ndx + 3, // This is 6 vertexes that are used to create two triangles, which amounts to 1 rectangle. 
                );
                ndx += 4;
            }

        }
        return  posNdx; 
    }
}