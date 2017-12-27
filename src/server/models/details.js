/*jslint
    node
*/

'use strict';

function init(sequelize, types) {
    return sequelize.define('detail', {
        id: {
            type: types.INTEGER,
            field: 'ID',
            primaryKey: true
        },
        path: {
            type: types.TEXT,
            field: 'PATH'
        },
        size: {
            type: types.INTEGER,
            field: 'SIZE'
        },
        timestamp: {
            type: types.INTEGER,
            field: 'TIMESTAMP'
        },
        title: {
            type: types.TEXT,
            field: 'TITLE'
        },
        duration: {
            type: types.TEXT,
            field: 'DURATION'
        },
        bitrate: {
            type: types.INTEGER,
            field: 'BITRATE'
        },
        samplerate: {
            type: types.INTEGER,
            field: 'SAMPLERATE'
        },
        creator: {
            type: types.TEXT,
            field: 'CREATOR'
        },
        artist: {
            type: types.TEXT,
            field: 'ARTIST'
        },
        album: {
            type: types.TEXT,
            field: 'ALBUM'
        },
        genre: {
            type: types.TEXT,
            field: 'GENRE'
        },
        comment: {
            type: types.TEXT,
            field: 'COMMENT'
        },
        channels: {
            type: types.INTEGER,
            field: 'CHANNELS'
        },
        disc: {
            type: types.INTEGER,
            field: 'DISC'
        },
        track: {
            type: types.INTEGER,
            field: 'TRACK'
        },
        date: {
            type: types.DATE,
            field: 'DATE'
        },
        resolution: {
            type: types.TEXT,
            field: 'RESOLUTION'
        },
        thumbnail: {
            type: types.BOOLEAN,
            field: 'THUMBNAIL'
        },
        albumArt: {
            type: types.INTEGER,
            field: 'ALBUM_ART'
        },
        rotation: {
            type: types.INTEGER,
            field: 'ROTATION'
        },
        dlnaPN: {
            type: types.TEXT,
            field: 'DLNA_PN'
        },
        mime: {
            type: types.TEXT,
            field: 'MIME'
        }
    }, {
        tableName: 'DETAILS',
        timestamps: false
    });
}

module.exports = {
    init: init
};
