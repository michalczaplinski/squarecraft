'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Player = (function () {
    function Player(camera) {
        var _this = this;

        _classCallCheck(this, Player);

        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(camera);

        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = 10;
        this.yawObject.add(this.pitchObject);

        this.PI_2 = Math.PI / 2;
        this.velocity = new THREE.Vector3();

        this.movementX = 0;
        this.movementY = 0;

        this.prevTime = performance.now();

        PubSub.subscribe('movements', function (msg, data) {
            _this.movementX = data.x;
            _this.movementY = data.y;
            _this.moveForward = data.moveForward;
            _this.moveBackward = data.moveBackward;
            _this.moveLeft = data.moveLeft;
            _this.moveRight = data.moveRight;
        });
    }

    _createClass(Player, [{
        key: 'get',
        value: function get() {
            return this.yawObject;
        }
    }, {
        key: 'updateMouse',
        value: function updateMouse() {
            this.yawObject.rotation.y -= this.movementX * 0.002;
            this.pitchObject.rotation.x -= this.movementY * 0.002;

            this.pitchObject.rotation.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.pitchObject.rotation.x));
        }
    }, {
        key: 'updateKeyboard',
        value: function updateKeyboard() {
            var time = performance.now();
            var delta = (time - this.prevTime) / 1000;

            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            if (this.moveForward) {
                this.velocity.z -= 400.0 * delta;
            }
            if (this.moveBackward) {
                this.velocity.z += 400.0 * delta;
            }

            if (this.moveLeft) {
                this.velocity.x -= 400.0 * delta;
            }
            if (this.moveRight) {
                this.velocity.x += 400.0 * delta;
            }

            this.get().translateX(this.velocity.x * delta);
            this.get().translateY(this.velocity.y * delta);
            this.get().translateZ(this.velocity.z * delta);

            this.prevTime = time;
        }
    }, {
        key: 'update',
        value: function update() {
            this.updateMouse();
            this.updateKeyboard();
        }
    }]);

    return Player;
})();

var Floor = (function () {
    function Floor(settings) {
        _classCallCheck(this, Floor);

        this.geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
        this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        this.material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.createFloor();
    }

    _createClass(Floor, [{
        key: 'createFloor',
        value: function createFloor() {
            for (var i = 0, l = this.geometry.vertices.length; i < l; i++) {
                var vertex = this.geometry.vertices[i];
                vertex.x += Math.random() * 20 - 10;
                vertex.y += Math.random() * 2;
                vertex.z += Math.random() * 20 - 10;
            }
            for (var i = 0, l = this.geometry.faces.length; i < l; i++) {
                var face = this.geometry.faces[i];
                face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
                face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            }
        }

        // TODO add the mesh getter setter to an Abstract Base Class
    }, {
        key: 'get',
        value: function get() {
            return this.mesh;
        }
    }]);

    return Floor;
})();

var Bullet = (function () {
    // TODO i need to decouple the constructor from the controls

    function Bullet(player, camera) {
        _classCallCheck(this, Bullet);

        // TODO remember that the bullet orientation needs to be set as well
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x222222 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.setDirection(player, camera);
    }

    _createClass(Bullet, [{
        key: 'setDirection',
        value: function setDirection(player, camera) {
            this.mesh.position.setX(player.get().position.x);
            // 7 is an arbitrary offset here
            this.mesh.position.setY(player.get().position.y + 7);
            this.mesh.position.setZ(player.get().position.z);
            this.mesh.direction = camera.getWorldDirection();
            // this.mesh.translateOnAxis(camera.getWorldDirection())
        }
    }, {
        key: 'update',
        value: function update() {
            this.mesh.translateOnAxis(this.mesh.direction, 20);
        }

        // TODO add the mesh getter setter to an Abstract Base Class
    }, {
        key: 'get',
        value: function get() {
            return this.mesh;
        }
    }]);

    return Bullet;
})();

var Light = (function () {
    function Light() {
        _classCallCheck(this, Light);

        this.hemiLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        this.hemiLight.position.set(0.5, 1, 0.75);
        // TODO if there are more lights - add methods to iterate over and add them all
    }

    _createClass(Light, [{
        key: 'get',
        value: function get() {
            return this.hemiLight;
        }
    }]);

    return Light;
})();

var Application = (function () {
    function Application() {
        var _this2 = this;

        _classCallCheck(this, Application);

        this.objects = [];
        this.createScene();
        window.addEventListener('resize', function (evt) {
            return _this2.handleResize(evt);
        }, false);
        this.render();
    }

    _createClass(Application, [{
        key: 'createScene',
        value: function createScene() {
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0xffffff, 0, 2000);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            this.camera.position.y += 10;
            this.camera.rotation.set(0, 0, 0);

            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setClearColor(0xffffff);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(this.renderer.domElement);
        }
    }, {
        key: 'handleResize',
        value: function handleResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            requestAnimationFrame(function () {
                _this3.render();
            });
            this.objects.forEach(function (object) {
                if ('update' in object) {
                    object.update();
                }
            });
            this.renderer.render(this.scene, this.camera);
        }
    }, {
        key: 'add',
        value: function add(obj) {
            this.objects.push(obj);
            this.scene.add(obj.get());
        }
    }]);

    return Application;
})();

var app = new Application();

var player = new Player(app.camera);
app.add(player);

app.add(new Floor());
app.add(new Light());

function shootBullet() {
    app.add(new Bullet(player, app.camera));
}

window.addEventListener('click', shootBullet, false);