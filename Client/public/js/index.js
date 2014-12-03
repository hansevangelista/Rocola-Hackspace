
/***************** Pages ****************/
window.pages = new Pages(document.querySelector('.wrapper'), {
    time: 700,
    init: 1
});

new Login();

/*************** Socket.io **************/
var socket = io();

/**************** Player ****************/
window.player = new Player(socket);

/**************** Search ****************/
window.input = document.querySelector('.input');

input.addEventListener('keypress', function (e) {

    if(e.which == 13) player.search(input.value);
});
