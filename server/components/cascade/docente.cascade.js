'use strict';
var compose = require('composable-middleware');

var Actividad = require('../../api/actividad/actividad.model');
var Reserva = require('../../api/reserva/reserva.model');
var User = require('../../api/user/user.model');
var Docente = require('../../api/docente/docente.model');
var Turno = require('../../api/turno/turno.model');

function docente(){

 return compose()
 .use(function(req, res, next){
   Docente.findById(req.params.id, function(err, docente){
    if (err) {return handleError(res, err);}
    User.findById(docente.usuario, function(err, user){
          Actividad.find({creadoPor: user._id}, function(err, actividades){
           if (err) {return handleError(res, err);}
           for (var i = 0; i < actividades.length; i++) {
             (function(it) {
               Reserva.find({
                 actividad: actividades[it]._id
               }).remove();
             })(i)
           }
           for (var i = 0; i < actividades.length; i++) {
             (function(it) {
               Turno.find({
                 actividad: actividades[it]._id
               }).remove();
             })(i)
           }
          }).remove(); //
    }).remove(function(){
        next();
    });
   });
 });

}

exports.docente = docente;
