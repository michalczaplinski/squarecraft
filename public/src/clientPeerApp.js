import 'jquery'
import { ClientConnectionProxy, ServerConnectionProxy } from './proxy'

$(document).ready(function() {

    $('#createServer').on('click', function() {
        createServer();
    })

    $('#connectToServer').on('click', function() {
        connectToServer();
    })
});

function createServer() {

    let serverName = document.getElementById('createServerName').value;
    let serverProxy = new ServerConnectionProxy(serverName);
}

function connectToServer() {

    let serverName = document.getElementById('connectToServerName').value;
    let clientProxy = new ClientConnectionProxy(serverName);

}
