'use strict';

var _ = require('lodash');
var Ciclo = require('./ciclo.model');

// Get list of ciclos
exports.index = function(req, res) {
  Ciclo.find(function (err, ciclos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(ciclos);
  });
};

// Get a single ciclo
exports.show = function(req, res) {
  Ciclo.findById(req.params.id, function (err, ciclo) {
    if(err) { return handleError(res, err); }
    if(!ciclo) { return res.status(404).send('Not Found'); }
    return res.json(ciclo);
  });
};

// Creates a new ciclo in the DB.
exports.create = function(req, res) {
  Ciclo.create(req.body, function(err, ciclo) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(ciclo);
  });
};

// Updates an existing ciclo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Ciclo.findById(req.params.id, function (err, ciclo) {
    if (err) { return handleError(res, err); }
    if(!ciclo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(ciclo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(ciclo);
    });
  });
};

// Deletes a ciclo from the DB.
exports.destroy = function(req, res) {
  Ciclo.findById(req.params.id, function (err, ciclo) {
    if(err) { return handleError(res, err); }
    if(!ciclo) { return res.status(404).send('Not Found'); }
    ciclo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}