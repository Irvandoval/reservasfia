'use strict';

angular.module('reservasApp')
  .controller('RevisarSolicitudCtrl', function ($scope, $resource, ngTableParams, $filter, Actividad, toaster) {
     $scope.enEspera = new ngTableParams({
         page: 1,    // paginacion, primera en mostrar
         count: 5, // cantidad de elementos a mostrar por pagina
         sorting:{
          fechaCreacion: 'asc'
         }
     }, {
         total:0,
         getData: function ($defer, params) {
         Actividad.query({idActividad:'espera'}).$promise
         .then(function(actividades){
          var orderedRecentActivity = params.filter() ?
                        $filter('orderBy')(actividades, params.orderBy()) :
                        actividades;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });
     
     $scope.aprobados = new ngTableParams({
         page: 1,    // paginacion, primera en mostrar
         count: 5, // cantidad de elementos a mostrar por pagina
         sorting:{
          fechaCreacion: 'asc'
         }
     }, {
         total:0,
         getData: function ($defer, params) {
         Actividad.query({idActividad:'aprobados'}).$promise
         .then(function(actividades){
          var orderedRecentActivity = params.filter() ?
                        $filter('orderBy')(actividades, params.orderBy()) :
                        actividades;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });
     
     
      $scope.desaprobados = new ngTableParams({
         page: 1,    // paginacion, primera en mostrar
         count: 5, // cantidad de elementos a mostrar por pagina
         sorting:{
          fechaCreacion: 'asc'
         }
     }, {
         total:0,
         getData: function ($defer, params) {
         Actividad.query({idActividad:'desaprobados'}).$promise
         .then(function(actividades){
          var orderedRecentActivity = params.filter() ?
                        $filter('orderBy')(actividades, params.orderBy()) :
                        actividades;
             params.total(orderedRecentActivity.length);
             $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
         })

         }
     });
     
     $scope.aprobarSolicitud=  function(actividad, index){  
      var reservas = {};
      var turnos = [];
      var cont = 0;
       for(var i in actividad.turnos){// creamos los objetos reservas
            var turno =  actividad.turnos[i];
	      for (var j in turno.aulas){
		 var aula =  turno.aulas[j];
		//console.log(turno.aulas[j]);
		var  nuevaReserva = {
		     inicio: turno.inicio,
		     fin: turno.fin,
		     aula: aula._id,
		     actividad: actividad._id
		  }
		  reservas[cont] = nuevaReserva;
		  cont++;
	      }
	      turnos[i] = turno._id; 
	}
	
	$resource('/api/reservas/choque').save(reservas).$promise // comprobamos que no haya choque
	.then(function(){// contexto que no detecto choque del array de objetos reserva
	   console.log(reservas);
	  for(var i = 0 ; i < cont ; i++){	
		$resource('/api/reservas').save(reservas[i]);
		
	  } 
	 
	   var actividadEditada = nuevaActividad(actividad,turnos);
	Actividad.update({idActividad: actividad._id}, actividadEditada).$promise 
	  .then(function(){
			actividad.estado = 'aprobado';
			$scope.enEspera.reload();
			$scope.aprobados.reload();
			$scope.desaprobados.reload();
			toaster.pop('success', "Actividad aprobada", "Las reservas se han cargado en el sistema");
			
            },function(err){
	      //error
	    });
		    
		
	}, function(err){ toaster.pop('error', "Error", "Ha ocurrido un error al enviar array");});
	
     };
     
    function nuevaActividad(actividad,turnos){
        var actividadEdit = {};	      
	 actividadEdit.estado = 'aprobado';
	 actividadEdit.turnos = turnos;
	 actividadEdit.tipo =  actividad.tipo;
	 actividadEdit.nombre =  actividad.nombre;
	 actividadEdit.encargado = actividad.encargado;
	 actividadEdit.creadoPor =  actividad.creadoPor;
	 actividadEdit.fechaCreacion =  actividad.fechaCreacion;
	return actividadEdit;
    }

  });
