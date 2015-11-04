'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var InputListener = (function () {
    function InputListener() {
        _classCallCheck(this, InputListener);

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        document.addEventListener('mousemove', this.onMouseMove, false);
    }

    _createClass(InputListener, [{
        key: 'onKeyDown',
        value: function onKeyDown(event) {
            switch (event.keyCode) {
                case 38: // up
                case 87:
                    // w
                    this.moveForward = true;
                    break;
                case 37: // left
                case 65:
                    // a
                    this.moveLeft = true;
                    break;
                case 40: // down
                case 83:
                    // s
                    this.moveBackward = true;
                    break;
                case 39: // right
                case 68:
                    // d
                    this.moveRight = true;
                    break;
            }

            PubSub.publish('keyInput', {
                moveForward: this.moveForward,
                moveBackward: this.moveBackward,
                moveLeft: this.moveLeft,
                moveRight: this.moveRight
            });
        }
    }, {
        key: 'onKeyUp',
        value: function onKeyUp(event) {
            switch (event.keyCode) {
                case 38: // up
                case 87:
                    // w
                    this.moveForward = false;
                    break;
                case 37: // left
                case 65:
                    // a
                    this.moveLeft = false;
                    break;
                case 40: // down
                case 83:
                    // s
                    this.moveBackward = false;
                    break;
                case 39: // right
                case 68:
                    // d
                    this.moveRight = false;
                    break;
            }

            PubSub.publish('keyInput', {
                moveForward: this.moveForward,
                moveBackward: this.moveBackward,
                moveLeft: this.moveLeft,
                moveRight: this.moveRight
            });
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(event) {

            var movementX = event.movementX || event.mozMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || 0;

            // player - publish to channel

            // console.log(movementX, movementY)

            PubSub.publish('mouseMovement', {
                x: movementX,
                y: movementY
            });
        }
    }]);

    return InputListener;
})();

var inputListener = new InputListener();