'use strict';

var _ = require('lodash');
var Actividad = require('./actividad.model');

// Get list of actividades
exports.index = function(req, res) {
  Actividad
  .find()
  .populate('materia')
  .exec(function (err, docs) {
    if(err) { return handleError(res, err); }
    Actividad.populate(docs, {
      path: 'turnos.aulas',
      model: 'Aula',
      select: 'nombre'
    }, function(err,actividades){
      if(err) { return handleError(res, err); }
      return res.status(200).json(actividades);
    });
  });
};

exports.indexAprobados = function(req, res) {
  Actividad
  .find({estado:'aprobado'})
  .populate('materia','nombre')
  .exec(function (err, docs) {
    if(err) { return handleError(res, err); }
    Actividad.populate(docs, {
      path: 'turnos.aulas',
      model: 'Aula',
      select: 'nombre'
    }, function(err,actividades){
      if(err) { return handleError(res, err); }
      return res.status(200).json(actividades);
    });
  });
};

exports.indexDesaprobados = function(req, res) {
  Actividad
  .find({estado:'desaprobado'})
  .populate('turnos')
  .populate('aulas')
  .exec(function (err, docs) {
    if(err) { return handleError(res, err); }
    Actividad.populate(docs, {
      path: 'turnos.aulas',
      model: 'Aula',
      select: 'nombre'
    }, function(err,actividades){
      if(err) { return handleError(res, err); }
      return res.status(200).json(actividades);
    });
  });
};

exports.indexEspera = function(req, res) {
  Actividad
  .find({estado: 'en espera'})
  .populate('turnos')
  .populate('aulas')
  .populate('materia','nombre')
  .exec(function (err, docs) {
    if(err) { return handleError(res, err); }
    Actividad.populate(docs, {
      path: 'turnos.aulas',
      model: 'Aula',
      select: 'nombre'
    }, function(err,actividades){
      if(err) { return handleError(res, err); }
      return res.status(200).json(actividades);
    });
  });
};

// Get a single actividad
exports.show = function(req, res) {

  Actividad
  .findById(req.params.id)
  .populate('materia','nombre')
  .exec(function (err, actividad) {
    if(err) { return handleError(res, err); }
    if(!actividad) { return res.status(404).send('Not Found'); }
    return res.json(actividad);
  });
};

// Creates a new actividad in the DB.
exports.create = function(req, res) {
  req.body.fechaCreacion = Date.now();
  Actividad.create(req.body, function(err, actividad) {

    var opts = { path: 'materia',select:'nombre'};
    Actividad.populate(actividad,opts, function(err,actividad){
      if(err) { return handleError(res, err); }
     return res.status(201).json(actividad);
    })

  });
};

// Updates an existing actividad in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Actividad.findById(req.params.id, function (err, actividad) {
    if (err) { return handleError(res, err); }
    if(!actividad) { return res.status(404).send('Not Found'); }
    var updated = _.merge(actividad, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(actividad);
    });
  });
};

// Deletes a actividad from the DB.
exports.destroy = function(req, res) {
  Actividad.findById(req.params.id, function (err, actividad) {
    if(err) { return handleError(res, err); }
    if(!actividad) { return res.status(404).send('Not Found'); }
    actividad.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
