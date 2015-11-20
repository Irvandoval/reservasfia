'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HorarioSchema = new Schema({
    estado: String,
    escuela: { type: Schema.Types.ObjectId, ref: 'Escuela' },
    ciclo:  { type: Schema.Types.ObjectId, ref: 'Ciclo' },
   // grupos: [{ type: Schema.Types.ObjectId, ref: 'Clase' }]
});

module.exports = mongoose.model('Horario', HorarioSchema);
