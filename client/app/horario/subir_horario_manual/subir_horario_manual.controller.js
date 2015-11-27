'use strict';

angular.module('reservasApp')
  .controller('SubirHorarioManualCtrl', function($scope) {
    $scope.grupos = [{

        "0": {
          "codigoMateria": "ACC115",
          "tipo": "GT",
          "numero": 1,
          "cupo": 100,
          "aula": "C11",
          "dia": ["lunes", "miercoles"],
          "franja1": "16:50-18:30",
          "franja2": "16:50-18:30"
        },
        "1": {
          "codigoMateria": "ACC115",
          "tipo": "GD",
          "numero": 1,
          "cupo": 50,
          "aula": "B21",
          "dia": ["jueves"],
          "franja1": "16:50-18:30"
        },
        "2": {
          "codigoMateria": "ACC115",
          "tipo": "GD",
          "numero": 2,
          "cupo": 50,
          "aula": "C23",
          "dia": ["jueves"],
          "franja1": "9:50-11:30"
        },
        "3": {
          "codigoMateria": "PRN115",
          "tipo": "GT",
          "numero": 1,
          "cupo": 100,
          "aula": "D11",
          "dia": ["martes", "viernes"],
          "franja1": "6:20-8:00",
          "franja2": "6:20-8:00"
        },
        "4": {
          "codigoMateria": "PRN115",
          "tipo": "GT",
          "numero": 2,
          "cupo": 100,
          "aula": "B21",
          "dia": ["lunes", "miercoles"],
          "franja1": "6:20-8:00",
          "franja2": "6:20-8:00"
        },
        "5": {
          "codigoMateria": "PRN115",
          "tipo": "GT",
          "numero": 3,
          "cupo": 100,
          "aula": "C32",
          "dia": ["martes", "viernes"],
          "franja1": "6:20-8:00",
          "franja2": "6:20-8:00"
        },
        "7": {
          "codigoMateria": "PRN115",
          "tipo": "GL",
          "numero": 1,
          "cupo": 20,
          "aula": "LCOMP3",
          "dia": ["martes"],
          "franja1": "6:20-8:00"
        },
        "8": {
          "codigoMateria": "PRN115",
          "tipo": "GL",
          "numero": 2,
          "cupo": 25,
          "aula": "LCOMP1",
          "dia": ["viernes"],
          "franja1": "6:20-8:00",

        },
        "9": {
          "codigoMateria": "PRN115",
          "tipo": "GL",
          "numero": 3,
          "cupo": 100,
          "aula": "LCOMP2",
          "dia": ["jueves"],
          "franja1": "6:20-8:00"

        }

    }];

    console.log($scope.grupos);
  });
