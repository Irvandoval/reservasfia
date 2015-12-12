'use strict';
var compose = require('composable-middleware');
var Turno = require('../../api/turno/turno.model');
var Actividad = require('../../api/actividad/actividad.model');
var Reserva = require('../../api/reserva/reserva.model');

function turno(){
 return compose()
 .use(function(req, res, next){

  Turno.findById(req.params.id, function(err, turno){
   if (err) {return next(err)}
   if(turno){
      Reserva.findOne({actividad: turno.actividad, inicio: turno.inicio, fin: turno.fin}, function(err, reserva){
         if (err) {return next(err)}
         if(reserva)
          reserva.remove();
         next();
      });
  }else{
   next();
  }
  });
 });
}

exports.turno = turno;
