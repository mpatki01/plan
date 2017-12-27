/*jslint
    node
*/

'use strict';

function init(app, db) {

    // Gets a detail by ID.
    app.get('/detail/:id', function (req, res) {
        var id = req.params.id;
        db.details.find({
            where: {id: id}
        }).then(function (detail) {
            res.json(detail);
        });
    });
}

module.exports = {
    init: init
};
