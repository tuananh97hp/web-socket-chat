var express = require("express");

var $ = require('jquery');

var app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");




var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(3003);


var users = [];

io.on("connection", function(socket) {

    socket.on('create_user_chat', (username) => {
        if (findUserByUsername(users, username) === undefined) {

            users.push({
                "key": socket.id,
                "username": username
            });
            socket.Username = username;
            socket.emit('alert_create', [1, "tạo thành công"]);
            io.emit('send_list_user', users);

        } else {

            socket.emit('alert_create', [0, "username đã tồn tại"]);

        }
    })
    socket.on("disconnect", () => {
        if (socket.Username !== undefined) {
            users = users.filter((user) => {
                return user.username != socket.Username;
            });
            io.emit('send_list_user', users);
        }
    })

    socket.on("send_messenge_all", (data) => {
        socket.broadcast.emit("receive_messenge_all", [data, socket.Username]);
    })

    socket.on("send_messenge", (data) => {
        if (data.usernameReceive !== socket.Username)
            io.to(data.keyReceive).emit("receive_messenge", { messenge: data.messenge, usernameSend: socket.Username });
    })


});

function findUserByUsername(arr, username) {
    return arr.find((user) => {
        return user.username == username;
    })
}




app.get("/", function(request, response) {

    response.render("homePage");
});

app.get("/test", function(request, response) {

    response.render("testPage");
});

app.get("/con", function(request, response) {

    response.render("conect");
});