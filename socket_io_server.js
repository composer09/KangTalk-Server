function socketServer() {

    var port = require("./config.json").socket_server.port;
    var app = require('express')();
    var morgan = require('morgan');
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var fs = require('fs');

    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 } // only log error responses
    }));

    server.listen(port, function () {
        console.log("Start Socket_IO Server!!!");
    });


    app.get("/", function (req, res) {
        fs.readFile("./html/socket_html.html", function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });

    io.on("connection", function (socket) {
        console.log("-----------------------------------");
        console.log("소켓 connection");
        console.log("user-agent : "+socket.client.request.rawHeaders[1]);
        console.log("connection_ID : "+socket.id);
        console.log("connection_IP : "+socket.client.conn.remoteAddress);
        console.log("연결 클라이언트 수 : "+socket.client.conn.server.clientsCount);
        // console.log("방? : "+socket.client.sockets[0].rooms);
        // var id = 'user-agent';
        // console.log(socket.client.request.headers[id]);
        console.log("-----------------------------------");

        socket.on('clientMessage', function (data) {
            console.log('clientMessage:', data);
            //public 통신 자신을 포함한 모든 클라이언트에게 데이터 전달.
            // io.sockets.emit('serverMessage', socket);

            //자신을 제외한 모든 클라이언트에게 데이터 전달.
            socket.broadcast.emit('serverMessage', data);
        });
        socket.on('disconnect', function(){
            console.log('소켓 disconnect');
            console.log(data);
            console.log('disconnectionId : '+socket.id);
            // console.log(socket);
                // var remove_id = usersonline.indexOf(socket.user);
                // console.log(remove_id);
    // usersonline.splice(remove_id, 1);
    // socket.broadcast.emit('usergone', {
    //     'left_user' : socket.username
    // });

        //test

        });


    });

}

module.exports = socketServer();