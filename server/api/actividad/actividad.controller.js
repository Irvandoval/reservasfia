'use strict';
var moment = require('moment');
var _ = require('lodash');
var Actividad = require('./actividad.model');
var Representante = require('../representante/representante.model');
var Reserva = require('../reserva/reserva.model');
var Turno = require('../turno/turno.model')
// Get list of actividades
exports.index = function(req, res) {
  Actividad
  .find()
  .populate('materia')
  .populate('creadoPor')
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
  .exec(function (err, actividades) {
   if(err) { return handleError(res, err); }
   return res.status(200).json(actividades);
  });
};
exports.indexMisAprobados = function(req, res) {
 console.log(req.user);
  Actividad
  .find({estado:'aprobado', encargado: req.user.name})
  .populate('materia','nombre')
  .exec(function (err, actividades) {
   if(err) { return handleError(res, err); }
   return res.status(200).json(actividades);
  });
};

exports.indexDesaprobados = function(req, res) {
  Actividad
  .find({estado:'desaprobado'})
 // .populate('turnos')
 // .populate('aulas')
   .populate('materia','nombre')
   .exec(function (err, actividades) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(actividades);
   });
};
exports.indexMisDesaprobados = function(req, res) {
 console.log(req.user);
  Actividad
  .find({estado:'desaprobado', encargado: req.user.name})
  .populate('materia','nombre')
  .exec(function (err, actividades) {
   if(err) { return handleError(res, err); }
   return res.status(200).json(actividades);
  });
};
exports.indexEspera = function(req, res) {
  Actividad
  .find({estado: 'espera_admin'})
 // .populate('turnos')
 // .populate('aulas')
  .populate('materia','nombre')
  .exec(function (err, actividades) {
   if(err) { return handleError(res, err); }
   return res.status(200).json(actividades);
  });
};



exports.indexEsperaEscuelaA= function(req, res) {
  /*Actividad
  .find({estado: 'espera_escuela'})
  .populate('materia','nombre')
  .exec(function (err, actividades) {
   if(err) { return handleError(res, err); }
   return res.status(200).json(actividades);
  });*/

  Representante
  .findOne({usuario: req.user._id}, function(err, representante){
   console.log(req.user._id);
     Actividad
     .find({estado: 'espera_escuela', escuela: representante.escuela}, function(err, actividades){
        if(err) { return handleError(res, err); }
         return res.status(200).json(actividades);
     })

  })
};

exports.indexEsperaEscuelaB = function(req, res) {
  Representante
  .findOne({usuario: req.user._id}, function(err, representante){
   console.log("rep");
   console.log(representante);
     Actividad
     .find({estado: 'espera_escuela', escuela: representante.escuela})
     .populate('materia','nombre')
     .exec(function(err, actividades){
        if(err) { return handleError(res, err); }
         return res.status(200).json(actividades);
     });
  })
};

exports.indexDesaprobadosByEscuela = function(req, res) {
  Representante
  .findOne({usuario: req.user._id}, function(err, representante){
     Actividad
     .find({estado: 'desaprobado_escuela', escuela: representante.escuela})
     .populate('materia','nombre')
     .exec(function(err, actividades){
        if(err) { return handleError(res, err); }
         return res.status(200).json(actividades);
     });

  })
};

exports.indexByEscuela = function(req, res) {
  Representante
  .findOne({usuario: req.user._id}, function(err, representante){
     Actividad
     .find({$and: [{ $or: [{estado:'espera_admin'},{estado:'aprobado'},{estado: 'desaprobado'}] },{ escuela: representante.escuela}]})
     .populate('materia','nombre')
     .exec(function(err, actividades){
        if(err) { return handleError(res, err); }
         return res.status(200).json(actividades);
     });

  })
};
exports.indexMisEspera = function(req, res) {
 console.log(req.user);
  Actividad
  .find({$or:[{estado:'espera_escuela'},{estado:'espera_admin'}], encargado: req.user.name})
  .populate('materia','nombre')
  .exec(function (err, actividades) {
   if(err) { return handleError(res, err); }
   return res.status(200).json(actividades);
  });
};

exports.comprobante = function(req, res){
console.log(req.params.id);
 Actividad
 .findById(req.params.id)
 .populate('materia')
 .populate('escuela')
 .populate('creadoPor')
 .exec(function(err,actividad){
    console.log("traen");
    console.log(actividad);
     if(err) { return handleError(res, err); }
     Turno.find({actividad:req.params.id})
     .populate('aulas')
     .exec(function(err, turnos){
       if(err) { return handleError(res, err); }
        res.render('comprobante', { title: 'ejs',actividad : actividad ,turnos:turnos, moment:moment});

     });

   });


}
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
  req.body.actividad.fechaCreacion = Date.now();
  Actividad.create(req.body.actividad, function(err, actividad) {
    var opts = { path: 'materia',select:'nombre'};
    Actividad.populate(actividad, opts, function(err,actividadPop){
      if(err) { return handleError(res, err);}
      var nuevaActividad = new Actividad(actividadPop);
      nuevaActividad.crearTurnos(req.body.turnos,function(){
        return res.status(201).json(actividadPop);
      });
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

   Reserva.find({actividad:req.params.id}).remove(function(){
       Turno.find({actividad:req.params.id}).remove(function(){
        Actividad.findById(req.params.id, function (err, actividad) {
          if(err) { return handleError(res, err); }
          if(!actividad) { return res.status(404).send('Not Found'); }
          actividad.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
          });
        });

       })
   });

};

function handleError(res, err) {
  return res.status(500).send(err);
}
