# Spotify Surprise

![Spotify Surprise screenshot](https://imgur.com/BuJaJ7T.png)

[Spotify Surprise](https://spotifysurprise.com) is a web application designed to play random songs from the Spotify catalog. The main goal of the app is to introduce users to a wide variety of songs from different genres and artists, sourced from the extensive Spotify library.

## Project Summary

This project is based on the work of [@rob_med](https://github.com/rob_med) and was originally hosted on Glitch. You can find the original project in this [Medium article](https://medium.com/analytics-vidhya/a-web-app-to-play-random-songs-from-spotify-with-html-and-javascript-3ecc4dd93651).

The initial version of the application used the Implicit Grant authorization flow for user login, which can be carried out fully client-side. However, this approach is not recommended by the Spotify Development Guides.

The current version of Spotify Surprise, hosted on this repository, uses a more secure authorization code flow that incorporates a Node.js backend. This authorization flow is recommended by the Spotify Development Guides and you can read more about it [here](https://developer.spotify.com/documentation/general/guides/authorization/).

This version also features a slightly edited 'randomizer' function that samples the Spotify search results differently. However, this functionality may sometimes return null and is not yet optimized.

## Project Structure

```
/spotify-surprise
│ .env
│ .gitattributes
│ .gitignore
│ LICENSE
│ package-lock.json
│ package.json
│ README.md
│ server.js
│
├── public
│ │ dice.svg
│ │ index.html
│ │ script.js
│ │
│ └── css
│ style.css
│ style.css.map
│
└── scss
style.scss
_button.scss
_main.scss
_variables.scss
```


## Future Plans

I plan to add new randomization algorithms and configurable search bias parameters. This will allow users to customize the randomization process based on their preferences, such as favorite artists, genres, and more.

If you have an idea for a feature, feel free to open an issue or submit a pull request.

## License

Spotify Surprise is open source software [licensed as MIT](./LICENSE).
