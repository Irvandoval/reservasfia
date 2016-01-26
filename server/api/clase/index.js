'use strict';

var express = require('express');
var controller = require('./clase.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);

router.post('/crearActividad/:id', auth.isAuthenticated(), controller.crearActividad);
router.get('/horario/:id', auth.isAuthenticated(), controller.indexByHorario);
router.get('/horario/aprobados/:id', auth.isAuthenticated(), controller.indexAprobadosByHorario);
router.post('/', auth.hasRole('representante'), controller.create);
router.post('/horario/nuevo', auth.hasRole('representante'), controller.createForNewHorario);
router.put('/:id', auth.hasRole('representante'), controller.update);
router.patch('/:id', auth.hasRole('representante'), controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
