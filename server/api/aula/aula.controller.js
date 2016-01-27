'use strict';

var _ = require('lodash');
var Aula = require('./aula.model');

// Get list of aulas
exports.index = function(req, res) {
  Aula.find()
  .sort({'nombre': 1})
  .exec(function (err, aulas) {
    if(err) { return handleError(res, err); }
    return res.json(200, aulas);
  });
  return;
};

// Obtiene la lista de aulas disponibles dada una expresion regular
exports.regexNombre = function(req, res) {
  var regex = new RegExp(req.params.nombre, "i");
  var query = {nombre: regex, estado: true};
  Aula.find(query,function (err, aulas) {
    if(err) return handleError(res, err);
    return res.json(200, aulas);
  });
};

// Get a single aula
exports.show = function(req, res) {
  Aula.findById(req.params.id, function (err, aula) {
    if(err) { return handleError(res, err); }
    if(!aula) { return res.send(404); }
    return res.json(aula);
  });
};

// Creates a new aula in the DB.
exports.create = function(req, res) {
  Aula.create(req.body, function(err, aula) {
    if(err) { return handleError(res, err); }
    return res.json(201, aula);
  });
};

// Updates an existing aula in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Aula.findById(req.params.id, function (err, aula) {
    if (err) { return handleError(res, err); }
    if(!aula) { return res.send(404); }
    var updated = _.assign(aula, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, aula);
    });
  });
};

// Deletes a aula from the DB.
exports.destroy = function(req, res) {
  Aula.findById(req.params.id, function (err, aula) {
    if(err) { return handleError(res, err); }
    if(!aula) { return res.send(404); }
    aula.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
