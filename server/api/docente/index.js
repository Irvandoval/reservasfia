'use strict';

var express = require('express');
var controller = require('./docente.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:id',controller.byuser);
router.get('/escuela/:id',controller.byEscuela);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
