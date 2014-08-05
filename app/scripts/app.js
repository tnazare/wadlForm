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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/wadlparser', {
        templateUrl: 'views/wadlparser.html',
        controller: 'WadlParser'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
