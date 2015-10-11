'use strict';

var _ = require('lodash');
var Nivel = require('./nivel.model');

// Get list of nivels
exports.index = function(req, res) {
  Nivel.find(function (err, nivels) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(nivels);
  });
};

// Get a single nivel
exports.show = function(req, res) {
  Nivel.findById(req.params.id, function (err, nivel) {
    if(err) { return handleError(res, err); }
    if(!nivel) { return res.status(404).send('Not Found'); }
    return res.json(nivel);
  });
};

// Creates a new nivel in the DB.
exports.create = function(req, res) {
  Nivel.create(req.body, function(err, nivel) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(nivel);
  });
};

// Updates an existing nivel in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Nivel.findById(req.params.id, function (err, nivel) {
    if (err) { return handleError(res, err); }
    if(!nivel) { return res.status(404).send('Not Found'); }
    var updated = _.merge(nivel, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(nivel);
    });
  });
};

// Deletes a nivel from the DB.
exports.destroy = function(req, res) {
  Nivel.findById(req.params.id, function (err, nivel) {
    if(err) { return handleError(res, err); }
    if(!nivel) { return res.status(404).send('Not Found'); }
    nivel.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}