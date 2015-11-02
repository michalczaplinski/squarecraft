'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = (function (_THREE$PerspectiveCamera) {
    _inherits(Camera, _THREE$PerspectiveCamera);

    function Camera() {
        _classCallCheck(this, Camera);

        _get(Object.getPrototypeOf(Camera.prototype), 'constructor', this).call(this);
    }

    return Camera;
})(THREE.PerspectiveCamera);

var Player = function Player(camera) {
    _classCallCheck(this, Player);

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(pitchObject);

    var PI_2 = Math.PI / 2;
    this.velocity = new THREE.Vector3();
};

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

    function Bullet(controls, camera) {
        _classCallCheck(this, Bullet);

        // TODO remember that the bullet orientation needs to be set as well
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x222222 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.setDirection(controls, camera);
    }

    _createClass(Bullet, [{
        key: 'setDirection',
        value: function setDirection(controls, camera) {
            this.mesh.position.setX(controls.getObject().position.x);
            // 7 is an arbitrary offset here
            this.mesh.position.setY(controls.getObject().position.y + 7);
            this.mesh.position.setZ(controls.getObject().position.z);
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

var Application = (function () {
    function Application() {
        var _this = this;

        _classCallCheck(this, Application);

        this.objects = [];
        this.prevTime = performance.now();
        this.createScene();
        this.createControls();
        window.addEventListener('resize', function (evt) {
            return _this.handleResize(evt);
        }, false);
        this.render();
    }

    _createClass(Application, [{
        key: 'createScene',
        value: function createScene() {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            this.camera.position.y += 10;
            this.camera.rotation.set(0, 0, 0);

            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0xffffff, 0, 2000);

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
        key: 'createControls',
        value: function createControls() {
            this.controls = new THREE.PointerLockControls(this.camera);
            this.scene.add(this.controls.getObject());
        }
    }, {
        key: 'updateControls',
        value: function updateControls() {
            var time = performance.now();
            var delta = (time - this.prevTime) / 1000;
            this.controls.update(delta);
            this.prevTime = time;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            requestAnimationFrame(function () {
                _this2.render();
            });
            this.objects.forEach(function (object) {
                if ('update' in object) {
                    object.update();
                }
            });
            this.updateControls();
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

var Lights = (function () {
    function Lights() {
        _classCallCheck(this, Lights);

        this.hemiLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
        this.hemiLight.position.set(0.5, 1, 0.75);
        // TODO if there are more lights - add methods to iterate over and add them all
    }

    _createClass(Lights, [{
        key: 'get',
        value: function get() {
            return this.hemiLight;
        }
    }]);

    return Lights;
})();

var app = new Application();
app.add(new Floor());
app.add(new Lights());

function shootBullet() {
    app.add(new Bullet(app.controls, app.camera));
}

window.addEventListener('click', shootBullet, false);