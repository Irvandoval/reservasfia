'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RepresentanteSchema = new Schema({
 nombre: { type: String, required: true },// Nombre del docente
 escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true},
 usuario: {type: Schema.Types.ObjectId, ref: 'Usuario' } 
});

module.exports = mongoose.model('Representante', RepresentanteSchema);
