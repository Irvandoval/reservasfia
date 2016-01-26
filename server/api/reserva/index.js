'use strict';

var express = require('express');
var controller = require('./reserva.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
//router.post('/horario/:id', controller.createByHorario);//crea las reservas de un horario
router.post('/choque/detectarChoque', auth.isAuthenticated(), controller.choque);
router.post('/choque/detectarChoqueForHorario', auth.isAuthenticated(), controller.choqueForHorario);
router.put('/:id', auth.hasRole('docente'), controller.update);
router.patch('/:id', auth.hasRole('docente'), controller.update);
router.delete('/:id', auth.hasRole('representante'), controller.destroy);

module.exports = router;
