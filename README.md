# spotify surprise #

live url: https://spotifysurprise.com

### project summary ###

This is based on a project by @rob_med with source code from glitch.com

https://medium.com/analytics-vidhya/a-web-app-to-play-random-songs-from-spotify-with-html-and-javascript-3ecc4dd93651

The previous version, sourced from glitch.com, uses Implicit Grant authorization flow for user login, which can be carried out fully clint-side. However, this approach is not recommended by the Spotify Development Guides.


This version uses a more secure authorization code flow that incorporates a node backend rather than running fully client-side. This authorization flow is recommended by the Spotify Development Guides. 

https://developer.spotify.com/documentation/general/guides/authorization/

This version also features a slightly edited 'randomizer' function that samples the Spotify search results more deeply (though with increased changes to return a null - this funcionality is not yet optimized)


### future plans ###

Primary plans are to add new randomization algorithms and/or search bias parameters that can be configured by the user (such as artists, genres, etc).


