'use strict';

var _ = require('lodash');
var Horario = require('./horario.model');

var xlsx2json = require('xlsx-json');
var Clase =  require('../clase/clase.model');
var Ciclo =  require('../ciclo/ciclo.model');
var Actividad =  require('../actividad/actividad.model');
var Turno =  require('../turno/turno.model');
var done =  true;

exports.xlstojson = function(req, res) {
    var task = [
    {
        "input":  req.file.path,
        "sheet":  "sheetName1",
        "output": null
    }
]
 xlsx2json(task, function(err, jsonArr) {
    if (err) {
        console.log(err);
        return res.json(404,err);
    }
    console.log(jsonArr);
    return res.json(200,jsonArr);
});

}

// Get list of horarios
exports.index = function(req, res) {
  Horario.find({estado: {$ne: 'plantilla'}})
  .populate('escuela')
  .populate('ciclo')
  .exec(function (err, horarios) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(horarios);
  });
};

// Get a single horario
exports.show = function(req, res) {
  Horario.findById(req.params.id, function (err, horario) {
    if(err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    return res.json(horario);
  });
};
// send a render with the clases from a horario
exports.reporte =  function(req, res) {
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
      if(!clases) { return res.status(404).send('Not Found'); }
     var clas=  clases.sort(function(a, b){
       if(a.materia.nombre < b.materia.nombre) return -1;
       if(a.materia.nombre > b.materia.nombre) return 1;
       return 0;
   })
     res.render('horario', {
       clases: clases,
       horario: horario,
       k: 1
     });
    });
  })
};
// Get a single horario
exports.showByCicloAndEscuela = function(req, res) {
  Horario.findOne({escuela: req.query.escuela, ciclo: req.query.ciclo, estado: {$ne: 'plantilla'}}, function (err, horario) {
    if(err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    return res.json(horario);
  });

};

// Creates a new horario in the DB.
exports.create = function(req, res) {
  Horario.create(req.body, function(err, horario) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(horario);
  });
};

exports.createPlantilla =  function(req, res){
 req.body.estado = 'borrador';
 Horario.create (req.body, function(err, horario){
   if(err) { return handleError(res, err); }
   Horario.findOne({estado: 'plantilla', escuela: req.body.escuela}, function(err, plantilla){
         Clase.find({horario: plantilla._id}, function(err, clases){
             if(err) { return handleError(res, err); }
              clases.forEach(function(clase) {
                Clase.create({
                  tipo: clase.tipo,
                  numero: clase.numero,
                  cupo: clase.cupo,
                  franja1: clase.franja1,
                  franja2: clase.franja2,
                  dia1: clase.dia1,
                  dia2: clase.dia2,
                  aula: clase.aula,
                  materia: clase.materia,
                  ciclo: req.body.ciclo,
                  docente: clase.docente,
                  horario: horario._id,
                  aprobado: clase.aprobado
                }, function(err, clase){
                       if (err) console.log(err);
                });
             });

           return res.status(200).json(horario);
         });
   })
 })
}

exports.mandarHorario =  function(req, res) {

 Ciclo.findById(req.body.ciclo, function(err, ciclo){
   if(err) { return handleError(res, err); }
   var cAnio = ciclo.anio;
   var di = ciclo.inicioClases.getDate();
   var mi = ciclo.inicioClases.getMonth();
   var ai = ciclo.inicioClases.getFullYear();
   var df = ciclo.finClases.getDate();
   var mf = ciclo.finClases.getMonth();
   var af = ciclo.finClases.getFullYear();

  Clase.find({horario: req.body.horario})
  .populate('franja1')
  .populate('franja2')
  .populate('materia')
  .exec(function(err, clases){
     if(err) { return handleError(res, err); }
     if(!clases) { return res.status(404).send('Not Found'); }
     var i = 0;
    (function crearActividad(cls){
     if(i < cls.length){
      Actividad.create({
       nombre: cls[i].materia.codigo + ' ' + cls[i].tipo + ' ' + cls[i].numero, // DSI115 GT 01
       tipo: 1,
       materia: cls[i].materia._id,
       escuela: cls[i].materia.escuela,
       encargado: cls[i].docente,
       estado: 'espera_admin',
       fechaCreacion: new Date(),
       creadoPor: req.user._id,
       ciclo: req.body.ciclo
      }, function(err, actividad){
           if(err) { return handleError(res, err); }
           for (var d = new Date(ai, mi, di); d <= new Date(af, mf, df); d.setDate(d.getDate() + 1)) {
                 (function(diya){
                  Clase.crearTurnoClase(diya, cls[i], actividad);
                  Clase.update({_id: cls[i]._id},{actividad: actividad._id}, function(err){
                   if(err) console.log(err);
                  });
                 }(d));
           }
          i++;
          crearActividad(cls);
      });
     }else{
        Horario.update({_id: req.body.horario},{estado: 'enviado_admin'}, function(err){
         if(err) console.log(err);
        })
        return res.status(200).json({exito: true});
     }
    }(clases));

  });
});
};
// Updates an existing horario in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Horario.findById(req.params.id, function (err, horario) {
    if (err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    var updated = _.merge(horario, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(horario);
    });
  });
};

// Deletes a horario from the DB.
exports.destroy = function(req, res) {
  Horario.findById(req.params.id, function (err, horario) {
    if(err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    horario.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};



function handleError(res, err) {
  return res.status(500).send(err);
}
