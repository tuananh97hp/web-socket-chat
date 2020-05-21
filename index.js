var express = require("express");

var $ = require('jquery');

var app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");




var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3004);


var users = [];

io.on("connection", function(socket) {
    console.log(socket.id);

    socket.on('create_user_chat', (username) => {
        console.log(username);

        if (users.indexOf(username) < 0) {

            users.push(username);
            socket.Username = username;

            socket.emit('alert_create', [1, "tạo thành công"]);

            io.emit('send_list_user', users);

        } else {

            socket.emit('alert_create', [0, "username đã tồn tại"]);

        }
    })
    socket.on("disconnect", () => {
        if (socket.Username !== undefined) {
            console.log(socket.Username);
            users.splice(users.indexOf(socket.Username), 1);
            io.emit('send_list_user', users);
        }
    })

    socket.on("send_messenge_all", (data) => {
        socket.broadcast.emit("receive_messenge_all", [data, socket.Username]);
    })

    socket.on("send_messenge", (data) => {
        //
    })
});





app.get("/", function(request, response) {

    response.render("homePage");
});

app.get("/test", function(request, response) {

    response.render("testPage");
});

app.get("/con", function(request, response) {

    response.render("conect");
});