'use strict';

var express = require('express');
var controller = require('./clase.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

router.post('/crearActividad/:id', auth.isAuthenticated(), controller.crearActividad);
router.get('/horario/:id', controller.indexByHorario);
router.get('/horario/aprobados/:id', controller.indexAprobadosByHorario);
router.post('/', controller.create);
router.post('/horario/nuevo', controller.createForNewHorario);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
