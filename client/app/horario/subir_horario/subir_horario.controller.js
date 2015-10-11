'use strict';

angular.module('reservasApp')
  .controller('SubirHorarioCtrl', function (Auth, $scope, Upload, $http, $location) {
   
    $scope.grupos = {};

   $scope.$watch('files', function () {
       $scope.upload($scope.files);
   });

   $scope.upload = function (files) {
     if (files){
      var url = 'http://localhost:9000/api/horarios/xlsjson';
      var fd = new FormData();
       fd.append('excel', files[0],'excel.xlsx');

       $http.post(url,fd,{
        transformRequest: angular.identity,
         headers: {
           'Content-Type': undefined,
           'Accept': 'application/json'
         },
         data: fd
       })
       .success(function(data, status, headers) {
         $scope.grupos = data[0].grupo;
         console.log("entra");
        })

     }
   };
  });
