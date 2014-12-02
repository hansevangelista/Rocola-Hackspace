var colors = require('colors');

var express = require('express'),
    swig = require('swig');

// Create server
var app = express();

// Configure server
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');

app.use(express.static('./public'));

// Routes
app.get('/', function(req, res){
    res.render('index');
});

// Init server
var port = 4000;

var server = app.listen(port, function () {
    console.log('server listening on port'.yellow, port);
});

// Web Socket Server
var WebSocket = require('ws'),
    wss = new WebSocket.Server({ port: 8080 });

// Create Mopidy
var Mopidy = require('mopidy'),
    mopidy = new Mopidy({
        webSocketUrl: "ws://localhost:6680/mopidy/ws/"
    });

// Create Socket.io
var socketio = require('socket.io'),
    io = socketio(server);

var raspi,
    endedRecently = false,
    tracklist = [];

io.on('connection', function (socket) {
    console.log( "Here comes a new CHALLENGUEERR".green );

    console.log( "Current Tracklist:\n", tracklist );
    
    socket.emit('init', tracklist);
    socket.on('search', search);
    socket.on('add', add);

    if(raspi)
        raspi.on('message', router);

    function router (message) {
        message = JSON.parse(message);
        if(message.type == 'ended') ended();
    }

    function ended () {
        // if (!endedRecently){
        console.log( "----------->>>>>> Playback Ended <<<<<<<<----------" );
        console.log(tracklist);
        socket.emit('ended');
        // socket.broadcast.emit('ended');
        // endedRecently = true;
        // setTimeout(function(){
        //     endedRecently = false;
        // },3000);
        // }
        // else {
        //     setTimeout(function(){
        //         endedRecently = false;
        //     },3000);
        // }
}

      function search (text) {
          mopidy.library.search( {any: [text]}, ['spotify:'] )
              .then(result);
      }

      function result (data) {

          var tracklist = data[0].tracks,
              tracks = [];

          for( i = 0; i < tracklist.length && i < 10; i++){

              var track = {
                  name: tracklist[i].name,
                  album: tracklist[i].album.name,
                  uri: tracklist[i].uri
              };

              tracks[i] = track;
          }

          socket.emit('result', tracks);
      }

      function add (track) {
          console.log( "----------->>>>>> New Tracklist Added  <<<<<<<<----------".red );
          getImage(track, function () {
              tracklist.push(track);
              socket.emit('newTrack', track);
              socket.broadcast.emit('newTrack', track);
          });

          raspi.send( JSON.stringify( {type: 'add', data: track.uri} ) );
      }
     });

var request = require('request');

function getImage (track, callback) {
    console.log( "Getting Image of: ".underline.red + track.album.yellow + "\n");
    
    request({
        uri: "https://embed.spotify.com/oembed/?url="
            + track.uri,
        method: "GET",
        headers: {
            'User-Agent': 'Mozilla/5.0 '
                + '(Windows NT 6.1; Win64; x64; rv:25.0) '
                + 'Gecko/20100101 Firefox/25.0'
        }
    }, function(error, response, body) {
        
		    var responses = JSON.parse(body);
		    var album_art_640 = function(str){
		        str = str.split('cover');
		        return str[0]+'640'+str[1];
		    }(responses.thumbnail_url);
        
        track.img = album_art_640;

        callback();
    });
}

wss.on('connection', function (ws) {
    console.log( "Connection Handshake Successful with the Raspi".red );

    // setTimeout(function(){

    //     ws.send( JSON.stringify( {type: 'add', data: 'spotify:track:55h7vJchibLdUkxdlX3fK7'} ) );
    //     setTimeout(function(){

    //         ws.send( JSON.stringify( {type: 'add', data: 'spotify:track:3w3y8KPTfNeOKPiqUTakBh'} ) );

    //         setTimeout(function(){
    //             ws.send( JSON.stringify( {type: 'getTracklist'} ) );
    //         }, 2000);
    //     }, 2000);
    // }, 3000);

    raspi = ws;

    ws.on('message', router);
    
    function router (message) {
        message = JSON.parse(message);
        if(message.type == 'newTracklist') newTracklist(message.data);
        if(message.type == 'updateTracklistOnEnd') {
            console.log("The length of tracklist is: ".red + tracklist.length);
            console.log("Before shifting: ".cyan + tracklist);
            tracklist.shift();
            console.log("After shifting: ".cyan + tracklist);
        } 
        // if(message.type) == 'started' started(message.data);
        // if(message.type == 'ended') ended();
    }

    // function tracklist (tracks) {
    //     console.log( "tracks", tracks );
    // }

    // function started (track) {
    //     console.log( "started", track );
    // }

    // function ended () {
    //     console.log( "ended" );
    // }
});

function newTracklist (tracks) {
    // tracklist = tracks;
    console.log( "Here comes a new Tracklist: \n".green , tracklist );
}
