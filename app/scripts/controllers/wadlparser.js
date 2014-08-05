/**
 * @ngdoc function
 * @name wadlFormApp.controller:WadlParser
 * @description
 * # WadlParser
 * Controller of the wadlFormApp
 */
angular.module('wadlFormApp')
  .controller('WadlParser', function ($scope, $http) {
    $scope.apiHttpUrl = '';
    $scope.urlBack = 'not working';
    $scope.submit = function(){
        $scope.urlBack = 'It\'s working!!!!';
    };

    $scope.loadWadl = function(apiUrl){
        console.log('apiUrl = '+apiUrl);
        $http.get(apiUrl)
        .success(function(data,status,header,config) {
            console.log(status);
            console.log(header);
            console.log(config);
            var resourcesXml = jQuery(data).find('resource');
            var resources = {};
            resources.innerArray = [];
            resources.base = jQuery(data).find('resources').attr('base');
            resourcesXml.each(function(){
                resources.innerArray.push(this);
            }); 
            for (var i = 0; i < resources.innerArray.length; i++) {
                resources.innerArray[i].methods = [];
                resources.innerArray[i].path = jQuery(resources.innerArray[i]).attr('path');
                jQuery(resources.innerArray[i]).find('method').each(function(){
                    resources.innerArray[i].methods.push(this);
                }); 
                for (var j = 0; j < resources.innerArray[i].methods.length; j++) {
                    resources.innerArray[i].methods[j].params = [];
                    resources.innerArray[i].methods[j].httpMethodName = jQuery(resources.innerArray[i].methods[j]).attr('name');
                    jQuery(resources.innerArray[i].methods[j]).find('param').each(function(){
                        var param = {};
                        param.httpStyle = jQuery(this).attr('style');
                        param.httpType = jQuery(this).attr('type');
                        param.httpName = jQuery(this).attr('name');
                        param.httpDefault = jQuery(this).attr('default');
                        param.xmlNamespaceSchema = jQuery(this).attr('xmlns:xs');
                        resources.innerArray[i].methods[j].params.push(param);
                    }); 
                }
            }
            $scope.resources = resources;
        })
        .error(function(data,status,header,config) {
           console.error('error occured!');
           console.error('status = '+status)
        });
    };
  });