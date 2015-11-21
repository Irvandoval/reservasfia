'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RepresentanteSchema = new Schema({
 nombre: { type: String, required: true },// Nombre del representante
 escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true},
 usuario: {type: Schema.Types.ObjectId, ref: 'User' } 
});

module.exports = mongoose.model('Representante', RepresentanteSchema);
