import 'mroderick/PubSubJS/pubsub'

export default class InputListener {
    constructor() {

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        document.addEventListener( 'keydown', this.onKeyDown, false );
        document.addEventListener( 'keyup', this.onKeyUp, false );
        document.addEventListener( 'mousemove', this.onMouseMove, false );

    }

    onKeyDown( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                this.moveForward = true;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = true;
                break;
        }

        sendInput();
    };

    onKeyUp( event ) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                this.moveForward = false;
                break;
            case 37: // left
            case 65: // a
                this.moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                this.moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                this.moveRight = false;
                break;
        }

        sendInput();
    };

    onMouseMove( event ) {

        this.movementX = event.movementX || event.mozMovementX || 0;
        this.movementY = event.movementY || event.mozMovementY || 0;

        sendInput();

    };

    sendInput() {

        PubSub.publish( 'userInput',
            {
                moveForward: this.moveForward,
                moveBackward: this.moveBackward,
                moveLeft: this.moveLeft,
                moveRight: this.moveRight
                x: this.movementX,
                y: this.movementY,
            }
        );
    }
}
