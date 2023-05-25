
let deviceId;
let access_token;
let maxRetries = 10; // set a maximum number of retries
let retryCount = 0; // counter to keep track of number of retries
let currentSongUri = null; // store the current song URI

//Obtains parameters from the hash of the URL
//@return Object

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}


// anonymous function
// login and authentication
(() => {

    const params = getHashParams();

    access_token = params.access_token;
    refresh_token = params.refresh_token;
    error = params.error;

    // Add this line after getting the access_token to remove it from the URL
    window.history.replaceState(null, null, '/');

    if (error) {
        alert('There was an error during the authentication');
    } else {
        if (access_token) {

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

                let togglePlayButton = document.getElementById('togglePlay');
                if (togglePlayButton !== null) {
                    togglePlayButton.addEventListener('click', playSong);
                }

                // auto-play next song...
                // this isn't working, never fires correctly
                // there is no official api hook for 'song end'
                // for now, auto-play is not functional
                player.addListener('player_state_changed', state => {
                    if (
                        state.paused &&
                        state.position === 0 &&
                        state.restrictions.disallow_resuming_reasons &&
                        state.restrictions.disallow_resuming_reasons[0] === "not_paused"
                    ) {
                        //console.log("finished");
                        getASong();
                    }
                });

                player.connect();
            }

            let script = document.createElement('script');
            script.src = "https://sdk.scdn.co/spotify-player.js";
            document.body.appendChild(script);

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


        } else {
            // render initial screen
            $('#login').show();
            $('#loggedin').hide();
        }

    }
})();



// Play a specified track on the Web Playback SDK's device ID
function play(device_id, track) {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
        type: "PUT",
        data: `{"uris": ["${track}"]}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + String(access_token));
        },
        success: function (data) {
            //console.log(data);
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
    let random_seed = generateQuery(3);
    let random_offset = Math.floor(Math.random() * 2000);

    $.ajax({
        url:
            "https://api.spotify.com/v1/search?type=track&offset=" +
            random_offset +
            "&limit=1&q=" +
            random_seed,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + String(access_token));
        },
        success: function (data) {
            //console.log(data);
            let trackUri = data.tracks.items[0].uri;

            // Store the track URI for later
            currentSongUri = trackUri;

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
        // TODO - this should be stopped after a certain number of attempts to prevent spamming
        error: function () {
            retryCount++;
            if (retryCount <= maxRetries) {
                getASong();
            } else {
                alert("Unable to get a song. Please try again.");
                retryCount = 0;
            }
        }
    });
}

// Play a specified track on the Web Playback SDK's device ID
function playSong() {
    if (currentSongUri !== null) {
        $.ajax({
            url: "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId,
            type: "PUT",
            data: `{"uris": ["${currentSongUri}"]}`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + String(access_token));
            },
            success: function (data) {
                //console.log(data);
            }
        });
    }
}

$(document).ready(function () {
    $('#current-track-name-save').click(function (event) {
        event.preventDefault();
        toggleTrackSave('current-track-name-save');
    });
});


function toggleTrackSave(tid) {
    var track = $("#" + tid)
        .attr("data-song")
        .split(":")
        .pop();

    // Check if the track is saved already
    if ($("#" + tid).hasClass("saved")) {
        // Track is saved, so we need to unsave it
        $.ajax({
            url: "https://api.spotify.com/v1/me/tracks?ids=" + track,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + String(access_token));
            },
            success: function (data) {
                //console.log(data);
                $("#" + tid).removeClass("saved");
                $("#" + tid).attr(
                    "src",
                    "https://cdn.glitch.com/eed3cfeb-d097-4769-9d03-2d3a6cc7c004%2Ficons8-heart-24.png?v=1597232027543"
                );
            }
        });
    } else {
        // Track is not saved, so we need to save it
        $.ajax({
            url: "https://api.spotify.com/v1/me/tracks?ids=" + track,
            type: "PUT",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + String(access_token));
            },
            success: function (data) {
                //console.log(data);
                $("#" + tid).addClass("saved");
                $("#" + tid).attr(
                    "src",
                    "https://cdn.glitch.com/eed3cfeb-d097-4769-9d03-2d3a6cc7c004%2Ficons8-heart-24(1).png?v=1597232463038"
                );
            }
        });
    }
}

