var model = require('../models/Downtime.js');

var ViewTemplatePath = 'downtime';
module.exports = {
    'index': function (req, res) {
        var out = {user: req.user};
        res.render(ViewTemplatePath + "/index", out);
    }
};