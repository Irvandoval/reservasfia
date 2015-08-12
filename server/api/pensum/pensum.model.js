'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PensumSchema = new Schema({
     carrera: { type: Schema.Types.ObjectId, ref: 'Carrera' }
});

module.exports = mongoose.model('Pensum', PensumSchema);