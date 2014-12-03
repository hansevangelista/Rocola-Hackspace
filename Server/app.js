var colors = require('colors');

// Create Mopidy
var Mopidy = require('mopidy'),
    mopidy = new Mopidy({
        webSocketUrl: "ws://localhost:6680/mopidy/ws/"
    }),
    state = 'waiting';

// Init Mopidy 
mopidy.on('state:online', function () {
    
    mopidy.tracklist.setConsume(true);

    var defaultUri = 'spotify:user:lomejordespotifyenargentina:playlist:1K3CWZMz6B8Q3p4fcEK8UY'; 

    mopidy.library.lookup(defaultUri)
        .then( function (tracklist) {
            mopidy.tracklist.clear();
            mopidy.tracklist.add(tracklist);
            mopidy.playback.play();
        });
});

// Create Web Socket
var WebSocket = require('ws'),
    // ws = new WebSocket('ws://104.131.99.47:8080');
    ws = new WebSocket('ws://localhost:8080');

ws.on('message', router);

function router (message) {
    
    message = JSON.parse(message);
    
    if(message.type == 'add') add(message.data);
    else if (message.type == 'nextTrack') nextTrack();
}

function add (uri) {
    
    console
        .log(
            "<<<<<<<<<<__________ Add Event Triggered __________>>>>>>>>>>".yellow);
    var tracklistLength;
    
    mopidy.tracklist.getLength()
        .done(function(length){
            console.log("Length of tracklist is: ".cyan , length);
            tracklistLength = length;
        });
    
    mopidy.library.lookup(uri)
        .then( function (track) {
            
            if(state == 'waiting') {
                
                mopidy.tracklist.clear();
                mopidy.tracklist.add(track);
                mopidy.playback.play();

                state = 'starting';
            }
            else {
                mopidy.tracklist.add(track);
                if (!tracklistLength) 
                    mopidy.playback.play();
            }
        });
}

function nextTrack (){
    mopidy.playback.getCurrentTlTrack()
        .done(function (tl_track) {
            console.log("Track to Be Removed: ".yellow + JSON.stringify(tl_track,null, 2));
            mopidy.tracklist.remove({'tlid': [tl_track["tlid"]]});
            mopidy.tracklist.getLength()
                .done(function(length){
                    if (length) {
                        mopidy.playback.next();    
                        mopidy.playback.play();
                    }
                });
        });
}
mopidy.on('event:tracklistChanged', tracklistChanged);

function tracklistChanged () {
    console.log( "\n Tracklist Changed".red );
    
    var tracklist = [];

    if (state == 'initiated' || state == 'starting'){

        console.log( "<<<<<-------- send new tracklist -------->>>>>>>>".green );

        mopidy.tracklist.getTracks()
            .done( function(tracks){

                for( i = 0; i < tracks.length; i++){

                    var track= {
                        name: tracks[i].name,
                        album: tracks[i].album.name,
                        uri: tracks[i].uri
                    };

                    tracklist[i] = track;
                }

                ws.send(
                    JSON.stringify( {type: 'newTracklist', data: tracklist} )
                );
                console.log("New tracklist is: ".red,tracklist);
            });
    }
}

mopidy.on('event:trackPlaybackStarted', function (data) {

    if (state == 'starting' || state == 'initiated')
        state = 'initiated';
    
});

mopidy.on('event:trackPlaybackEnded', function (tlTrack) {
    if(state == 'initiated'){
        ws.send(JSON.stringify({ type: 'updateTracklistOnEnd'}));
        ws.send( JSON.stringify( {type: 'ended'} ) );
    }
});
