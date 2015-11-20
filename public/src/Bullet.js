export default class Bullet {
    // TODO i need to decouple the constructor from the controls
    constructor(player, camera) {
        // TODO remember that the bullet orientation needs to be set as well
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.material = new THREE.MeshBasicMaterial( {color: 0x222222} );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.setDirection(player, camera);
    }
    setDirection(player, camera) {
        this.mesh.position.setX(player.get().position.x )
        // 7 is an arbitrary offset here
        this.mesh.position.setY(player.get().position.y + 7 )
        this.mesh.position.setZ(player.get().position.z )
        this.mesh.direction = camera.getWorldDirection()
        // this.mesh.translateOnAxis(camera.getWorldDirection())
    }

    update() {
        this.mesh.translateOnAxis(this.mesh.direction, 20);
    }

    // TODO add the mesh getter setter to an Abstract Base Class
    get() {
        return this.mesh;
    }
}
