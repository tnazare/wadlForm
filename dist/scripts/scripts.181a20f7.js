"use strict";angular.module("wadlFormApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","angularSmoothscroll"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/wadlparser",{templateUrl:"views/wadlparser.html",controller:"WadlParser"}).otherwise({redirectTo:"/"})}]),angular.module("wadlFormApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("wadlFormApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("wadlFormApp").controller("WadlParser",["$scope","$http",function(a,b){a.urlBack="waiting...",a.numbersTypes=["xs:int"],a.stringsTypes=["xs:string"],a.booleansTypes=["xs:boolean"],a.vidalAuthorization={app_id:"1d52aa19",app_key:"7a48a592e71a93c08bfc1dd684816758"},a.jerseyApiPattern="/api-docs",a.resources={},a.requestUrl="",a.submit=function(){a.urlBack="It's working!!!!"},a.formSubmittedData={},a.formSubmittedData.queryParams={},a.formSubmittedData.formParams={},a.responseAtom={},a.loadWadlOnClick=function(c){b.get(c).success(function(b){a.urlBack="loading wadl...",a.resources=a.parseWadl(b),a.urlBack="wadl loaded"}).error(function(){a.urlBack="Error"})},a.parseWadl=function(b){var c=jQuery(b).find("resource"),d={};d.innerArray=[];var e=jQuery(b).find("resources");d.base=jQuery(b).find("resources").attr("base"),c.each(function(){var a=jQuery(this).parentsUntil(e,"resource"),b=jQuery(this).children("resource"),c=jQuery(this).children("method");if(a.length>=0){var f=this;if(0==b.length||c.length>0){var g="";a.each(function(){g+="undefined"!==jQuery(this).attr("path")?jQuery(this).attr("path"):""}),jQuery(f).attr("path",g+jQuery(f).attr("path")),d.innerArray.push(f)}}}),d.innerArray=d.innerArray.sort(function(a,b){var c=0,d=jQuery(a).attr("path"),e=jQuery(b).attr("path");return d>e&&(c=1),e>d&&(c=-1),c});for(var f=!1,g=0;!f;){var h=jQuery(d.innerArray[g]).attr("path");"undefined"!=typeof h&&-1!=h.indexOf(a.jerseyApiPattern)&&d.innerArray.splice(g,1),g++,g>=d.innerArray.length&&(f=!0)}for(var i=0;i<d.innerArray.length;i++){var h=jQuery(d.innerArray[i]).attr("path");if(-1==h.indexOf(a.jerseyApiPattern)){d.innerArray[i].methods=[],d.innerArray[i].queryParams=[],d.innerArray[i].path=h,jQuery(d.innerArray[i]).find("param").each(function(){var a=this;if(jQuery(a).parent("resource").length>0){var b={};b.httpStyle=jQuery(a).attr("style"),b.httpType=jQuery(a).attr("type"),b.httpName=jQuery(a).attr("name"),b.httpDefault=jQuery(a).attr("default"),b.xmlNamespaceSchema=jQuery(a).attr("xmlns:xs"),d.innerArray[i].queryParams.push(b)}}),jQuery(d.innerArray[i]).children("method").each(function(){d.innerArray[i].methods.push(this)});for(var j=0;j<d.innerArray[i].methods.length;j++)d.innerArray[i].methods[j].params=[],d.innerArray[i].methods[j].httpMethodName=jQuery(d.innerArray[i].methods[j]).attr("name"),d.innerArray[i].methods[j].httpId=jQuery(d.innerArray[i].methods[j]).attr("id"),jQuery(d.innerArray[i].methods[j]).find("param").each(function(){var a={};a.httpStyle=jQuery(this).attr("style"),a.httpType=jQuery(this).attr("type"),a.httpName=jQuery(this).attr("name"),a.httpDefault=jQuery(this).attr("default"),a.xmlNamespaceSchema=jQuery(this).attr("xmlns:xs"),d.innerArray[i].methods[j].params.push(a)})}}return d},a.launchRequestOnClick=function(){if(a.formSubmittedData.path=a.resources.base+a.inlineFormParamsInGetRequestPath(a.inlineUrlParamsInRequestPath(a.query.selectedResource.path,a.formSubmittedData.queryParams),a.formSubmittedData.formParams),a.formSubmittedData.verb=a.query.selectedMethod.httpMethodName,a.formSubmittedData.path=a.inlineFormParamsInGetRequestPath(a.formSubmittedData.path,a.vidalAuthorization),"GET"==a.formSubmittedData.verb){b.get(a.formSubmittedData.path).success(function(b){a.responseXml=b}).error(function(a,b){console.error("status = "+b)})}b({url:a.formSubmittedData.path,method:a.formSubmittedData.verb})},a.inlineUrlParamsInRequestPath=function(a,b){var c=a;for(var d in b)b.hasOwnProperty(d)&&(c=a.replace("{"+d+"}",b[d]));return c},a.inlineFormParamsInGetRequestPath=function(a,b){var c=a,d=-1==c.indexOf("?")?!1:!0;d&&c.indexOf("?")!=c.length-1&&(c+="&");for(var e in b)b.hasOwnProperty(e)&&(d||(c+="?",d=!0),c=c+e+"="+b[e]),c+="&";return"&"==c.substring(c.length-1)&&(c=c.slice(0,-1)),c},a.isNumber=function(b){if("undefined"==typeof b)return!1;for(var c=0;c<a.numbersTypes.length;c++)if("undefined"!=typeof b.httpType&&a.numbersTypes[c]==b.httpType)return!0},a.isString=function(b){if("undefined"==typeof b)return!1;console.log("isString; param : "+b);for(var c=0;c<a.stringsTypes.length;c++)if("undefined"!=typeof b.httpType&&a.stringsTypes[c]==b.httpType)return!0},a.isBoolean=function(b){if("undefined"==typeof b)return!1;for(var c=0;c<a.booleansTypes.length;c++)if("undefined"!=typeof b.httpType&&a.booleansTypes[c]==b.httpType)return!0},a.resourcesAreNotEmpty=function(){return console.log("passe dans selectedResourceHasMethods = "),"undefined"!=typeof a.resources&&"undefined"!=typeof a.resources.innerArray&&a.resources.innerArray.length>0},a.selectedResourceHasMethods=function(){return console.log("passe dans selectedResourceHasMethods = "),"undefined"!=typeof a.query.selectedResource&&"undefined"!=typeof a.query.selectedResource.methods&&typeof a.query.selectedResource.methods.length>0},a.selectedResourceHasQueryParams=function(){return console.log("passe dans selectedResourceHasQueryParams = "),"undefined"!=typeof a.query.selectedResource&&"undefined"!=typeof a.query.selectedResource.queryParams&&typeof a.query.selectedResource.queryParams.length>0},a.selectedResourceHasFormParams=function(){return console.log("passe dans selectedResourceHasFormParams = "),"undefined"!=typeof a.query.selectedResource&&"undefined"!=typeof a.query.selectedResource.params&&typeof a.query.selectedResource.params.length>0},a.identifyResourcePath=function(a){return a.replace("/","_").replace("{","__").replace("}","__")}}]);