/*jslint
    node
*/

'use strict';

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var value = false,
        parsed = parseInt(val, 10);

    if (isNaN(parsed)) { // named pipe
        value = val;
    }
    if (parsed >= 0) { // port number
        value = parsed;
    }
    return value;
}

module.exports = {
    port: normalizePort(process.env.PORT || '3000')
};
