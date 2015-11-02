/**
 * @author mrdoob / http://mrdoob.com/
 */

'use strict';

THREE.PointerLockControls = function (camera) {

    // player	
    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);

    var PI_2 = Math.PI / 2;

    var velocity = new THREE.Vector3();

    // listener
    // var moveForward = false;
    // var moveBackward = false;
    // var moveLeft = false;
    // var moveRight = false;

    var onKeyDown = function onKeyDown(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87:
                // w
                moveForward = true;
                break;

            case 37: // left
            case 65:
                // a
                moveLeft = true;break;

            case 40: // down
            case 83:
                // s
                moveBackward = true;
                break;

            case 39: // right
            case 68:
                // d
                moveRight = true;
                break;
        }
    };

    var onKeyUp = function onKeyUp(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87:
                // w
                moveForward = false;
                break;

            case 37: // left
            case 65:
                // a
                moveLeft = false;
                break;

            case 40: // down
            case 83:
                // s
                moveBackward = false;
                break;

            case 39: // right
            case 68:
                // d
                moveRight = false;
                break;

        }
    };

    var onMouseMove = function onMouseMove(event) {

        var movementX = event.movementX || event.mozMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
    document.addEventListener('mousemove', onMouseMove, false);

    this.getObject = function () {
        return yawObject;
    };

    this.update = function (delta) {

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        if (moveForward) velocity.z -= 400.0 * delta;
        if (moveBackward) velocity.z += 400.0 * delta;

        if (moveLeft) velocity.x -= 400.0 * delta;
        if (moveRight) velocity.x += 400.0 * delta;

        this.getObject().translateX(velocity.x * delta);
        this.getObject().translateY(velocity.y * delta);
        this.getObject().translateZ(velocity.z * delta);
    };
};