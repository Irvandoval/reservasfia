'use strict';
var compose = require('composable-middleware');
var Turno = require('../../api/turno/turno.model');
var Actividad = require('../../api/actividad/actividad.model');
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
  Actividad.findOne({req.params.id})
  .populate('creadoPor')
  .exec(function(err, actividad){
    //
  })
});
}

function nuevo(){

}
enviarCorreoCambio: function(){
 var mailOptions = {
     from: 'Reservas FIA-UES <reservasfia@gmail.com>', // sender address
     to: 'irvandoval@gmail.com', // list of receivers
     subject: 'Estado actual de su solicitud', // Subject line
     html: '<b>Hola mundo ✔</b>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
    console.log('Message sent: ' + info.response);

    });
}
