/**
 * @ngdoc function
 * @name wadlFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wadlFormApp
 */
angular.module('wadlFormApp')
  .controller('WadlParser', function ($scope, xmlString) {
  	$scope.inputxml = xmlString;
    $scope.xmlDoc = jQuery.parseXML(xmlString).documentElement;
    	var resourcesXml = jQuery($scope.xmlDoc).find('resource');
    	var resources = {};
    	resources.innerArray = [];
    	resources.base = jQuery($scope.xmlDoc).find("resources").attr("base");
    	resourcesXml.each(function(){
    		resources.innerArray.push(this);
    	});	
    	for (var i = 0; i < resources.innerArray.length; i++) {
    		resources.innerArray[i].methods = [];
    		resources.innerArray[i].path = jQuery(resources.innerArray[i]).attr("path");
    		jQuery(resources.innerArray[i]).find("method").each(function(){
    			resources.innerArray[i].methods.push(this);
        	});	
    		for (var j = 0; j < resources.innerArray[i].methods.length; j++) {
    			resources.innerArray[i].methods[j].params = [];
    			resources.innerArray[i].methods[j].httpMethodName = jQuery(resources.innerArray[i].methods[j]).attr("name");
        		jQuery(resources.innerArray[i].methods[j]).find("param").each(function(){
        			var param = {};
        			param.httpStyle = jQuery(this).attr("style");
        			param.httpType = jQuery(this).attr("type");
        			param.httpName = jQuery(this).attr("name");
        			param.httpDefault = jQuery(this).attr("default");
        			param.xmlNamespaceSchema = jQuery(this).attr("xmlns:xs");
	        		resources.innerArray[i].methods[j].params.push(param);
	        	});	
    		}
    	}
    	$scope.resources = resources;

  });