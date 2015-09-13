'use strict';

var _ = require('lodash');
var Turno = require('./turno.model');

// Get list of turnos
exports.index = function(req, res) {
  Turno.find({})
  .populate('aulas')
  .populate('actividad')
  .exec(function(err, turnos) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(turnos);
  })

};

exports.indexByActividad = function(req,res){
 Turno.find({actividad: req.params.id})
 .populate('aulas')
 .populate('actividad')
 .exec(function(err, turnos) {
   if (err) {
     return handleError(res, err);
   }
   return res.status(200).json(turnos);
 });
}

// envia los de tipo evaluacion
exports.indexAprobados = function(req, res){
 Turno.find({$and: [{
   inicio: {
     $gte: new Date(req.query.inicio)
   }
 }, {
   fin: {
     $lte: new Date(req.query.fin)
   }
 }]
})
  .populate('aulas')
  .populate({path: 'actividad', match: {estado: 'aprobado'}})
  .exec(function(err, turnos) {
    if (err) {
      return handleError(res, err);
    }
    var turn = Turno.eliminarTurnoNull(turnos);
    return res.status(200).json(turn);
  });
}
//envia los de tipo clases
exports.indexEnEspera = function(req, res){
 Turno.find({$and: [{
   inicio: {
     $gte: new Date(req.query.inicio)
   }
 }, {
   fin: {
     $lte: new Date(req.query.fin)
   }
 }]
})
 .populate('aulas')
 .populate({path: 'actividad', match: {estado: 'en espera'}})
 .exec(function(err, turnos) {
   if (err) {
     return handleError(res, err);
   }
   var turn = Turno.eliminarTurnoNull(turnos);
   return res.status(200).json(turn);
 });
}
// Get a single turno
exports.show = function(req, res) {
  Turno.findById(req.params.id, function (err, turno) {
    if(err) { return handleError(res, err); }
    if(!turno) { return res.status(404).send('Not Found'); }
    return res.json(turno);
  });
};


// Creates a new turno in the DB.
exports.create = function(req, res) {
  Turno.create(req.body, function(err, turno) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(turno);
  });
};

// Updates an existing turno in the DB.
exports.update = function(req, res) {
  console.log(req.body);
 // if(req.body._id) { delete req.body._id; }
  Turno.findById(req.params.id, function (err, turno) {
    if (err) { return handleError(res, err); }
    if(!turno) { return res.status(404).send('Not Found'); }
    var updated = _.extend(turno, req.body);
    updated.actividad.estado = req.body.actividad.estado;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(turno);
    });
  });
};

// Deletes a turno from the DB.
exports.destroy = function(req, res) {
  Turno.findById(req.params.id, function (err, turno) {
    if(err) { return handleError(res, err); }
    if(!turno) { return res.status(404).send('Not Found'); }
    turno.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
