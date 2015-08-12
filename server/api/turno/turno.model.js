'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TurnoSchema = new Schema({
   inicio: Date,
   fin: Date,
   aulas: [{ type: Schema.Types.ObjectId, ref: 'Aula'}]
});

module.exports = mongoose.model('Turno', TurnoSchema);