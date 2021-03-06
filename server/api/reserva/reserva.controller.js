'use strict';

var _ = require('lodash');
var Reserva = require('./reserva.model');
var Actividad = require('../actividad/actividad.model');
//detecta choque de horarios recibe un array de reservas en req.body.data
exports.choque = function(req, res) {
 var reservas = req.body.data;
 var choque = false;
 var u = 0;
 (function detectaChoque(i, choq, rsv){
   if(choq === false && i < rsv.length){
    var nuevaReserva =  new Reserva(rsv[i]);
    nuevaReserva.detectarChoque(function(err, reserva){
      if(reserva){
         choq = true;
         i++;
         detectaChoque(i,choq,rsv);
      }else{
         i++;
         detectaChoque(i,choq,rsv);
      }
    });
   }else{
    console.log(choq);
       if(choq === false)
        return res.status(200).json({exito: true})
       else
        return handleError(res,'Se detecto un choque');
   }
 }(u, choque, reservas));
}

 //detecta choque de horarios recibe un array de reservas en req.body.data
 exports.choqueForHorario = function(req, res) {
  var reservas = req.body.data; //
  var choque = false;
  var actividadChoque = {};
  var k = 0;
  (function detectarChoque(i, rvs, choq,achoq){
   if(choq === false &&  i < rvs.length){
      var nuevaReserva =  new Reserva(rvs[i]);
      nuevaReserva.detectarChoque(function(err, reserva){
         if(reserva){
          console.log("entra choq");
          choq =  true;
          Actividad.findById(reserva.actividad)
          .populate('escuela')
          .populate('materia')
          .exec(function(err, actividad){
           if(!err){
            i++;
             detectarChoque(i, rvs, choq, actividad);
           }
          });
         }else{
           i++;
           detectarChoque(i, rvs, choq, achoq);
       }
      });
   }else{
    return res.status(200).json({choque: choq, actividad: achoq});
   }
  }(k, reservas, choque, actividadChoque));
 };
  // Get list of reservas de un rango especifico de dias /api/reservas?inicio=aaaa-mm-dd&fin=aaaa-mm-dd
exports.index = function(req, res) {
  Reserva
    .find({
      $and: [{
        inicio: {
          $gte: new Date(req.query.inicio)
        }
      }, {
        fin: {
          $lte: new Date(req.query.fin)
        }
      }]
    })
    .populate('aula')
    .populate('actividad')
    .exec(function(err, reservas) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(reservas);
    });
};


// Get a single reserva
exports.show = function(req, res) {
  Reserva.findById(req.params.id, function(err, reserva) {
    if (err) {
      return handleError(res, err);
    }
    if (!reserva) {
      return res.status(404).send('Not Found');
    }
    return res.json(reserva);
  });
};

// Creates a new reserva in the DB.
exports.create = function(req, res) {
      Reserva.create(req.body, function(err, reserva) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(reserva);
      });
};

/*exports.createByHorario =  function(req, res){
 Horario.findById(req.params.id, function(err, horario){
  Clase.find({horario: horario._id}, function(err, clases){
   var i = 0;
    (function ingresarReservas(cls){
     if(i < cls.length){
      Actividad.findById(cls[i].actividad._id, function(err, actividad){
       Turno.find({actividad: actividad._id}, function(err, turnos){
          turnos.forEach(function(turno) {
            var auxReserva = {
              aula: turno.aulas[0],
              inicio: turno.inicio,
              fin: turno.fin,
              actividad: turno.actividad
            };
            Reserva.create(auxReserva);
          });
          i++;
          ingresarReservas(cls);
       })
      })
     }else{
      return res.status(201).json({exito: true});
     }
    }(clases));
  })
 })
};*/

// Updates an existing reserva in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Reserva.findById(req.params.id, function(err, reserva) {
    if (err) {
      return handleError(res, err);
    }
    if (!reserva) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(reserva, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(reserva);
    });
  });
};

// Deletes a reserva from the DB.
exports.destroy = function(req, res) {
  Reserva.findById(req.params.id, function(err, reserva) {
    if (err) {
      return handleError(res, err);
    }
    if (!reserva) {
      return res.status(404).send('Not Found');
    }
    reserva.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
