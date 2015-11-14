'use strict';

angular.module('reservasApp')
  .controller('RevisarSolicitudCtrl', function($rootScope, $scope, $modal, $resource, ngTableParams, $filter, Actividad) {
    var actividades = [],
      i, j;
    $rootScope.enEspera = new ngTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'asc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'espera'
          }).$promise
          .then(function(actividadesProm) {
            actividades = actividadesProm;
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

      }
    });

    $rootScope.aprobados = new ngTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'desc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'aprobados'
          }).$promise
          .then(function(actividades) {
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

      }
    });


    $rootScope.desaprobados = new ngTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'asc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'desaprobados'
          }).$promise
          .then(function(actividades) {

            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          })

      }
    });

    $scope.detalleReserva = function(idActividad, tipo) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'detalleReserva.html',
        controller: 'DetalleReservaCtrl',
        size: 'lg',
        resolve: {
          actividad: function() {
            return Actividad.get({
              idActividad: idActividad
            }).$promise
          },
          tipo: function(){return tipo}
        }
      });

      modalInstance.result.then(function(actividad) {
        console.log("entro al result");

      }, function() {
        //$log.info('Modal dismissed at: ' + new Date());

      });
    };


  })



.controller('DetalleReservaCtrl', function($rootScope, $scope, $resource,$window,$location, $modalInstance, actividad, tipo, Actividad, Turno, toaster) {
  $scope.actividad = actividad;
  console.log("entra al ctrl");
  $scope.tipo = tipo;
  $scope.diferenciaMinutos = Math.round(((new Date() - new Date(actividad.fechaCreacion)) / 1000 )/60); // minutes
  console.log($scope.diferenciaMinutos);
  $scope.rechazarSolicitud = function(){
    $modalInstance.close(actividad);
    var actividadEditada = nuevaActividad(actividad,'desaprobado');
    Actividad.update({
        idActividad: actividad._id
      }, actividadEditada).$promise
      .then(function() {
        $rootScope.enEspera.reload();
        $rootScope.aprobados.reload();
        $rootScope.desaprobados.reload();
          toaster.pop('success', "Actividad rechazada", "La actividad ahora se ha movido a 'Rechazados'");
      }, function(err) {
        console.log("error");
      });

  };
  $scope.aprobarSolicitud = function() {
    $modalInstance.close(actividad);
    var reservas = {};
    reservas.data = [];
    var turnos = [];
    var actividadEditada = {};
    var cont = 0;
    for (var i =0 ; i< $scope.turnos.length; i++) { // creamos los objetos reservas
      var turno = $scope.turnos[i];
      for (var j =0;j<turno.aulas.length;j++) {
        var aula = turno.aulas[j];
        var nuevaReserva = {
          inicio: turno.inicio,
          fin: turno.fin,
          aula: aula._id,
          actividad: actividad._id
        }
        reservas.data[cont] = nuevaReserva;
        cont++;
      }
      turnos[i] = turno._id;
      console.log(reservas);
    }
    $resource('/api/reservas/choque/detectarChoque').save(reservas).$promise // comprobamos que no haya choque
      .then(function() { // contexto que no detecto choque del array de objetos reserva
        //console.log(reservas);
        for (var i = 0; i < cont; i++) {
          $resource('/api/reservas').save(reservas.data[i]);
        }
        actividadEditada = nuevaActividad(actividad,'aprobado');
        actividadEditada.fechaAprobacion = new Date();
        Actividad.update({
            idActividad: actividad._id
          }, actividadEditada).$promise
          .then(function() {
           // actividad.estado = 'aprobado';
            $rootScope.enEspera.reload();
            $rootScope.aprobados.reload();
            $rootScope.desaprobados.reload();
            //actualizarTurnos(actividadEditada,respuesta);
              toaster.pop('success', "Actividad aprobada", "Las reservas se han cargado en el sistema");
          }, function(err) {
            //error al actualizar
          });
      }, function(err) {
        console.log("ERROR");
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar array");
      });
  };
  $resource('/api/turnos/actividad/:idActividad', {
      idActividad: '@id'
    })
    .query({
      idActividad: $scope.actividad._id
    }, function(turnos) {
      $scope.turnos = turnos;
    });

    $scope.eliminarSolicitud = function(){
     console.log("entra");
      var Actividad = $resource('/api/actividades/:actividadId', {actividadId:'@id'});
     Actividad.delete({actividadId: actividad._id},function(){
      $rootScope.enEspera.reload();
      $rootScope.aprobados.reload();
      $rootScope.desaprobados.reload();
       $modalInstance.dismiss('cancel');
       toaster.pop('success', "Actividad eliminada", "La actividad se ha eliminado del sistema'");
     },function(err){})
    }
   $scope.comprobante = function(){
       $location.path('/api/actividades/comprobante' + actividad._id)
   }
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

   function actualizarTurnos(actividad,respuesta){
    var aulaAux = [];
    for (var g = 0;  g < $scope.turnos.length; g++){
    actividad.estado = respuesta;
     console.log("entra al for g");
          for (var s in $scope.turnos[g].aulas){
             aulaAux[s] = $scope.turnos[g].aulas[s]._id;
          }
       var turnoActualizado = {
         inicio: $scope.turnos[g].inicio,
         fin: $scope.turnos[g].fin,
         actividad: actividad,
         aulas: aulaAux
       };
     Turno.update({idTurno: $scope.turnos[g]._id},turnoActualizado
     , function(){
      console.log("exito al editar turno.....");
     },
     function(err){console.log(err);}
     );

    }
   }
  function nuevaActividad(actividad,respuesta) {
    var actividadEdit = {};
    actividadEdit._id = actividad._id;
    actividadEdit.estado = respuesta;
   // actividadEdit.turnos = turnos;
    actividadEdit.tipo = actividad.tipo;
    actividadEdit.materia =  actividad.materia._id;
    actividadEdit.nombre = actividad.nombre;
    actividadEdit.encargado = actividad.encargado;
    actividadEdit.creadoPor = actividad.creadoPor;
    actividadEdit.fechaCreacion = actividad.fechaCreacion;
    return actividadEdit;
  }
});
