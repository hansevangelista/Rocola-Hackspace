
/***************** Pages ****************/
window.pages = new Pages(document.querySelector('.wrapper'), {
    time: 250,
    init: 1
});

/*************** Socket.io **************/
var socket = io();

/**************** Player ****************/
window.player = new Player(socket);

/**************** Search ****************/
window.input = document.querySelector('.input');

input.addEventListener('keypress', function (e) {

    if(e.which == 13) player.search(input.value);
});

/****************** Add *****************/
