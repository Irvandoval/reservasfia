'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RepresentanteSchema = new Schema({
 nombre: { type: String, required: true },// Nombre del representante
 escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true},
 usuario: {type: Schema.Types.ObjectId, ref: 'User', required: false},
 correo: {type: String, required: false}
});

RepresentanteSchema
.path('nombre')
.validate(function(nombre){
 return /([a-z ñáéíóú]{2,60})/i.test(nombre);
}, 'Nombre Inválido');

RepresentanteSchema
.path('correo')
.validate(function(correo){
 return /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/i.test(correo);
}, 'Correo Inválido');
module.exports = mongoose.model('Representante', RepresentanteSchema);
