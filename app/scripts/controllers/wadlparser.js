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
    $scope.vidalAuthorization = {"app_id": "1d52aa19","app_key": "7a48a592e71a93c08bfc1dd684816758"};
    $scope.jerseyApiPattern = "api-docs";

    $scope.resources = {};
    $scope.responseFeed = {};
    $scope.requestUrl = '';
    $scope.submit = function(){
        $scope.urlBack = 'It\'s working!!!!';
    };
    $scope.formSubmittedData = {};
    $scope.formSubmittedData.queryParams = {};
    $scope.formSubmittedData.formParams = {};
    $scope.responseAtom = {};

    $scope.loadWadlOnClick = function(url, event){
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
          var childrenResources = jQuery(this).children("resource");
          var childrenMethods = jQuery(this).children("method");
          if(parents.length >= 0 ){
            var currentResource = this;
            if(childrenResources.length == 0 || childrenMethods.length > 0){
              var concatenatedUrl = '';
              parents.each(function(){
                if(jQuery(this).attr('path') !== 'undefined'){
                    if(jQuery(this).attr('path').substring(0,1) != "/"){
                        concatenatedUrl += "/";
                    }
                    concatenatedUrl += jQuery(this).attr('path');
                }
              });
              if(jQuery(currentResource).attr('path') !== 'undefined'
                && jQuery(currentResource).attr('path').substring(0,1) != "/" ){
                    concatenatedUrl += "/";
              }
              concatenatedUrl += jQuery(currentResource).attr('path');
              while (concatenatedUrl.substring(0,1) == "/"){
                concatenatedUrl = concatenatedUrl.substring(1,concatenatedUrl.length);
                console.log("concatenatedUrl = "+concatenatedUrl);
              }
              jQuery(currentResource).attr('path', concatenatedUrl);
              console.log("jQuery(currentResource).attr('path') = " + jQuery(currentResource).attr('path'));
              resources.innerArray.push(currentResource);
            }
          }
        });
        resources.innerArray = resources.innerArray.sort(
            function (a,b){
                var result = 0;
                var aPath = jQuery(a).attr('path');
                var bPath = jQuery(b).attr('path');
                if( aPath > bPath)
                    result = 1;
                if( bPath > aPath)
                    result = -1;
                return result;
            });
        var finished = false;
        var index = 0;
        while(!finished){
            var path = jQuery(resources.innerArray[index]).attr('path');
            // Filtering jersey paths
            if(typeof path === "undefined" || typeof path !== "undefined" && ( path.length == 0 || path.indexOf($scope.jerseyApiPattern) != -1)){
                resources.innerArray.splice(index, 1);
            }
            else{
                index++;
            }
            if(index >= resources.innerArray.length ){
                finished = true;
            }
        }
        for (var i = 0; i < resources.innerArray.length; i++) {
            var path = jQuery(resources.innerArray[i]).attr('path');
            // Filtering jersy paths
            if(path.indexOf($scope.jerseyApiPattern) != -1){
                continue;
            }
            resources.innerArray[i].methods = [];
            resources.innerArray[i].queryParams = [];
            resources.innerArray[i].path = path;
            jQuery(resources.innerArray[i]).find('param').each(function(){
                var currentParam = this;
                if(jQuery(currentParam).parent("resource").length > 0){
                  var param = {};
                  param.httpStyle = jQuery(currentParam).attr('style');
                  param.httpType = jQuery(currentParam).attr('type');
                  param.httpName = jQuery(currentParam).attr('name');
                  param.httpDefault = jQuery(currentParam).attr('default');
                  param.xmlNamespaceSchema = jQuery(currentParam).attr('xmlns:xs');
                  resources.innerArray[i].queryParams.push(param);
                }
            });
            jQuery(resources.innerArray[i]).children('method').each(function(){
                resources.innerArray[i].methods.push(this);
            });
            for (var j = 0; j < resources.innerArray[i].methods.length; j++) {
                resources.innerArray[i].methods[j].params = [];
                resources.innerArray[i].methods[j].httpMethodName = jQuery(resources.innerArray[i].methods[j]).attr('name');
                resources.innerArray[i].methods[j].httpId = jQuery(resources.innerArray[i].methods[j]).attr('id');
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

    $scope.launchRequestOnClick = function(){

        $scope.formSubmittedData.path = $scope.resources.base + $scope.inlineFormParamsInGetRequestPath($scope.inlineUrlParamsInRequestPath($scope.query.selectedResource.path,$scope.formSubmittedData.queryParams),$scope.formSubmittedData.formParams);
        $scope.formSubmittedData.verb = $scope.query.selectedMethod.httpMethodName;

        $scope.formSubmittedData.path = $scope.inlineFormParamsInGetRequestPath($scope.formSubmittedData.path,$scope.vidalAuthorization);
        if($scope.formSubmittedData.verb == "GET"){
            var httpResponsePromise = $http.get($scope.formSubmittedData.path)
                .success(function(data,status,header,config) {
                    $scope.responseXml = data;
                })
                .error(function(data,status,header,config) {
                    console.error("status = "+status);
                });
        }
        $http({
        url: $scope.formSubmittedData.path,
        method: $scope.formSubmittedData.verb
        });
    };

    $scope.inlineUrlParamsInRequestPath = function(path, queryParams){
        var result = path;
        for (var paramKey in queryParams) {
          if (queryParams.hasOwnProperty(paramKey)) {
            result = path.replace('{' + paramKey + '}', queryParams[paramKey]);
          }
        }
        return result;
    };

    $scope.inlineFormParamsInGetRequestPath = function(path, formParams){
        var result = path;
        var questionMarkAppended = result.indexOf("?") == -1? false : true;
        if(questionMarkAppended && result.indexOf("?") != result.length-1){
            result = result + "&"
        }
        for (var paramKey in formParams) {
          if (formParams.hasOwnProperty(paramKey)) {
            if(!questionMarkAppended){
                result = result + '?';
                questionMarkAppended = true;
            }
            result = result + paramKey + "=" + formParams[paramKey];
          }
          result = result +'&'
        }
        if(result.substring(result.length -1 ) == "&"){
            result = result.slice(0,-1);
        }
        return result;
    }

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

    $scope.resourcesAreNotEmpty = function(){
        return typeof $scope.resources !== "undefined"
               && typeof $scope.resources.innerArray !== "undefined"
               && $scope.resources.innerArray.length > 0;
    };

    $scope.selectedResourceHasMethods = function(){
        return typeof $scope.query.selectedResource !== "undefined"
               && typeof $scope.query.selectedResource.methods !== "undefined"
               && typeof $scope.query.selectedResource.methods.length > 0;
    };

    $scope.selectedResourceHasQueryParams = function(){
        return typeof $scope.query.selectedResource !== "undefined"
               && typeof $scope.query.selectedResource.queryParams !== "undefined"
               && typeof $scope.query.selectedResource.queryParams.length > 0;
    };

    $scope.selectedResourceHasFormParams = function(){
        return typeof $scope.query.selectedResource !== "undefined"
               && typeof $scope.query.selectedResource.params !== "undefined"
               && typeof $scope.query.selectedResource.params.length > 0;
    };

    $scope.identifyResourcePath = function(path){
        return path.replace("\/",'_').replace("{","__").replace("}","__");
    };

    $scope.parseXmlToJson = function(response){
        return $scope.extractFeed(response);
    };

    $scope.extractFeed = function(xml){
        var feed = {};
        feed.title = jQuery(xml).children('title').text();
        feed.id = jQuery(xml).children('id').text();
        feed.updated = jQuery(xml).children('updated').text();
        feed.dcDate = jQuery(xml).children('dc\\:date').text();
        feed.opensearch = {};
        feed.opensearch.itemsPerPage = jQuery(xml).children('opensearch\\:itemsPerPage').text();
        feed.opensearch.totalResults = jQuery(xml).children('opensearch\\:totalResults').text();
        feed.opensearch.startIndex = jQuery(xml).children('opensearch\\:startIndex').text();
        feed.links = [];
        jQuery(xml).children('link').each(function(){
            feed.links.push($scope.extractAttributesFromXmlAutoClosingTag(this));
        });
        feed.entries = [];
        jQuery(xml).children('entry').each(function(){
            feed.entries.push($scope.extractAttributesFromXmlAutoClosingTag(this));
        });
        return feed;
    };

    $scope.extractEntry = function(xml){
        var entry = {};
        entry.title = jQuery(xml).children('title').text();
        var author = jQuery(xml).children('author');
        if(author.length > 0 && author[0] != null){
            var name = jQuery(author[0]).children('name');
            if(name.length > 0 && name[0] != null){
                entry.author = {};
                entry.author.name = name[0].innerHTML;
            }
        }
        var id = jQuery(xml).children('id');
        if(id.length > 0 && id[0] != null){
            entry.id = id[0].innerHTML;
        };
        var updated = jQuery(xml).children('updated');
        if(updated.length > 0 && updated[0] != null){
            entry.updated = updated[0].innerHTML;
        };
        var summary = jQuery(xml).children('summary');
        if(summary.length > 0 && summary[0] != null){
            var type = jQuery(summary[0]).attr("type");
            entry.summary = {};
            entry.summary.type = type;
            entry.summary[type] = summary[0].innerHTML;
        };
        var children = jQuery(xml).children('*');
        for (var index = 0 ; index < children.length ; index++){
            var currentChild = children[index];
            // autoclosing tags
            if(currentChild.innerHTML == ""){
                entry = $scope.addObjectToEntry(entry,
                                    currentChild.tagName,
                                    $scope.extractAttributesFromXmlAutoClosingTag(currentChild));
            }
            else if(currentChild.tagName.toLowerCase().indexOf('vidal') != -1){
                var subTagName = currentChild.tagName.toLowerCase().slice(6,currentChild.tagName.length);
                var subTagInnerHTML = currentChild.innerHTML;
                if(typeof entry.vidal == "undefined"){
                    entry.vidal = {};
                }
                entry.vidal[subTagName] = subTagInnerHTML;
            }
            else{
                var subTagName = currentChild.tagName.toLowerCase();
                var subTagInnerHTML = currentChild.innerHTML;
                var subTagObject = {};
                var subTagAttributesArray = $scope.extractAttributesFromStartingTag(currentChild);
                entry[subTagName] = subTagInnerHTML;
            }
        }
        return entry;
    };

    $scope.addObjectToEntry = function(entry, propertyName, object){
        var entryProperty = {};
        if(!entry.hasOwnProperty(propertyName.toLowerCase())
            && !entry.hasOwnProperty(propertyName.toLowerCase()+"s")){
            entryProperty = object;
            entry[propertyName.toLowerCase()] = entryProperty;
        }
        else if(entry.hasOwnProperty(propertyName.toLowerCase())
                && !entry.hasOwnProperty(propertyName.toLowerCase()+"s")
                && typeof entry[propertyName.toLowerCase()] != 'array'){
            var temp = entry[propertyName.toLowerCase()];
            entryProperty = [];
            entryProperty.push(temp);
            entryProperty.push(object);
            entry[propertyName.toLowerCase()+"s"] = entryProperty;
            delete entry[propertyName.toLowerCase()];
        }
        else if(entry.hasOwnProperty(propertyName.toLowerCase()+"s")){
            entry[propertyName.toLowerCase()+"s"].push(object);
        }
        return entry;
    };

    $scope.extractAttributesFromXmlAutoClosingTag = function (xml){
        var result = {};
        var splittedExpression = [];
        if(typeof xml == 'string' ){
            splittedExpression = xml.split(" ");
        }
        else if(typeof xml == 'object' && typeof xml.outerHTML != 'undefined'){
            splittedExpression = xml.outerHTML.split(" ");
        }
        for(expression in splittedExpression){
            if (splittedExpression.hasOwnProperty(expression) && splittedExpression[expression].indexOf("=") != -1) {
                var splittedOnEqualExpression = splittedExpression[expression].split("\"");
                var attributeNameWithoutEqual = splittedOnEqualExpression[0].replace("=","");
                var attributeValueWithoutEndingEqual = splittedOnEqualExpression[0].slice(0, -1);
                result[attributeNameWithoutEqual] = splittedOnEqualExpression[1];
            }
        }
        return result;
    };

    $scope.extractAttributesFromStartingTag = function (xml){
        var result = {};
        var splittedExpression = [];
        var startingTag = "";
        if(typeof xml == 'string' ){
            splittedExpression = xml.split(" ");
            startingTag = xml.slice(0,xml.indexOf(">"));
        }
        else if(typeof xml == 'object' && typeof xml.outerHTML != 'undefined'){
            splittedExpression = xml.outerHTML.split(" ");
            startingTag = xml.outerHTML.slice(0,xml.outerHTML.indexOf(">"));
        }
        for(expression in splittedExpression){
            if (splittedExpression.hasOwnProperty(expression) && splittedExpression[expression].indexOf("=") != -1) {
                var splittedOnEqualExpression = splittedExpression[expression].split("\"");
                var attributeNameWithoutEqual = splittedOnEqualExpression[0].replace("=","");
                var attributeValueWithoutEndingEqual = splittedOnEqualExpression[0].slice(0, -1);
                result[attributeNameWithoutEqual] = splittedOnEqualExpression[1];
            }
        }

        if(jQuery(xml).children("*").length > 0){
            var children = jQuery(xml).contents('*');
            for( var i = 0 ; i < children.length; i++){
                result[children[i].tagName] = $scope.extractAttributesFromStartingTag(children[i].outerHTML);
            };
        }
        else{
            result.innerText     = xml.innerHTML;
        }
        return result;
    };
  });
