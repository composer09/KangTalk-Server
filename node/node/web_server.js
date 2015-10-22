
function webServer() {

    var app = require("express")();
    var morgan = require('morgan');
    var http = require("http")createServer(app);
    var fs = require("fs");

    app.set("port", process.env.port || 52222);
    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 } // only log error responses
    }));


    app.get("/", function (req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Hello Express\n</h1>");
    });
    
    app.get("/a", function (req, res) {
        fs.readFile("./html/html_a.html", function (error, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });
    
    http.listen(app.get("port"), function () {
        console.log("Start ServerRunning!!!");
    });

}
module.exports = webServer();