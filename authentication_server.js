function webServer() {
    var key = require("./cookie_set.json").remember_cookie.key,
    value = require("./cookie_set.json").remember_cookie.value,
    Db = require('mongodb').Db,
    mongoClient = require("mongodb").MongoClient,
    port = require("./config.json").web_server.port,
    express = require("express"),
    app = express(),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    http = require("http").createServer(app),
    fs = require("fs");

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 } // only log error responses
    }));

    http.listen(port, function () {
        console.log("Start Authentication Server!!!");
    });

    app.post("/auto_login", function (request, response) {
        // console.log("리퀘스트헤더 확인: " +request.headers.auto_login_cookie);
        if(value == request.headers.auto_login_cookie){
            response.writeHead(200, {'Content-Type' : 'text/plain'})
            response.end();
        }else{
            response.writeHead(200, { 'Content-Type': 'text/plain'
                ,'Set-Cookie': key+"="+value});
            response.end();
        }
    });

    app.post("/login", function (request, response) {
        var url = require("./config.json").mongo_db.address;
        var resObj = new Object();
        var dbObj = new Object();

        mongoClient.connect(url, function(err, db){
        if(err){ // DB접속 error
            console.log("connection error : "+ err);
        }else{
            db.collection("user").findOne({"userId":request.body.userId
                , "password":request.body.password}
                ,function(err, item){
                    if(item == null){
                        console.log("아이디나 비밀번호를 정확히 입력하세요.");
                        resObj.result = false;
                        resObj.res_message = "아이디나 비밀번호를 정확히 입력하세요."
                        response.writeHead(200, { 'Content-Type': 'text/plain'});
                        response.end(JSON.stringify(resObj));
                    }else{
                        console.log(item.userId);
                        console.log(item.password);
                        resObj.result = true;
                        resObj.res_message = "로그인 되었습니다."
                        resObj.loginUser = item.userId;
                        response.writeHead(200, { 'Content-Type': 'text/plain'
                            ,'Set-Cookie': key+"="+value});
                        response.end(JSON.stringify(resObj));
                    }

                });

}

});

});


app.post("/join", function (request, response) {
    var resObj = new Object();

    if(5 < request.body.userId.length && request.body.userId.length < 19 ){
        if(5 < request.body.password.length && request.body.password.length < 15){
            console.log("first log");
            var dbObj = new Object();
            dbObj.myPhoneNumber = request.body.myPhoneNumber;
            dbObj.userId = request.body.userId;
            dbObj.password = request.body.password;
            sendJoin(dbObj, response);
        }else{
            console.log("second log");

            resObj.result = false;
            resObj.res_message = "아이디와 비밀번호 글자수를 확인해 주세요.";
            responseMessage(resObj, response);
        }
    }else{
        console.log("third log");
        resObj.result = false;
        resObj.res_message = "아이디와 비밀번호 글자수를 확인해 주세요.";
        responseMessage(resObj, response);

    }
});




app.get("/a", function (req, res) {
    fs.readFile("./html/html_a.html", function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

    // app.post("/joinData", function(request, response){
    //     var resObj = new Object();

    //     if(5 < request.body.userId.length && request.body.userId.length < 19 ){
    //         if(5 < request.body.password.length && request.body.password.length < 15){
    //             console.log("첫번째 로그");
    //             var dbObj = new Object();
    //             dbObj.userId = request.body.userId;
    //             dbObj.password = request.body.password;
    //             sendJoin(dbObj, response);
    //         }else{
    //             console.log("두번째 로그");
    //             resObj.result = false;
    //             resObj.res_message = "아이디와 비밀번호 글자수를 확인해 주세요.";
    //             responseMessage(resObj, response);
    //         }
    //     }else{
    //         console.log("세번째 로그");
    //         resObj.result = false;
    //         resObj.res_message = "아이디와 비밀번호 글자수를 확인해 주세요.";
    //         responseMessage(resObj, response);

    //     }
    // });

function sendJoin(data, response){
    var url = require("./config.json").mongo_db.address;
    // var resultObject = {
    //     result : false,
    //     res_message : "",
    //     loginUser : ""
    // }
    var resultObject = new Object();

    mongoClient.connect(url, function(err, db){
        if(err){ // DB접속 error
            console.log("connection error : "+ err);
        }else{
            db.collection("user").findOne({"userId":data.userId}
                ,function(err, item){
                    if(item == null){
                        console.log("없는 아이디다.");

                        //db insert
                        db.collection("user").insert({
                            "userId" : data.userId, "password" : data.password
                            ,"myPhoneNumber" : data.myPhoneNumber
                        }, function(err){
                            console.log("insert error message : "+err);
                            db.close();
                        });
                        //db find
                        resultObject.result = true;
                        resultObject.res_message = "회원 가입이 정상적으로 이뤄졌다."
                        resultObject.loginUser = data.userId;
                        response.writeHead(200, { 'Content-Type': 'text/plain'
                            ,'Set-Cookie': key+"="+value});
                        response.end(JSON.stringify(resultObject));

                    }else{
                        resultObject.result = false;
                        resultObject.res_message = "이미 존재하는 아이디 입니다."
                        response.writeHead(200, { 'Content-Type': 'text/plain'});
                        // console.log(resultObject.res_message);
                        // var a = JSON.stringify(resultObject);
                        // console.log("aaa"+a);
                        // console.log(a.result);
                        // var b = JSON.parse(a);
                        // console.log("bbb"+b);
                        // console.log(b.result);

                        response.end(JSON.stringify(resultObject));
                    }

                });

}

});

}

function responseMessage(data, response){
    response.writeHead(200, { 'Content-Type': 'text/plain'});
    response.end(JSON.stringify(data));
}


}

module.exports = webServer();