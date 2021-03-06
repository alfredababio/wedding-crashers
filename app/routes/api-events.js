module.exports = function(app) {
    var mongoose = require('mongoose');
    Event = require('../models/events');

    var express = require('express');
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended : true
    }));
    app.use(bodyParser.json());

    app.get('/events/search/:id', function (req, res) {
        //Select top 1 from Event where Event.id = req.param.id
        var query = Event.where({ _id : req.params.id });
        query.findOne(function (err, event) { 
            if (err) {
                //return handleError(err);
                res.send(err);
            }
            if (event) {
                // doc may be null if no document matched
                res.send(event); 
            }
        }); 
    }) 
    app.get('/events/search/', function (req, res) {
        Event.find(function (err, event) {
            if (err) {
                //return handleError(err);
                res.send(err);
            }
            if (event) {
                // doc may be null if no document matched
                res.send(event);
            }
        }); 
    })
    app.get('/events/search/:lat/:longitude', function (req, res) {
        //select *  from Events where Events.location.latitude <= req.params.lat + .035   and 
        //                            Events.location.latitude >= req.params.lat - .035   and
        //                            Events.location.longitude <= req.params.long + .035 and
        //                            Events.location.longitude >= req.params.long - .035
        var query = Event.where('location.latitude').gte(parseFloat(req.params.lat) - .035).lte(parseFloat(req.params.lat) + .035).where('location.longitude').lte(parseFloat(req.params.longitude) + .035).gte(parseFloat(req.params.longitude) - .035);
        query.find(function (err, event) {
            if (err) {
                //return handleError(err);
                res.send(err);
            }
            if (event) {
                // doc may be null if no document matched
                res.send(event);
            }
        });
    })
    app.post('/events/create', function(req, res) {
        var eventInfo = new Event({ 
            name : req.body.name,
            description : req.body.description,
            date : req.body.date,
            price : req.body.price,
            url : req.body.url,
            host : req.body.host,
            capacity : req.body.capacity,
            location : [{ street : req.body.location.street, 
                    zip : req.body.location.zip,
                    city : req.body.location.city,
                    state : req.body.location.state,
                    latitude : req.body.location.latitude,
                    longitude : req.body.location.longitude }]
        });
        eventInfo.save(function(err) {
            if (err){
                //handle error
                res.send(err);
            }
            else {
                res.json({ message:'Success', data:eventInfo, console: req.body});
            }
        });
    });
}