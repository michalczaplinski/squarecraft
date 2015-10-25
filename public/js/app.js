'use strict';

var camera, scene, renderer, controls, geometry, material, mesh, controls;

var objects = [];
var bullets = [];
var prevTime = performance.now();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.y += 10;

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffffff, 0, 2000);

var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
light.position.set(0.5, 1, 0.75);
scene.add(light);

var controls = new THREE.PointerLockControls(camera);
scene.add(controls.getObject());

// floor

geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

for (var i = 0, l = geometry.vertices.length; i < l; i++) {

    var vertex = geometry.vertices[i];
    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;
}

for (var i = 0, l = geometry.faces.length; i < l; i++) {

    var face = geometry.faces[i];
    face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
}

material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', shootBullet, false);

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = event.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function shootBullet(event) {

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x222222 });
    var bullet = new THREE.Mesh(geometry, material);

    scene.add(bullet);

    bullet.position.setX(controls.getObject().position.x);
    bullet.position.setY(controls.getObject().position.y);
    bullet.position.setZ(controls.getObject().position.z);

    bullet.direction = camera.getWorldDirection();

    bullets.push(bullet);
}

function updateBullets(bullets) {

    bullets.forEach(function (bullet, index, array) {
        bullet.translateOnAxis(bullet.direction, 10);
    });
}

var socket = io.connect('http://localhost:3000');

function sendState() {
    socket.emit('gameState', { position: controls.getObject().position });
}

window.addEventListener('click', sendState, false);

function animate() {

    requestAnimationFrame(animate);

    var time = performance.now();
    var delta = (time - prevTime) / 1000;
    controls.update(objects, delta);

    prevTime = time;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    updateBullets(bullets);

    renderer.render(scene, camera);
}