function socketServer() {
    
    var app = require('express')();
    var morgan = require('morgan');
    var server = require('http').createServer(app);
    var socket = require('socket.io').listen(server);
    var fs = require('fs');
    var port = process.env.port || 52223;
    
    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 } // only log error responses
    }));

    server.listen(port, function () {
            console.log("Start Socket!!!");
        }
    );
    
    app.get("/socket", function (req, res) {
        fs.readFile("./html/socket_html.html", function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });
    
    socket.set('log level', 2);
    socket.on("connection", function (socket) {
        socket.on('kang', function (data) {
            console.log('Client Send Data:', data);
            socket.emit('smart', data);
        });
    });

}

module.exports = socketServer();