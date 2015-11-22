import THREE from 'three.js'
import MethodNotImplementedError from './errors'

import InputListener from './InputListener'
import Player from './Player';
import Camera from './Camera';
import Floor from './Floor';
import Bullet from './Bullet';
import Light from './Light';


class Application {
    constructor(camera) {
        this.objects = [];
        this.createScene();
        this.camera = camera;
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xffffff, 0, 2000 );
    }

    update() {
        throw new MethodNotImplementedError()
    }

    //TODO we could probably optimize by not adding the objects twice...
    add(obj) {
        this.objects.push(obj);
        this.scene.add(obj.get());
    }
}


class serverApplication extends Application {
    constructor() {
        super();
    }

    upackClientData() {
        // here goes the code that unpacks the client data... ?
    }

    updatePositions(newPositions) {
        this.objects.forEach((object) => {
            if ('updatePosition' in object) {
                object.updatePosition();
            }
        });
    }

    createNewObjects() {
        // TODO: code here
    }

}


class ClientApplication extends Application {
    constructor(camera) {
        super(camera);
        // TODO: put the renderer into its own class and handleResize there
        window.addEventListener( 'resize', evt => this.handleResize(evt), false );
        this.createRenderer();
        this.render();
    }
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor( 0xffffff );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    render() {
        requestAnimationFrame(() => {
            this.render();
        });
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        this.objects.forEach((object) => {
            if ('update' in object) {
                object.update();
            }
        });
    }

}


let camera = new Camera();
let app = new ClientApplication(camera);
let player = new Player(camera)
let floor = new Floor();
let light = new Light();
let inputListener = new InputListener();

app.add(player);
app.add(floor);
app.add(light);


function shootBullet() {
    app.add(new Bullet(player, camera));
}

window.addEventListener( 'click', shootBullet, false );
