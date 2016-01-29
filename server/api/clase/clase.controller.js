'use strict';

var _ = require('lodash');
var Clase = require('./clase.model');
var Actividad = require('../actividad/actividad.model');
var Horario =  require('../horario/horario.model');
var Ciclo = require('../ciclo/ciclo.model');
// Get list of clases
exports.index = function(req, res) {
  Clase.find({})
  .populate('docente', 'nombre')
  .populate('materia')
  .populate('franja1', 'franja')
  .populate('franja2', 'franja')
  .populate('aula', 'nombre')
  .sort({'tipo': -1, 'numero': 1})
  .exec(function (err, clases) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(clases);
  });
};
exports.indexAprobadosByHorario =  function(req, res) {
  Horario.findById(req.params.id)
  .populate('escuela')
  .populate('ciclo')
  .exec(function(err,horario){
    Clase.find({horario: horario._id, aprobado: true})
    .populate('materia')
    .populate('docente')
    .populate('franja1')
    .populate('franja2')
    .populate('aula')
    .sort({'tipo': -1, 'numero': 1})
    .exec(function(err, clases){
      if(!horario) { return res.status(404).send('Not Found'); }
     var clas=  clases.sort(function(a, b){
       if(a.materia.nombre < b.materia.nombre) return -1;
       if(a.materia.nombre > b.materia.nombre) return 1;
       return 0;
   })
     return res.status(200).json(clases);
    });
  })
};
exports.crearActividad =  function(req, res){
 Ciclo.findById(req.body.ciclo, function(err, ciclo){
 if(err) { return handleError(res, err); }
 console.log(ciclo);
 var cAnio = ciclo.anio;
 var di = ciclo.inicioClases.getDate();
 var mi = ciclo.inicioClases.getMonth();
 var ai = ciclo.inicioClases.getFullYear();
 var df = ciclo.finClases.getDate();
 var mf = ciclo.finClases.getMonth();
 var af = ciclo.finClases.getFullYear();

 Clase.findById(req.params.id)
 .populate('franja1')
 .populate('franja2')
 .populate('materia')
 .exec(function(err, clasex){
  Actividad.create({
   nombre: clasex.materia.codigo + ' ' + clasex.tipo + ' ' + clasex.numero, // DSI115 GT 01
   tipo: 1,
   materia: clasex.materia._id,
   escuela: clasex.materia.escuela,
   encargado: clasex.docente,
   estado: 'espera_admin',
   fechaCreacion: new Date(),
   creadoPor: req.user._id,
   ciclo: req.body.ciclo
  }, function(err, actividad){
   if(err) { return handleError(res, err); }
   for (var d = new Date(ai, mi, di); d <= new Date(af, mf, df); d.setDate(d.getDate() + 1)) {
         (function(diya){
          Clase.crearTurnoClase(diya, clasex, actividad);
          Clase.update({_id: clasex._id},{actividad: actividad._id}, function(err){
           if(err) console.log(err);
          });
         }(d));
   }
    return res.status(200).json({exito: true});
  })
 });

 });

}
exports.indexByHorario = function(req, res) {
  Clase.find({horario: req.params.id})
  .populate('docente', 'nombre')
  .populate('materia')
  .populate('franja1', 'franja')
  .populate('franja2', 'franja')
  .populate('aula', 'nombre')
  .sort({'materia.nombre': 1,'tipo': -1, 'numero': 1})
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

// Creates a new clase in the DB.
exports.createForNewHorario = function(req, res) {
 Clase.find({materia: req.body.materia, horario: req.body.horario}, function(err, clases){
   if(err) { return handleError(res, err); }
   console.log(clases.length);
   if(clases.length === 0){
    Clase.create(req.body, function(err, clase) {
      if(err) { return handleError(res, err); }
      return res.status(201).json(clase);
    });
   }else
   return handleError(res, 'Ya se ha creado por lo menos 1 grupo para esa materia');
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
