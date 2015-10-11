'use strict';

var express = require('express');
var controller = require('./actividad.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
router.get('/aprobados', auth.isAuthenticated(), controller.indexAprobados);
router.get('/misaprobados', auth.isAuthenticated(), controller.indexMisAprobados);
router.get('/espera',auth.isAuthenticated(), controller.indexEspera);
router.get('/misespera', auth.isAuthenticated(),controller.indexEspera);
router.get('/desaprobados', controller.indexDesaprobados);
router.get('/misdesaprobados',auth.isAuthenticated(), controller.indexMisDesaprobados);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
