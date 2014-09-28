/**
 * @ngdoc function
 * @name wadlFormApp.controller:WadlParser
 * @description
 * # WadlParser
 * Controller of the wadlFormApp
 */
angular.module('wadlFormApp')
  .controller('WadlParser', function ($scope, $http) {
    $scope.urlBack = 'waiting...';
    $scope.numbersTypes = ['xs:int'];
    $scope.stringsTypes = ['xs:string'];
    $scope.booleansTypes = ['xs:boolean'];

    $scope.resources = {};
    $scope.selectedResource = {};
    $scope.selectedMethod = {};
    $scope.submit = function(){
        $scope.urlBack = 'It\'s working!!!!';
    };

    $scope.onClick = function(url, event){
      $scope.resources  = {};
      var httpResponsePromise = $http.get(url)
        .success(function(data,status,header,config) {
            $scope.urlBack = 'loading wadl...';
            $scope.resources = $scope.parseWadl(data);
            $scope.urlBack = 'wadl loaded';    
        })
        .error(function(data,status,header,config) {
            $scope.urlBack = 'Error';
        });
        
    };


    $scope.parseWadl = function(xmlString){
        var resourcesXml = jQuery(xmlString).find('resource');
        var resources = {};
        resources.innerArray = [];
        var resourcesXmlPoint = jQuery(xmlString).find('resources');
        resources.base = jQuery(xmlString).find('resources').attr('base');
        resourcesXml.each(function(){
          var parents = jQuery(this).parentsUntil(resourcesXmlPoint, "resource");
          var children = jQuery(this).children("resource");
          if(parents.length >= 0 ){
            var currentResource = this;
            if(children.length == 0){
              var concatenatedUrl = '';
              parents.each(function(){
                concatenatedUrl += jQuery(this).attr('path') !== 'undefined' ? jQuery(this).attr('path') : "";
              });
              jQuery(currentResource).attr('path', concatenatedUrl + jQuery(currentResource).attr('path'));
              resources.innerArray.push(currentResource);
            }
          }
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
        return resources;        
    };

    $scope.isNumber = function (param){
        if(typeof param == 'undefined')
            return false;
        for(var i = 0 ; i < $scope.numbersTypes.length ; i ++){
            if(typeof param.httpType != 'undefined' && $scope.numbersTypes[i] == param.httpType){
                return true;
            }
        }
    };

    $scope.isString = function (param){
        if(typeof param == 'undefined')
            return false;
        console.log("isString; param : "+param);
        for(var i = 0 ; i < $scope.stringsTypes.length ; i ++){
            if(typeof param.httpType != 'undefined' && $scope.stringsTypes[i] == param.httpType){
                return true;
            }
        }
    };

    $scope.isBoolean = function (param){
        if(typeof param == 'undefined')
            return false;
        for(var i = 0 ; i < $scope.booleansTypes.length ; i ++){
            if(typeof param.httpType != 'undefined' && $scope.booleansTypes[i] == param.httpType){
                return true;
            }
        }
    };

    $scope.extractParents = function(xmlDomElement){

    };

  });