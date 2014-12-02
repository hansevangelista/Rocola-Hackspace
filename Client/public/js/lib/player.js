function Player (socket) {

    var playlist = document.querySelector('.playlist'),
        resultTracks = document.querySelector('.result'),
        trackTemplate = _.template(document.getElementById('track').innerHTML),
        resultTrackTemplate =
            _.template(document.getElementById('resultTrack').innerHTML);

    socket.on('init', init);
    socket.on('result', result);
    socket.on('newTrack', newTrack);
    socket.on('ended', ended);

    function init (tracks) {
        console.log( "init", tracks );

        for( i = 0; i < tracks.length; i++){

            track = tracks[i];

            var html = stringToDOM( trackTemplate(track) );

            playlist.appendChild(html);
        }
    }

    function result (tracks) {

        for( i = 0; i < tracks.length; i++){

            var html = stringToDOM( resultTrackTemplate(tracks[i]) );

            resultTracks.appendChild( html );

            html.addEventListener('click', function () {

                var track = {
                    name: this.dataset.name,
                    album: this.dataset.album,
                    uri: this.dataset.uri
                };

                add(track);
            });
        }
    }

    function search (text) {

        resultTracks.innerHTML = "";

        socket.emit('search', text);
    }

    function add (track) {
        console.log( "add", track );

        socket.emit('add', track);
    }

    function newTrack (track) {

        var html = stringToDOM( trackTemplate(track) );

        playlist.appendChild(html);
    }

    function ended () {
        console.log( "Playlist Ended" );

        var playlist = document.querySelector('.playlist'),
            first = playlist.children[0];

        console.log( "Deleted First Item (pop)", first );

        playlist.removeChild(first);
    }

    return {
        search: search
    };
}
