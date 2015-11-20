export default class Camera extends THREE.PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.position.y += 10;
        this.rotation.set( 0, 0, 0 );
    }
}
