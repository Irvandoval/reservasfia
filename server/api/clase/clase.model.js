'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClaseSchema = new Schema({
   tipo: {type: String, required:true},// GT, GD, GL
   numero: {type: String, required: true},//  01, 02, etc
   cupo: {type: Number, required: true},
   dia1: {type: String, required:true},// si son lunes y miercoles las clases, este sería LUNES
   dia2: { type: String, required: false},// este MIERCOLES
   franja1: { type: Schema.Types.ObjectId, ref: 'Franja', required: true },
   franja2: { type: Schema.Types.ObjectId, ref: 'Franja', required: false },
   materia: { type: Schema.Types.ObjectId, ref: 'Materia', required: true },// materia a la que pertenece la clase
   ciclo: { type: Schema.Types.ObjectId, ref: 'Ciclo'},// ciclo en que es impartida la clase
   docente: { type: Schema.Types.ObjectId, ref: 'Docente'}, //docente encargado de la clase
   actividad: { type: Schema.Types.ObjectId, ref: 'Actividad'}, //actividad de la que forma parte la clase
   horario: { type: Schema.Types.ObjectId, ref: 'Horario', required:true}
});

ClaseSchema.index({materia: 1, tipo: 1, numero: 1}, {unique: true});

module.exports = mongoose.model('Clase', ClaseSchema);
