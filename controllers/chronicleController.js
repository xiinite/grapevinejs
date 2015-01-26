var model = require('../models/Chronicle.js');
var uuid = require('node-uuid');

var ViewTemplatePath = 'chronicle';
module.exports = {
    'index': function (req, res, next) {
        var out = {user: req.user};
        res.render(ViewTemplatePath + "/index", out);
    },
    'all': function (req, res, next) {
        var where = {};
        if (! req.user.isSuperAdmin) {
            var userId = req.user.googleId;
            where =
            {
                admins: {$in: [userId]}
            };
            model.find(where, function(err, result){
                res.json(result);
            })
        }
        else{
            model.all(function (err, result) {
                res.json(result);
            });
        }
    },
    'list': function(req, res, next){
        var where = {};
        if(!req.user.isSuperAdmin){
            var userId = req.user.googleId;
            where =
            {
                admins: {$in: [userId]}
            };
            model.find(where, function(err, result){
                res.json(result);
            })
        }else{
            model.listAll(function (err, result) {
               res.json(result);
            });
        }
    },
    'find': function (req, res, next){
        if (req.params.id) {
            model.find({"id": req.params.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                if(req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1)
                {
                    res.json(result[0]);
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'show': function (req, res, next) {
        if (req.params.id) {
            model.find({"id": req.params.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                var out = {user: user, chronicle: result[0]};
                if(req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1)
                {
                    res.render(ViewTemplatePath + "/show", out);
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'update': function(req, res, next){
        if(req.body.id){
            model.find({"id": req.body.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                if(req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1)
                {
                    var field = req.body.field;
                    var data = req.body.data;
                    var updateValues = {};
                    updateValues[field] = data;
                    model.update(req.body.id, updateValues, function(err){
                        if(err) {
                            res.json(err);
                            return;
                        }
                        res.json("ok");
                    });
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'addadmin': function(req, res, next){
        if (req.body.id) {
            model.find({"id": req.body.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                if(req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1)
                {
                    if(result[0].admins.indexOf(req.body.userId) == -1)
                    {
                        result[0].admins.push(req.body.userId);
                    }
                    model.update(req.body.id, {'admins': result[0].admins}, function(err){
                        if(err) {
                            res.json(err);
                            return;
                        }
                        res.json("ok");
                    });
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'removeadmin': function(req, res, next){
        if (req.body.id) {
            model.find({"id": req.body.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                if((req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1) && req.user.googleId != req.body.userId)
                {
                    if(result[0].admins.indexOf(req.body.userId) > -1)
                    {
                        result[0].admins.splice(result[0].admins.indexOf(req.body.userId), 1);
                    }
                    model.update(req.body.id, {'admins': result[0].admins}, function(err){
                        if(err) {
                            res.json(err);
                            return;
                        }
                        res.json("ok");
                    });
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'addplayer': function(req, res, next){
        if (req.body.id) {
            model.find({"id": req.body.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                if(req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1)
                {
                    if(result[0].players.indexOf(req.body.userId) == -1)
                    {
                        result[0].players.push(req.body.userId);
                    }
                    model.update(req.body.id, {'players': result[0].players}, function(err){
                        if(err) {
                            res.json(err);
                            return;
                        }
                        res.json("ok");
                    });
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'removeplayer': function(req, res, next){
        if (req.body.id) {
            model.find({"id": req.body.id}, function (err, result) {
                var user = req.user || {displayName: "Anonymous"};
                if(req.user.isSuperAdmin || result[0].admins.indexOf(user.googleId) > -1)
                {
                    if(result[0].players.indexOf(req.body.userId) > -1)
                    {
                        result[0].players.splice(result[0].players.indexOf(req.body.userId), 1);
                    }
                    model.update(req.body.id, {'players': result[0].players}, function(err){
                        if(err) {
                            res.json(err);
                            return;
                        }
                        res.json("ok");
                    });
                }
                else
                {
                    res.json("forbidden");
                }
            });
        }
    },
    'clear': function (req, res, next) {
        if(! req.user.isSuperAdmin) return res.json('forbidden');
        model.clear(function () {
            res.json('ok')
        });
    },
    'insert': function(req, res, next){
        var chronicle = {
            id: uuid.v4(),
            name: req.body.name,
            description: req.body.description,
            admins: [req.user.googleId],
            administrators: [],
            characters: []
        };
        model.insert(chronicle, function(err){
            if (err) {
                res.json(err);
                return;
            }
            res.json("ok");
        })
    },
    'populate': function (req, res, next) {
        if(! req.user.isSuperAdmin) return res.json('forbidden');
        var c1 = {
            id: "67abf1a1-d331-4e18-8739-93895c7a639d",
            name: 'Nachtkronieken',
            admins: ["114799359163510443499", "110802985198495285759"]
        };
        var c2 = {id: uuid.v4(), name: 'Demo 1', admins: ["114799359163510443499", "12687"]};
        var c3 = {id: uuid.v4(), name: 'Demo 2', admins: ["123546"]};
        var c4 = {id: uuid.v4(), name: 'Mechelen by Night', admins: ["9158"]};
        var c5 = {id: uuid.v4(), name: 'Gent bij Nachte', admins: ["114799359163510443499"]};
        model.insert([c1, c2, c3, c4, c5], function (err, result) {
            if (err) {
                res.json(err);
                return;
            }
            if (!err)res.json(result);
        });
    }
};