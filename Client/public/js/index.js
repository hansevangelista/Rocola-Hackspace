
/***************** Pages ****************/
window.pages = new Pages(document.querySelector('.wrapper'), {
    time: 700,
    init: 1
});

/***************** Next Prev ****************/
window.prev = document.querySelector('.fa-angle-left');
window.next = document.querySelector('.fa-angle-right');

prev.addEventListener('click', pages.prev);
next.addEventListener('click', pages.next);

/***************** Settings ****************/
window.avatar = document.querySelector('.avatar');
window.settings = document.querySelector('.settings');

avatar.addEventListener('click', function () {
    console.log( "setings", settings.classList.toggle('visible') );
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
