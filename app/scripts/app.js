'use strict';

/**
 * @ngdoc overview
 * @name wadlFormApp
 * @description
 * # wadlFormApp
 *
 * Main module of the application.
 */
angular
  .module('wadlFormApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularSmoothscroll'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/wadlparser.html',
        controller: 'WadlParser'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
