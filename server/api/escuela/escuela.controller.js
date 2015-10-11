'use strict';

var _ = require('lodash');
var Escuela = require('./escuela.model');

// Get list of escuelas
exports.index = function(req, res) {
  Escuela.find(function (err, escuelas) {
    if(err) { return handleError(res, err); }
    return res.json(200, escuelas);
  });
};

// Get a single escuela
exports.show = function(req, res) {
  Escuela.findById(req.params.id, function (err, escuela) {
    if(err) { return handleError(res, err); }
    if(!escuela) { return res.send(404); }
    return res.json(escuela);
  });
};

// Creates a new escuela in the DB.
exports.create = function(req, res) {
  Escuela.create(req.body, function(err, escuela) {
    if(err) { return handleError(res, err); }
    return res.json(201, escuela);
  });
};

// Updates an existing escuela in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Escuela.findById(req.params.id, function (err, escuela) {
    if (err) { return handleError(res, err); }
    if(!escuela) { return res.send(404); }
    var updated = _.merge(escuela, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, escuela);
    });
  });
};

// Deletes a escuela from the DB.
exports.destroy = function(req, res) {
  Escuela.findById(req.params.id, function (err, escuela) {
    if(err) { return handleError(res, err); }
    if(!escuela) { return res.send(404); }
    escuela.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}