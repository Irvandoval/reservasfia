'use strict';
var Turno = require('../turno/turno.model');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClaseSchema = new Schema({
   tipo: {type: String, required:true},// GT, GD, GL
   numero: {type: Number, required: true},//  01, 02, etc
   cupo: {type: Number, required: true},
   dia1: {type: Number, required:true},// si son lunes y miercoles las clases, este sería 1
   dia2: { type: Number, required: false},// este 3
   franja1: { type: Schema.Types.ObjectId, ref: 'Franja', required: true },
   franja2: { type: Schema.Types.ObjectId, ref: 'Franja', required: false },
   aula:  { type: Schema.Types.ObjectId, ref: 'Aula', required: true},
   materia: { type: Schema.Types.ObjectId, ref: 'Materia', required: true },// materia a la que pertenece la clase
   ciclo: { type: Schema.Types.ObjectId, ref: 'Ciclo' },// ciclo en que es impartida la clase
   docente: { type: Schema.Types.ObjectId, ref: 'Docente' }, //docente encargado de la clase
   actividad: { type: Schema.Types.ObjectId, ref: 'Actividad' }, //actividad de la que forma parte la clase
   horario: { type: Schema.Types.ObjectId, ref: 'Horario', required: true },
   aprobado: { type: Boolean }
});

ClaseSchema.index({materia: 1, tipo: -1, numero: 1, horario: 1}, {unique: true});
// valida si el index ya existe
function validarIndex(value, respond){
 var self = this;
 self.constructor.findOne({materia: self.materia, tipo: self.tipo,  numero: value, horario: self.horario},
   function(err, clase){
     if(err) console.log(err);
     if(clase) return respond(false);
     return respond(true);
 });
}

ClaseSchema.statics.crearTurnoClase = function crearTurnoClase(dia, clase, actividad){

    if(dia.getDay() ===  clase.dia1){
     var dia1Inicial = new Date(dia);
     var dia1Final = new Date(dia);

     dia1Inicial.setHours(clase.franja1.horaInicio)
     dia1Inicial.setMinutes(clase.franja1.minutoInicio);

     dia1Final.setHours(clase.franja1.horaFinal)
     dia1Final.setMinutes(clase.franja1.minutoFinal);
    Turno.create({
        inicio: dia1Inicial,
        fin: dia1Final,
        actividad: actividad,
        aulas: [clase.aula]
    }, function(err, turno){
     if(err) console.log(err);
    });
    }

   if(clase.dia2 && dia.getDay() === clase.dia2){
    var dia2Inicial =  new Date(dia);
    var dia2Final = new Date(dia);
    dia2Inicial.setHours(clase.franja2.horaInicio)
    dia2Inicial.setMinutes(clase.franja2.minutoInicio);

    dia2Final.setHours(clase.franja2.horaFinal)
    dia2Final.setMinutes(clase.franja2.minutoFinal);

   Turno.create({
       inicio: dia2Inicial,
       fin: dia2Final,
       actividad: actividad,
       aulas: [clase.aula]
   }, function(err, turno){
    if(err) console.log(err);
   });
   }

   return;
};
module.exports = mongoose.model('Clase', ClaseSchema);
