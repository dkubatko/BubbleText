$(document).ready(setUp());

function setUp() {
    var socket = io.connect('http://localhost:5000');
    socket.on('connect', function() {
        socket.emit('sync', {data: {'id': {{ streamer_id }} }});
    });
    socket.on('update', function() {
        alert("update");
    });
}