export default class Light {
    constructor() {
        this.hemiLight = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        this.hemiLight.position.set( 0.5, 1, 0.75 );
        // TODO if there are more lights - add methods to iterate over and add them all
    }

    get() {
        return this.hemiLight;
    }
}
