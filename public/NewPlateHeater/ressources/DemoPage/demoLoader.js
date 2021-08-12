class TerminalDemo {
    constructor(type){
        this.canvas = document.getElementById('canvas'+type);
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(200,200);
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera.position.z = 12;
        const color = 0xFFFFFF;
        const intensity = 1; 
        let light = new THREE.DirectionalLight(color, intensity);
        let light1 = new THREE.DirectionalLight(color, intensity);
        let light2 = new THREE.DirectionalLight(color, intensity);
        light.position.z = 10
        light1.position.x = 14
        light2.position.x = -14
        light2.position.z = -10
        this.scene.add(light);
        this.scene.add(light1);
        this.scene.add(light2);
        this.loadTerminal(type);
        this.render();
    }
    loadTerminal(name = 'bornier') {
        const loader = new THREE.GLTFLoader();
        loader.load('../'+name+'.glb', //'ressources/bornier.glb',
            (gltf) => {
        
                gltf.scene.scale.x = 0.125;
                gltf.scene.scale.y = 0.125;
                gltf.scene.scale.z = 0.125;
                gltf.scene.position.y = -2;

                // gltf.scene.traverse(o=>{
                //     if(o.material!=null){
                //         //o.material.color = {r:0.5, g:0.5,b:1};
                //         o.material.color = {r:0.9, g:0.99,b:0.99};
                //     }
                // })
                this.scene.add(gltf.scene);
                console.log(gltf.scene)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (error) => {
                console.log('An error happened')
            });
    }
    render(){
        this.renderer.render(this.scene, this.camera);
        //console.log('ren')
        this.controls.update(); 
    }
}