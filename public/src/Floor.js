export default class Floor {
    constructor(settings) {
        this.geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
        this.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
        this.material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.createFloor();
    }

    createFloor() {
        for ( var i = 0, l = this.geometry.vertices.length; i < l; i ++ ) {
            var vertex = this.geometry.vertices[ i ];
            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 20 - 10;
        }
        for ( var i = 0, l = this.geometry.faces.length; i < l; i ++ ) {
            var face = this.geometry.faces[ i ];
            face.vertexColors[ 0 ] = new THREE.Color()
              .setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 1 ] = new THREE.Color()
              .setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 2 ] = new THREE.Color()
              .setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        }
    }
    // TODO add the mesh getter setter to an Abstract Base Class
    get() {
        return this.mesh;
    }
}
