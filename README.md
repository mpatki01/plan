# PlayList mANipulator

A simple tool for creating m3u style playlists from a Mini-DLNA file database.

## Pre-requisites

- git
- Node.js
- npm

## Building

- Clone the repository
- npm install
- bower install

### Development

- npm start
- gulp serve

### Production

- gulp build
- npm prune --production

## TLS Issues

`npm` installations and corresponding package pre and post build scripts are
somtimes hampered by organizations which have self-signed root CAs. While,
generally speaking, it is a bad practice, the following two settings can be
modified to ensure `npm` fetches packages in restrictive corporate
environments.

- npm config set strict-ssl false
- Set NODE_TLS_REJECT_UNAUTHORIZED = "0"
  - In powershell this is done via $env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
