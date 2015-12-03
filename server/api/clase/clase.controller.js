'use strict';

var _ = require('lodash');
var Clase = require('./clase.model');

// Get list of clases
exports.index = function(req, res) {
  Clase.find({})
  .populate('docente', 'nombre')
  .populate('materia')
  .populate('franja1', 'franja')
  .populate('franja2', 'franja')
  .populate('aula', 'nombre')
  .sort({'_id': 1, 'materia.nombre': -1, 'tipo': -1, 'numero': 1})
  .exec(function (err, clases) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(clases);
  });
};

exports.indexByHorario = function(req, res) {
  Clase.find({horario: req.params.id})
  .populate('docente', 'nombre')
  .populate('materia')
  .populate('franja1', 'franja')
  .populate('franja2', 'franja')
  .populate('aula', 'nombre')
  .sort({'materia.nombre': 1, 'tipo': -1, 'numero': 1})
  .exec(function (err, clases) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(clases);
  });
};
// Get a single clase
exports.show = function(req, res) {
  Clase.findById(req.params.id)
  .populate('docente', 'nombre')
  .populate('materia')
  .populate('franja1', 'franja')
  .populate('franja2', 'franja')
  .populate('aula', 'nombre')
  .exec(function (err, clase) {
    if(err) { return handleError(res, err); }
    if(!clase) { return res.status(404).send('Not Found'); }
    return res.json(clase);
  });

};

// Creates a new clase in the DB.
exports.create = function(req, res) {
  Clase.create(req.body, function(err, clase) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(clase);
  });
};

// Updates an existing clase in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Clase.findById(req.params.id, function (err, clase) {
    if (err) { return handleError(res, err); }
    if(!clase) { return res.status(404).send('Not Found'); }
    var updated = _.merge(clase, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(clase);
    });
  });
};

// Deletes a clase from the DB.
exports.destroy = function(req, res) {
  Clase.findById(req.params.id, function (err, clase) {
    if(err) { return handleError(res, err); }
    if(!clase) { return res.status(404).send('Not Found'); }
    clase.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
