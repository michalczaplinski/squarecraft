class Camera extends THREE.PerspectiveCamera {
    constructor() {
        super(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.position.y += 10;
        this.rotation.set( 0, 0, 0 );
    }
}

class Player {
    constructor(camera) {
        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add( camera );

        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = 10;
        this.yawObject.add( this.pitchObject );

        this.PI_2 = Math.PI / 2;
        this.velocity = new THREE.Vector3();

        this.movementX = 0;
        this.movementY = 0;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.prevTime = performance.now()

        //
        this.avatar = new THREE.Mesh(
            new THREE.CubeGeometry( 20, 20, 20 ),
            new THREE.MeshNormalMaterial( {color: 0x222222} )
        );
	    this.avatar.position.y = 10;
        this.avatar.position.z = 1;

	   this.yawObject.add( this.avatar );

        PubSub.subscribe( 'keyInput', (msg, data) => {
            this.moveForward = data.moveForward;
            this.moveBackward = data.moveBackward;
            this.moveLeft = data.moveLeft;
            this.moveRight = data.moveRight;
        });

        PubSub.subscribe( 'mouseMovement', (msg, data) => {
            this.movementX = data.x;
            this.movementY = data.y;
        })
    }

    get() {
    	return this.yawObject;
    }

    updateMouse() {
        this.yawObject.rotation.y -= this.movementX * 0.002;
        this.pitchObject.rotation.x -= this.movementY * 0.002;
        this.pitchObject.rotation.x = Math.max( - this.PI_2, Math.min( this.PI_2, this.pitchObject.rotation.x ) );
    }

    updateKeyboard() {
        var time = performance.now();
        var delta = ( time - this.prevTime ) / 1000;

        console.log(this.moveForward);

        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        if ( this.moveForward ) { this.velocity.z -= 400.0 * delta; }
        if ( this.moveBackward ) { this.velocity.z += 400.0 * delta; }

        if ( this.moveLeft ) { this.velocity.x -= 400.0 * delta; }
        if ( this.moveRight ) { this.velocity.x += 400.0 * delta; }

        this.get().translateX( this.velocity.x * delta );
        this.get().translateY( this.velocity.y * delta );
        this.get().translateZ( this.velocity.z * delta );

        this.prevTime = time;
    }

    update() {
        this.updateMouse();
        this.updateKeyboard();
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

class Light {
    constructor() {
        this.hemiLight = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        this.hemiLight.position.set( 0.5, 1, 0.75 );
        // TODO if there are more lights - add methods to iterate over and add them all
    }

    get() {
        return this.hemiLight;
    }
}


class Application {
    constructor(camera) {
        this.objects = [];
        this.createScene();
        window.addEventListener( 'resize', evt => this.handleResize(evt), false );
        this.camera = camera;
        this.render();
    }

    createScene() {
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

    render() {
        requestAnimationFrame(() => {
            this.render();
        });
        this.objects.forEach((object) => {
            if ('update' in object) {
                object.update();
            }
        });
        this.renderer.render(this.scene, this.camera);
  }

  //TODO we could probably optimize by not adding the objects twice... 
  add(obj) {
    this.objects.push(obj);
    this.scene.add(obj.get());
  }
}


let camera = new Camera();
let app = new Application(camera);
let player = new Player(camera)
let floor = new Floor();
let light = new Light();

app.add(player);
app.add(floor);
app.add(light);


function shootBullet() {
    app.add(new Bullet(player, camera));
}

window.addEventListener( 'click', shootBullet, false );
