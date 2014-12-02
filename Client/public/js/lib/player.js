function Player (socket) {

    var playlist = document.querySelector('.playlist'),
        image = document.querySelector('.song img'),
        name = document.querySelector('.song .name'),
        spinner = document.querySelector('.spinner'),
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

        if(playlist.children.length){
            
            var first = playlist.children[0];

            image.setAttribute('src', first.dataset.img);

            name.innerHTML = first.dataset.name + ' - ' + first.dataset.album;
        }
    }

    function result (tracks) {
        
        spinner.classList.remove('visible');

        for( i = 0; i < tracks.length; i++){

            var html = stringToDOM( resultTrackTemplate(tracks[i]) );

            resultTracks.appendChild( html );

            html.addEventListener('click', function () {

                this.style.pointerEvents = 'none';
                
                var track = {
                    name: this.dataset.name,
                    album: this.dataset.album,
                    uri: this.dataset.uri
                };

                add(track);

                var faCheck = this.querySelector('.fa-check');
                var faPlus = this.querySelector('.fa-plus');
                // console.log( "faCheck", faCheck, "faPlus", faPlus );
                faCheck.style.display = 'block';
                faPlus.style.display = 'none';
            });
        }
    }

    function search (text) {
        resultTracks.innerHTML = "";

        spinner.classList.add('visible');

        socket.emit('search', text);
    }

    function add (track) {
        console.log( "add", track );
        socket.emit('add', track);
    }

    function newTrack (track) {

        console.log("------------->>>> New Track Event Triggered <<<<<<-------------------");
        console.log("This is the playlist: ", playlist);

        if(!playlist.children.length){
            image.setAttribute("src", track.img);
            name.innerHTML = track.name + ' - ' + track.album;
        }

        var html = stringToDOM( trackTemplate(track) );
        playlist.appendChild(html);
    }

    function ended () {
        console.log( "Playback Ended" );

        var first = playlist.children[0];
        console.log( "Deleted First Item (pop)", first );
        playlist.removeChild(first);
        
        if(playlist.children.length){
            first = playlist.children[0];
            image.setAttribute("src", first.dataset.img);
            name.innerHTML = first.dataset.name + ' - ' + first.dataset.album;
        } 
        else{
            image.setAttribute("src", "img/logo.png");
            name.innerHTML = "swipe left for more awesomeness!";
            alert("Ohai! :) it seems the playlist stopped, mind adding a few more?");
        }
    }

    return {
        search: search
    };
}
