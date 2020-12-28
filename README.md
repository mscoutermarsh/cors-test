# CORS Tester
The code for [cors-test.codehappy.dev](https://cors-test.codehappy.dev). A tiny tool for checking if your CORS headers are setup correctly.

<img src="https://github.com/mscoutermarsh/cors-test/blob/main/screenshot.png?raw=true" width="500px" />

## How it works
This website is deployed as a Cloudflare worker. The entire script is inside `index.js`. It makes a request to the URL, checks the headers and then lets you know if they are setup correctly for CORS.

## Development
For development you need to install [wrangler](https://github.com/cloudflare/wrangler).

Then run `wrangler dev` to start the server.

## Production
It's auto deployed via GitHub Actions.
