'use strict';

var express = require('express');
var controller = require('./turno.controller');
//var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/estado/aprobados', controller.indexAprobados);
router.get('/estado/espera', controller.indexEnEspera);
router.get('/actividad/:id',controller.indexByActividad);
router.get('/aulas', controller.indexByAula);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
