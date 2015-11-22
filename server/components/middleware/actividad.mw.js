'use strict';
var compose = require('composable-middleware');
var Turno = require('../../api/turno/turno.model');
var Actividad = require('../../api/actividad/actividad.model');
var Reserva = require('../../api/reserva/reserva.model');

// esta funcion elimina reservas del sistema si se ha cancelado la actividad
function actividadCancelada(){
return compose()
.use(function(req,res,next){
     if (req.body.estado === 'cancelado'){
      Reserva.remove({actividad: req.params.id},function(){
          next();
      })
     }else{
       next();
     }
});
}
exports.actividadCancelada = actividadCancelada;
