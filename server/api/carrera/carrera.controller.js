'use strict';

var _ = require('lodash');
var Carrera = require('./carrera.model');

// Get list of carreras
exports.index = function(req, res) {
  Carrera.find()
  .populate('escuela')
  .exec(function (err, carreras) {
    if(err) { return handleError(res, err); }
    return res.json(200, carreras);
  });
};

// Get list of carreras searched by regular Expression
exports.regexCodigo = function(req, res) {
  var regex = new RegExp(req.params.codigo, "i");
  var query = { codigo: regex };
 Carrera.find(query,function (err, carreras) {
    if(err) { return handleError(res, err); }
    return res.json(200, carreras);
  });
};
// Get a single carrera
exports.show = function(req, res) {
  Carrera.findById(req.params.id, function (err, carrera) {
    if(err) { return handleError(res, err); }
    if(!carrera) { return res.send(404); }
    return res.json(carrera);
  });
};

// Creates a new carrera in the DB.
exports.create = function(req, res) {
  Carrera.create(req.body, function(err, carrera) {
    if(err) { return handleError(res, err); }
    return res.json(201, carrera);
  });
};

// Updates an existing carrera in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Carrera.findById(req.params.id, function (err, carrera) {
    if (err) { return handleError(res, err); }
    if(!carrera) { return res.send(404); }
    var updated = _.assign(carrera, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, carrera);
    });
  });
};

// Deletes a carrera from the DB.
exports.destroy = function(req, res) {
  Carrera.findById(req.params.id, function (err, carrera) {
    if(err) { return handleError(res, err); }
    if(!carrera) { return res.send(404); }
    carrera.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
