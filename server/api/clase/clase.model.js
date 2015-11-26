'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClaseSchema = new Schema({
   tipo: String, // GT, GD, GL
   numero: String,//  01, 02, etc
   cupo: Number,
   dia1: String,// si son lunes y miercoles las clases, este sería LUNES
   dia2: { type: String, required: false },// este MIERCOLES
   franja1: { type: Schema.Types.ObjectId, ref: 'Franja' },
   franja2: { type: Schema.Types.ObjectId, ref: 'Franja', required: false },
   materia: { type: Schema.Types.ObjectId, ref: 'Materia' },// materia a la que pertenece la clase
   ciclo: { type: Schema.Types.ObjectId, ref: 'Ciclo' },// ciclo en que es impartida la clase
   docente: { type: Schema.Types.ObjectId, ref: 'Docente' }, //docente encargado de la clase
   horario: { type: Schema.Types.ObjectId, ref: 'Horario'}
});

module.exports = mongoose.model('Clase', ClaseSchema);
