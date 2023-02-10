let deviceId;

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function getToken() {
    var params = getHashParams();
    var access_token = params.access_token;
    return access_token;
}


(function () {

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function (response) {
                    $('#login').hide();
                    $('#loggedin').show();
                }
            });

            // initialize player
            window.onSpotifyWebPlaybackSDKReady = () => {
                const token = access_token;
                const player = new Spotify.Player({
                    name: 'Web Playback SDK Quick Start Player',
                    getOAuthToken: cb => { cb(token); },
                    volume: 0.5
                });

                // Ready
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    deviceId = device_id;
                });

                // Not Ready
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                player.addListener('initialization_error', ({ message }) => {
                    console.error(message);
                });

                player.addListener('authentication_error', ({ message }) => {
                    console.error(message);
                });

                player.addListener('account_error', ({ message }) => {
                    console.error(message);
                });

                document.getElementById('togglePlay').onclick = function () {
                    player.togglePlay();
                };

                // this isn't working, never fires correctly
                // there is no official api hook for 'song end'
                player.addListener('player_state_changed', state => {
                    if (
                        state.paused &&
                        state.position === 0 &&
                        state.restrictions.disallow_resuming_reasons &&
                        state.restrictions.disallow_resuming_reasons[0] === "not_paused"
                    ) {
                        console.log("finished");
                        getASong();
                    }
                });

                player.connect();
            }

        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }

    }
})();



// Play a specified track on the Web Playback SDK's device ID
function play(device_id, track) {
    console.log(getToken());
    console.log(String(getToken()));
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
        type: "PUT",
        data: `{"uris": ["${track}"]}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + String(getToken()));
        },
        success: function (data) {
            console.log(data);
        }
    });
}

function generateQuery(length) {
    var result = "";
    var characters =
        "abcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getASong() {
    let random_seed = generateQuery(2);
    let random_offset = Math.floor(Math.random() * 3000); // returns a random integer from 0 to 500

    $.ajax({
        url:
            "https://api.spotify.com/v1/search?type=track&offset=" +
            random_offset +
            "&limit=1&q=" +
            random_seed,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + String(getToken()));
        },
        success: function (data) {
            console.log(data);
            let trackUri = data.tracks.items[0].uri;

            play(deviceId, trackUri);
            $("#current-track-name-save").attr("data-song", data.tracks.items[0].uri);
            $("#current-track-name-save").attr(
                "src",
                "https://cdn.glitch.com/eed3cfeb-d097-4769-9d03-2d3a6cc7c004%2Ficons8-heart-24.png?v=1597232027543"
            );
            $("#embed-uri").attr(
                "src",
                "https://open.spotify.com/embed/track/" + data.tracks.items[0].id
            );
            $("#current-track-name-save").css("display", "block");
        },
        error: function() { 
            getASong();
        }  
    });
}

function saveTrack(tid) {
    var track = $("#" + tid)
        .attr("data-song")
        .split(":")
        .pop();

    $.ajax({
        url: "https://api.spotify.com/v1/me/tracks?ids=" + track,
        type: "PUT",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + String(getToken()));
        },
        success: function (data) {
            console.log(data);
            $("#" + tid).attr(
                "src",
                "https://cdn.glitch.com/eed3cfeb-d097-4769-9d03-2d3a6cc7c004%2Ficons8-heart-24(1).png?v=1597232463038"
            );
        }
    });
}
