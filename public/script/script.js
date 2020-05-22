var socket = io();
var users = [];
var listUserMessenger = [];
var userReceive = {};

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
            element.attr("data-username", user.username);
            element.attr("data-key", user.key);
            element.removeClass("d-none").removeClass("contact_item_defaul").addClass("d-block");
            element.find(".username").text(user.username);
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
        appendMesAllReceive(data);
    })
}

function directMessenge() {

    $(document).on("click", ".contact_item", (event) => {
        $(".contact_item.active").removeClass("active");
        $(event.currentTarget).addClass("active");
        this.userReceive.username = $(event.currentTarget).data("username");
        this.userReceive.key = $(event.currentTarget).data("key");

        $(".msg_card_body").find(".content").children().remove();

        let messenges = this.listUserMessenger.filter((content) => {
            return (content.usernameReceive == this.userReceive.username || content.usernameSend == this.userReceive.username);
        })
        messenges.forEach((mes) => {
            let m = mes.messenge;
            let ur = mes.usernameReceive;
            let us = mes.usernameSend;
            if (ur !== undefined) {
                appendMesSend(m);

            } else {
                appendMesReceive(m);
            }
        })
    });

    $('input[name="input_messenge"]').keyup((event) => {
        if (event.keyCode === 13 && $(event.target).val().trim() != "" && this.userReceive.key != undefined) {
            let mes = $(event.target).val();
            let dataSend = { messenge: mes, usernameReceive: this.userReceive.username, keyReceive: this.userReceive.key };
            this.listUserMessenger.push(dataSend);
            socket.emit("send_messenge", dataSend);
            $(event.target).val("")
            appendMesSend(mes)
        }
    });

    socket.on("receive_messenge", (data) => {
        this.listUserMessenger.push(data);
        if (this.userReceive.username === data.usernameSend) {
            appendMesReceive(data.messenge);
        } else {
            let element = $('.toast');
            element.find(".toast-header").text(data.usernameSend);
            element.find(".toast-body").text(data.messenge);
            element.toast('show');
        }
    });
}



//append mess all
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


//append mess
function appendMesSend(mes) {
    let element = $(".justify-content-end.d-none").clone();
    element.removeClass("d-none").addClass("d-flex");

    element.find(".msg_cotainer_send").text(mes);
    $(".msg_card_body").find(".content").append(element);
    $(".msg_card_body").scrollTop($(".msg_card_body").find(".content").height());
}

function appendMesReceive(mes) {
    console.log(mes)
    let element = $(".justify-content-start.d-none").clone();
    element.removeClass("d-none").addClass("d-flex");

    element.find(".msg_cotainer").text(mes);
    $(".msg_card_body").find(".content").append(element);
    $(".msg_card_body").scrollTop($(".msg_card_body").find(".content").height());
}