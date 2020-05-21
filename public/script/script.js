var socket = io();
var users = [];
$(document).ready(() => {
    createUser();
    messengeGroup();
    directMessenge();
});

function createUser() {
    $('#create_chat').click(() => {
        let username = $('input[name="username"]').val().trim();
        if (username != "") {
            socket.emit('create_user_chat', username);
        }
    });

    $('input[name="username"]').keyup((event) => {
        if (event.keyCode === 13) {
            let username = $(event.target).val().trim();
            if (username != "") {
                socket.emit('create_user_chat', username);
            }
        }
    })

    socket.on("alert_create", (data) => {
        if (data[0] == 1) {
            $(".modal.fade").hide();
            $(".modal-backdrop").removeClass("show").hide();
        } else {
            $(".alert_messenge").append("<span>" + data[1] + "</span>");
        }
    });
    socket.on("send_list_user", (data) => {
        $(".contacts").children().remove();
        this.users = data;
        data.forEach((user) => {
            let element = $(".contact_item_defaul").clone();
            element.removeClass("d-none").removeClass("contact_item_defaul").addClass("d-block");
            element.find(".username").text(user);
            $(".contacts").append(element);
        });
    });


}

function messengeGroup() {
    $('input[name="input_messenge_all"]').keyup((event) => {
        if (event.keyCode === 13 && $(event.target).val().trim() != "") {
            let mes = $(event.target).val();
            socket.emit("send_messenge_all", mes);
            $(event.target).val("");
            appendMesAllSend(mes);
        }
    })

    socket.on("receive_messenge_all", (data) => {
        console.log(data);
        appendMesAllReceive(data);
    })
}

function appendMesAllSend(mes) {
    let element = $(".justify-content-end.d-none").clone();
    element.removeClass("d-none").addClass("d-flex");

    element.find(".msg_cotainer_send").text(mes);
    $(".show_mes_all").find(".content").append(element);
    $(".show_mes_all").scrollTop($(".show_mes_all").find(".content").height());
}

function appendMesAllReceive(data) {
    let element = $(".justify-content-start.d-none").clone();
    element.removeClass("d-none").addClass("d-flex");

    element.find(".msg_cotainer").text(data[0]).append('<span class="msg_time"></span>');
    element.find(".msg_time").text(data[1]);
    $(".show_mes_all").find(".content").append(element);
    $(".show_mes_all").scrollTop($(".show_mes_all").find(".content").height());
}

function directMessenge() {
    $('input[name="input_messenge"]').keyup((event) => {
        if (event.keyCode === 13 && $(event.target).val().trim() != "") {
            let mes = $(event.target).val();
            socket.emit("send_messenge", mes);
        }
    });


}