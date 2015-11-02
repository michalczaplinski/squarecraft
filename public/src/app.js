// class Camera extends THREE.PerspectiveCamera {
//     constructor() {
//         super();
//     }
// }


class Player {
    constructor(camera) {
        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add( camera );

        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = 10;
        this.yawObject.add( pitchObject );

        var PI_2 = Math.PI / 2;
        this.velocity = new THREE.Vector3();

        document.addEventListener( 'mousemove', this.onMouseMove, false );

    }

    getObject() {
    		return this.yawObject;
    }

    onMoveMouse() {
        var movementX = event.movementX || event.mozMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || 0;

        this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;

        this.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
    }

    update() {
        this.update = function(delta) {

            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            if ( moveForward ) this.velocity.z -= 400.0 * delta;
            if ( moveBackward ) this.velocity.z += 400.0 * delta;

            if ( moveLeft ) this.velocity.x -= 400.0 * delta;
            if ( moveRight ) this.velocity.x += 400.0 * delta;

            this.getObject().translateX( this.velocity.x * delta );
            this.getObject().translateY( this.velocity.y * delta );
            this.getObject().translateZ( this.velocity.z * delta );
    }
}


class Floor {
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
            face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        }
    }
    // TODO add the mesh getter setter to an Abstract Base Class
    get() {
        return this.mesh;
    }
}


class Bullet {
    // TODO i need to decouple the constructor from the controls
    constructor(controls, camera) {
        // TODO remember that the bullet orientation needs to be set as well
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.material = new THREE.MeshBasicMaterial( {color: 0x222222} );
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.setDirection(controls, camera);
    }
    setDirection(controls, camera) {
        this.mesh.position.setX(controls.getObject().position.x )
        // 7 is an arbitrary offset here
        this.mesh.position.setY(controls.getObject().position.y + 7 )
        this.mesh.position.setZ(controls.getObject().position.z )
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



class Application {
    constructor() {
        this.objects = [];
        this.prevTime = performance.now();
        this.createScene();
        this.createControls();
        window.addEventListener( 'resize', evt => this.handleResize(evt), false );
        this.render();
    }

    createScene() {
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.y += 10;
        this.camera.rotation.set( 0, 0, 0 );

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xffffff, 0, 2000 );

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

    createControls() {
        this.controls = new THREE.PointerLockControls( this.camera );
        this.scene.add( this.controls.getObject() );
    }

    updateControls() {
        var time = performance.now();
        var delta = ( time - this.prevTime ) / 1000;
        this.controls.update( delta )
        this.prevTime = time;
    }

    render() {
        requestAnimationFrame(() => {
            this.render();
        });
        this.objects.forEach((object) => {
            if ('update' in object) {
                object.update();
            }
        });
        this.updateControls();
        this.renderer.render(this.scene, this.camera);
  }

  add(obj) {
    this.objects.push(obj);
    this.scene.add(obj.get());
  }
}

class Lights {
    constructor() {
        this.hemiLight = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        this.hemiLight.position.set( 0.5, 1, 0.75 );
        // TODO if there are more lights - add methods to iterate over and add them all
    }

    get() {
        return this.hemiLight;
    }
}


let app = new Application();
app.add(new Floor());
app.add(new Lights());

function shootBullet() {
    app.add(new Bullet(app.controls, app.camera));
}

window.addEventListener( 'click', shootBullet, false );
