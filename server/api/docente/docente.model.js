'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DocenteSchema = new Schema({
  nombre: { type: String, required: true },// Nombre del docente
  escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true}, //escuela a la que pertenece
  materias: [ {type: Schema.Types.ObjectId, ref: 'Materia', required: false} ],//materias que imparte
  usuario: {type: Schema.Types.ObjectId, ref: 'User', required: false },// el usuario en el sistema
  correo: {type: String, required: false}
});

DocenteSchema
.path('nombre')
.validate(function(nombre){
 return /([a-z ñáéíóú]{2,60})/i.test(nombre);
}, 'Nombre Inválido');

DocenteSchema
.path('correo')
.validate(function(correo){
 return /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/i.test(correo);
}, 'Correo Inválido');

module.exports = mongoose.model('Docente', DocenteSchema);
