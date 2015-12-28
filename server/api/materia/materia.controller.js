'use strict';

var _ = require('lodash');
var Materia = require('./materia.model');

// Get list of materias
exports.index = function(req, res) {
  Materia.find()
  .populate('escuela')
  .populate('carreras')
  .exec(function (err, materias) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(materias);
  });
};
exports.indexByEscuela = function(req, res) {
  Materia.find({escuela: req.params.id})
  .populate('escuela')
  .populate('carreras')
  .sort({'nombre': 1})
  .exec(function (err, materias) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(materias);
  });
};

// Get list of aulas search by regular Expression
exports.regexNombre = function(req, res) {
  var regex = new RegExp(req.params.nombre, "i");
  var query = { codigo: regex };
 Materia.find(query,function (err, materias) {
    if(err) { return handleError(res, err); }
    return res.json(200, materias);
  });
};

// Get a single materia
exports.show = function(req, res) {
  Materia.findById(req.params.id)
  .populate('carreras')
  .exec(function (err, materia) {
    if(err) { return handleError(res, err); }
    if(!materia) { return res.status(404).send('Not Found'); }
    return res.json(materia);
  });
};

// Creates a new materia in the DB.
exports.create = function(req, res) {
  Materia.create(req.body, function(err, materia) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(materia);
  });
};

// Updates an existing materia in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Materia.findById(req.params.id, function (err, materia) {
    if (err) { return handleError(res, err); }
    if(!materia) { return res.status(404).send('Not Found'); }
    var updated = _.assign(materia, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(materia);
    });
  });
};

// Deletes a materia from the DB.
exports.destroy = function(req, res) {
  Materia.findById(req.params.id, function (err, materia) {
    if(err) { return handleError(res, err); }
    if(!materia) { return res.status(404).send('Not Found'); }
    materia.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
