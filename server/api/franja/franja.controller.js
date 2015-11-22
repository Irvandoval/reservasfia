'use strict';

var _ = require('lodash');
var Franja = require('./franja.model');

// Get list of franjas
exports.index = function(req, res) {
  Franja.find(function (err, franjas) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(franjas);
  });
};

// Get a single franja
exports.show = function(req, res) {
  Franja.findById(req.params.id, function (err, franja) {
    if(err) { return handleError(res, err); }
    if(!franja) { return res.status(404).send('Not Found'); }
    return res.json(franja);
  });
};

// Creates a new franja in the DB.
exports.create = function(req, res) {
  Franja.create(req.body, function(err, franja) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(franja);
  });
};

// Updates an existing franja in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Franja.findById(req.params.id, function (err, franja) {
    if (err) { return handleError(res, err); }
    if(!franja) { return res.status(404).send('Not Found'); }
    var updated = _.merge(franja, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(franja);
    });
  });
};

// Deletes a franja from the DB.
exports.destroy = function(req, res) {
  Franja.findById(req.params.id, function (err, franja) {
    if(err) { return handleError(res, err); }
    if(!franja) { return res.status(404).send('Not Found'); }
    franja.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}