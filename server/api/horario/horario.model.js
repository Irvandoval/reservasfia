'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HorarioSchema = new Schema({
    estado: {type:String, required: true},
    escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true},
    ciclo:  { type: Schema.Types.ObjectId, ref: 'Ciclo', required: true},
   // grupos: [{ type: Schema.Types.ObjectId, ref: 'Clase' }]
});

module.exports = mongoose.model('Horario', HorarioSchema);
