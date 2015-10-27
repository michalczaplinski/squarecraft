'use strict';

$(document).ready(function () {

    $('#createServer').on('click', function () {
        createServer();
    });

    $('#connectToServer').on('click', function () {
        connectToServer();
    });
});

function createServer() {

    var serverName = document.getElementById('createServerName').value;
    var peer = new Peer(serverName, { host: 'localhost', port: 9000, path: '/api' });

    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });

    peer.on('connection', function (conn) {
        console.log('there was a connection from ' + conn.peer);
    });
}

function connectToServer() {

    var serverName = document.getElementById('connectToServerName').value;
    var peer = new Peer('nutella', { host: 'localhost', port: 9000, path: '/api' });
    var conn = peer.connect(serverName);
}