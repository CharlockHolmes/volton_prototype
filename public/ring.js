class Ring{
    makeShape(res, width) {
        const resolution =res;
        const numComponents = 3;
        const numVertices = resolution * 6;
        const positions = new Float32Array(numVertices * numComponents);
        const indices = [];

        let radius = 1;

        let posNdx = 0;
        let ndx = 0;

        let a = 0;
        let da = 2*Math.PI / resolution;
        for (let i = 0; i < resolution; i++, a += da) {
            const x0 = Math.cos(a) * radius;
            const x1 = Math.cos(a + da) * radius;
            const y0 = Math.sin(a) * radius;
            const y1 = Math.sin(a + da) * radius;
            const z0 = -width/2;
            const z1 = width/2;

            positions.set([x0, y0, z0], posNdx);
            posNdx += numComponents;
            positions.set([x0, y0, z1], posNdx);
            posNdx += numComponents;
            positions.set([x1, y1, z0], posNdx);
            posNdx += numComponents;
            positions.set([x1, y1, z1], posNdx);
            posNdx += numComponents;

            indices.push(
                ndx, ndx + 1, ndx + 2,
                ndx + 2, ndx + 1, ndx + 3,
            );
            ndx += 4;
        }
        return {
            positions,
            indices
        };
    }
}