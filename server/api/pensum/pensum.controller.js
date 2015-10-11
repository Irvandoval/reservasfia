'use strict';

var _ = require('lodash');
var Pensum = require('./pensum.model');

// Get list of pensums
exports.index = function(req, res) {
  Pensum.find(function (err, pensums) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pensums);
  });
};

// Get a single pensum
exports.show = function(req, res) {
  Pensum.findById(req.params.id, function (err, pensum) {
    if(err) { return handleError(res, err); }
    if(!pensum) { return res.status(404).send('Not Found'); }
    return res.json(pensum);
  });
};

// Creates a new pensum in the DB.
exports.create = function(req, res) {
  Pensum.create(req.body, function(err, pensum) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pensum);
  });
};

// Updates an existing pensum in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pensum.findById(req.params.id, function (err, pensum) {
    if (err) { return handleError(res, err); }
    if(!pensum) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pensum, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pensum);
    });
  });
};

// Deletes a pensum from the DB.
exports.destroy = function(req, res) {
  Pensum.findById(req.params.id, function (err, pensum) {
    if(err) { return handleError(res, err); }
    if(!pensum) { return res.status(404).send('Not Found'); }
    pensum.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}