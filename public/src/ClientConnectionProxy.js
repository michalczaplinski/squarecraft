import 'peerjs'

export default class ClientConnectionProxy {
    constructor(serverName) {

        let connection = peer.connect(serverName);

        PubSub.subscribe( 'userInput', (msg, data) => {
            // TODO: add an error handler
            connection.send(data);
        })

        connection.on('data', function(data) {
            PubSub.publish('serverUpdate', data)
        })
    }
}
