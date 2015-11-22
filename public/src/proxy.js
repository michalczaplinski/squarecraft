import 'peerjs'
import 'mroderick/PubSubJS/pubsub'

class ClientConnectionProxy {
    constructor(serverName) {
        this.peer = new Peer('nutella', {host: 'localhost', port: 9000, path: '/api'});
        this.connection = this.peer.connect(serverName);

        PubSub.subscribe( 'userInput', (msg, data) => {
            // TODO: add an error handler
            this.connection.send(data);
        })

        this.connection.on('data', (data) => {
            PubSub.publish('updateFromServer', data)
        })
    }
}

class ServerConnectionProxy {
    constructor(serverName) {
        this.peer = new Peer(serverName, {host: 'localhost', port: 9000, path: '/api'});

        this.peer.on('open', function(id) {
          console.log('My peer ID is: ' + id);
        });

        this.connections = []

        this.peer.on('connection', (connection) => {
            connection.on('data', (data) => {
                PubSub.publish('userInput', data);
            });

            this.connections.push(connection);
        });

        PubSub.subscribe('updateFromServer', (msg, data) => {
            this.connections.forEach( connection => {
                connection.send(data);
            });
        });
    }
}

export ClientConnectionProxy, ServerConnectionProxy
