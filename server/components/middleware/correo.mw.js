'use strict';
var compose = require('composable-middleware');
var Docente = require('../../api/docente/docente.model');
var User = require('../../api/user/user.model');
var Actividad = require('../../api/actividad/actividad.model');
var Representante = require('../../api/representante/representante.model');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'reservasfia@gmail.com',
        pass: 'reserva$'
    }
});

function cambioEstado(){
return compose()
.use(function(req, res, next){
  Actividad.findById(req.params.id)
  .populate('creadoPor')
  .populate('materia','nombre')
  .populate('encargado')
  .exec(function(err, actividad){
   if((req.body.estado !== actividad.estado) && actividad.tipo === 2){
    User.findById(actividad.creadoPor._id, function(err, user){
     if (err) {return next(err)}
     if(!user){return res.send(401);}
       Docente.findById(actividad.encargado._id, function(err, docente){
        if (err) {return next(err)}
         // Turno.find({actividad: actividad._id}, function(err, turnos){
          // if (err) {return next(err)}
             if (user.role == 'representante'){
              Representante.findOne({usuario: user._id}, function(err, representante){
                if(docente.correo && representante.correo){
                   res.render('cambio_estado', {actividad: actividad, nuevoEstado: req.body.estado, comentario: req.body.comentario},function(err, html) {
                    if(err) console.log(err);
                    if(!err){
                     var correos = [];
                      correos.push(docente.correo);
                      correos.push(representante.correo);

                     var mailOptions = {
                         from: 'Reservas FIA-UES <reservasfia@gmail.com>', // sender address
                         to: correos, // list of receivers
                         subject: '¡' + actividad.nombre + ' ' + 'ha cambiado de estado!' , // Subject line
                         html: html
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                          if(error){console.log(error);}
                        });
                    }

                   });
                 }
                   next();
              });
             }else{

              // asumimos que es admin o que es el mismo docente

               if(docente.correo){
                res.render('cambio_estado', {actividad: actividad, nuevoEstado: req.body.estado, comentario: req.body.comentario},function(err, html) {
                 if(err) console.log(err);
                 else {
                  var correos = [];
                  correos.push(docente.correo);
                  var mailOptions = {
                      from: 'Reservas FIA-UES <reservasfia@gmail.com>', // sender address
                      to: correos, // list of receivers
                      subject: '¡' + actividad.nombre + ' ' + 'ha cambiado de estado!',  // Subject line
                      html: html
                     };
                     transporter.sendMail(mailOptions, function(error, info){
                       if(error){console.log(error);}

                     });
                 }
                });
               }
                next();
             }
          //});
       });
    });
   }else{
      next();

   }

  })
});
}

function nuevo(){
 return compose()
 .use(function(res, req, next){
 });
}

exports.cambioEstado = cambioEstado;
